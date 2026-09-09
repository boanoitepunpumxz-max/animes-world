const { query } = require('../utils/db');

// ── Helper: cria notificação ──────────────────────────────────
async function createNotification(userId, type, title, message, ticketId = null) {
  if (!userId) return;
  const actionUrl = ticketId ? `/meus-tickets/${ticketId}` : null;
  await query(
    `INSERT INTO notifications (user_id, type, title, message, ticket_id, action_url)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, type, title, message, ticketId, actionUrl]
  ).catch(() => {});
}

// ── Helper: notifica todos os admins/mods ────────────────────
async function notifyAdmins(type, title, message, ticketId) {
  const admins = await query(
    `SELECT id FROM users WHERE role IN ('admin','moderator') AND status = 'active'`
  );
  for (const a of admins.rows) {
    await createNotification(a.id, type, title, message, ticketId);
  }
}

// ── POST /api/support — cria ticket ──────────────────────────
async function createTicket(req, res, next) {
  try {
    const { subject, category, message } = req.body;
    if (!subject || !category || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const userId = req.user.id;

    // Cria o ticket
    const result = await query(
      `INSERT INTO support_tickets
         (user_id, subject, category, message, status, last_message_at)
       VALUES ($1, $2, $3, $4, 'open', NOW())
       RETURNING id, ticket_number, subject, category, status, created_at`,
      [userId, subject.trim(), category, message.trim()]
    );
    const ticket = result.rows[0];

    // Salva a mensagem inicial do usuário no chat
    await query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, sender_type, message)
       VALUES ($1, $2, 'USER', $3)`,
      [ticket.id, userId, message.trim()]
    );

    // Notifica todos os admins
    await notifyAdmins(
      'new_ticket',
      '🎫 Novo ticket de suporte',
      `${req.user.username} abriu o ticket #${String(ticket.ticket_number).padStart(5,'0')}: "${subject}"`,
      ticket.id
    );

    res.status(201).json({
      message: 'Ticket criado com sucesso!',
      ticket,
    });
  } catch (err) { next(err); }
}

// ── GET /api/support/my-tickets — lista tickets do usuário ───
async function getMyTickets(req, res, next) {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    const params = [userId];
    let where = 'WHERE t.user_id = $1';

    if (status) {
      params.push(status);
      where += ` AND t.status = $2`;
    }

    const result = await query(
      `SELECT
         t.id, t.ticket_number, t.subject, t.category, t.status,
         t.created_at, t.updated_at, t.last_message_at, t.assigned_at,
         u_assigned.username AS assigned_to_name,
         u_assigned.avatar_url AS assigned_to_avatar,
         (SELECT tm.message FROM ticket_messages tm
          WHERE tm.ticket_id = t.id ORDER BY tm.created_at DESC LIMIT 1) AS last_message,
         (SELECT tm.sender_type FROM ticket_messages tm
          WHERE tm.ticket_id = t.id ORDER BY tm.created_at DESC LIMIT 1) AS last_sender_type,
         (SELECT COUNT(*) FROM ticket_messages tm
          WHERE tm.ticket_id = t.id AND tm.read_at IS NULL
          AND tm.sender_type != 'USER') AS unread_count
       FROM support_tickets t
       LEFT JOIN users u_assigned ON u_assigned.id = t.assigned_to
       ${where}
       ORDER BY t.last_message_at DESC`,
      params
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ── GET /api/support/tickets/:id — detalhes do ticket ────────
async function getTicket(req, res, next) {
  try {
    const { id } = req.params;
    const userId  = req.user.id;
    const isAdmin = ['admin','moderator'].includes(req.user.role);

    const result = await query(
      `SELECT
         t.*,
         u.username AS user_name, u.email AS user_email, u.avatar_url AS user_avatar,
         ua.username AS assigned_to_name, ua.avatar_url AS assigned_to_avatar
       FROM support_tickets t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN users ua ON ua.id = t.assigned_to
       WHERE t.id = $1`,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Ticket não encontrado.' });
    }

    const ticket = result.rows[0];

    // Segurança: usuário só vê seu próprio ticket
    if (!isAdmin && ticket.user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Busca mensagens do chat
    const messages = await query(
      `SELECT
         tm.id, tm.sender_type, tm.message, tm.read_at, tm.created_at,
         u.username AS sender_name, u.avatar_url AS sender_avatar
       FROM ticket_messages tm
       LEFT JOIN users u ON u.id = tm.sender_id
       WHERE tm.ticket_id = $1
       ORDER BY tm.created_at ASC`,
      [id]
    );

    // Marca mensagens do outro lado como lidas
    if (isAdmin) {
      // Admin lendo: marca mensagens do usuário como lidas
      await query(
        `UPDATE ticket_messages SET read_at = NOW()
         WHERE ticket_id = $1 AND sender_type = 'USER' AND read_at IS NULL`,
        [id]
      );
    } else {
      // Usuário lendo: marca mensagens do admin como lidas
      await query(
        `UPDATE ticket_messages SET read_at = NOW()
         WHERE ticket_id = $1 AND sender_type IN ('ADMIN','MODERATOR','SYSTEM') AND read_at IS NULL`,
        [id]
      );
    }

    ticket.messages = messages.rows;
    res.json({ data: ticket });
  } catch (err) { next(err); }
}

// ── POST /api/support/tickets/:id/messages — envia mensagem ──
async function sendMessage(req, res, next) {
  try {
    const { id }    = req.params;
    const { message } = req.body;
    const userId    = req.user.id;
    const isAdmin   = ['admin','moderator'].includes(req.user.role);

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem não pode ser vazia.' });
    }

    // Verifica se o ticket existe e pertence ao usuário (ou é admin)
    const ticketResult = await query(
      'SELECT * FROM support_tickets WHERE id = $1',
      [id]
    );
    if (!ticketResult.rows[0]) {
      return res.status(404).json({ error: 'Ticket não encontrado.' });
    }
    const ticket = ticketResult.rows[0];

    if (!isAdmin && ticket.user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Ticket fechado — não aceita mais mensagens
    if (ticket.status === 'closed') {
      return res.status(400).json({ error: 'Ticket encerrado. Não é possível enviar mensagens.' });
    }

    const senderType = isAdmin
      ? (req.user.role === 'admin' ? 'ADMIN' : 'MODERATOR')
      : 'USER';

    const msgResult = await query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, sender_type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_type, message, created_at`,
      [id, userId, senderType, message.trim()]
    );
    const newMessage = msgResult.rows[0];

    // Notificações
    const ticketNum = `#${String(ticket.ticket_number).padStart(5,'0')}`;
    if (isAdmin) {
      // Admin enviou: notifica o usuário dono do ticket
      await createNotification(
        ticket.user_id,
        'new_message',
        '💬 Nova resposta no seu ticket',
        `O suporte respondeu seu ticket ${ticketNum}.`,
        id
      );
      // Se ainda era "open", muda para "in_progress" automaticamente
      if (ticket.status === 'open') {
        await query(
          `UPDATE support_tickets SET status='in_progress', updated_at=NOW() WHERE id=$1`,
          [id]
        );
      }
    } else {
      // Usuário enviou: notifica o admin responsável (ou todos)
      const target = ticket.assigned_to;
      if (target) {
        await createNotification(
          target,
          'new_message',
          '💬 Nova mensagem do usuário',
          `${req.user.username} enviou uma mensagem no ticket ${ticketNum}.`,
          id
        );
      } else {
        await notifyAdmins(
          'new_message',
          '💬 Nova mensagem do usuário',
          `${req.user.username} enviou uma mensagem no ticket ${ticketNum}.`,
          id
        );
      }
    }

    // Retorna mensagem com info do remetente
    newMessage.sender_name   = req.user.username;
    newMessage.sender_avatar = req.user.avatar_url;

    res.status(201).json({ data: newMessage });
  } catch (err) { next(err); }
}

// ── PATCH /api/support/tickets/:id/status — muda status ──────
async function updateTicketStatus(req, res, next) {
  try {
    const { id }     = req.params;
    const { status } = req.body;
    const userId     = req.user.id;
    const isAdmin    = ['admin','moderator'].includes(req.user.role);

    const valid = ['open','in_progress','resolved','closed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const ticketResult = await query('SELECT * FROM support_tickets WHERE id = $1', [id]);
    if (!ticketResult.rows[0]) {
      return res.status(404).json({ error: 'Ticket não encontrado.' });
    }
    const ticket = ticketResult.rows[0];

    if (!isAdmin && ticket.user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Usuário normal só pode fechar seu próprio ticket
    if (!isAdmin && !['closed'].includes(status)) {
      return res.status(403).json({ error: 'Sem permissão para alterar este status.' });
    }

    const extraFields = [];
    if (status === 'resolved') extraFields.push(`resolved_at = NOW()`);
    if (status === 'closed')   extraFields.push(`closed_at = NOW()`);
    if (status === 'in_progress' && !ticket.assigned_to) {
      extraFields.push(`assigned_to = '${userId}'`, `assigned_at = NOW()`);
    }

    const setClause = [`status = '${status}'`, 'updated_at = NOW()', ...extraFields].join(', ');
    await query(`UPDATE support_tickets SET ${setClause} WHERE id = $1`, [id]);

    // Mensagem de sistema
    const statusLabels = {
      in_progress: 'em atendimento',
      resolved:    'resolvido',
      closed:      'encerrado',
      open:        'reaberto',
    };
    await query(
      `INSERT INTO ticket_messages (ticket_id, sender_type, message)
       VALUES ($1, 'SYSTEM', $2)`,
      [id, `Ticket marcado como ${statusLabels[status] || status}.`]
    );

    // Notificações
    const ticketNum = `#${String(ticket.ticket_number).padStart(5,'0')}`;
    if (isAdmin) {
      if (status === 'resolved') {
        await createNotification(ticket.user_id, 'ticket_resolved',
          '✅ Ticket resolvido',
          `Seu ticket ${ticketNum} foi marcado como resolvido.`, id);
      } else if (status === 'closed') {
        await createNotification(ticket.user_id, 'ticket_closed',
          '🔒 Ticket encerrado',
          `Seu ticket ${ticketNum} foi encerrado.`, id);
      }
    }

    res.json({ message: 'Status atualizado.', status });
  } catch (err) { next(err); }
}

// ── PATCH /api/support/tickets/:id/assign — assume ticket ────
async function assignTicket(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!['admin','moderator'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Sem permissão.' });
    }

    const ticketResult = await query('SELECT * FROM support_tickets WHERE id = $1', [id]);
    if (!ticketResult.rows[0]) return res.status(404).json({ error: 'Ticket não encontrado.' });
    const ticket = ticketResult.rows[0];

    await query(
      `UPDATE support_tickets
       SET assigned_to=$1, assigned_at=NOW(), status='in_progress', updated_at=NOW()
       WHERE id=$2`,
      [userId, id]
    );

    // Mensagem de sistema
    await query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, sender_type, message)
       VALUES ($1, $2, 'SYSTEM', $3)`,
      [id, userId, `Ticket assumido por ${req.user.username}.`]
    );

    // Notifica o usuário
    const ticketNum = `#${String(ticket.ticket_number).padStart(5,'0')}`;
    await createNotification(
      ticket.user_id,
      'ticket_assigned',
      '👤 Ticket em atendimento',
      `Seu ticket ${ticketNum} foi assumido por ${req.user.username} e está sendo atendido.`,
      id
    );

    res.json({ message: 'Ticket assumido.', assigned_to: userId });
  } catch (err) { next(err); }
}

// ── GET /api/admin/tickets — lista todos os tickets (admin) ──
async function adminGetTickets(req, res, next) {
  try {
    const { status, page = 1, limit = 20, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (status) { params.push(status); conditions.push(`t.status = $${params.length}`); }
    if (q)      { params.push(`%${q}%`); conditions.push(`(t.subject ILIKE $${params.length} OR u.username ILIKE $${params.length} OR u.email ILIKE $${params.length})`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countR = await query(
      `SELECT COUNT(*) FROM support_tickets t JOIN users u ON u.id = t.user_id ${where}`,
      params
    );
    const total = parseInt(countR.rows[0].count);

    params.push(parseInt(limit)); params.push(offset);
    const result = await query(
      `SELECT
         t.id, t.ticket_number, t.subject, t.category, t.status, t.priority,
         t.created_at, t.updated_at, t.last_message_at,
         u.username AS user_name, u.email AS user_email, u.avatar_url AS user_avatar,
         ua.username AS assigned_to_name,
         (SELECT COUNT(*) FROM ticket_messages tm
          WHERE tm.ticket_id = t.id AND tm.read_at IS NULL
          AND tm.sender_type = 'USER') AS unread_count
       FROM support_tickets t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN users ua ON ua.id = t.assigned_to
       ${where}
       ORDER BY
         CASE t.status WHEN 'open' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,
         t.last_message_at DESC
       LIMIT $${params.length-1} OFFSET $${params.length}`,
      params
    );

    // Contagens por status
    const counts = await query(
      `SELECT status, COUNT(*) FROM support_tickets GROUP BY status`
    );
    const statusCounts = {};
    counts.rows.forEach(r => { statusCounts[r.status] = parseInt(r.count); });

    res.json({
      data: result.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/parseInt(limit)) },
      statusCounts,
    });
  } catch (err) { next(err); }
}

// ── PATCH /api/admin/tickets/:id — responder ticket (admin) ──
async function adminReplyTicket(req, res, next) {
  try {
    const { id } = req.params;
    const { message, status } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem obrigatória.' });
    }

    const ticketResult = await query('SELECT * FROM support_tickets WHERE id = $1', [id]);
    if (!ticketResult.rows[0]) return res.status(404).json({ error: 'Ticket não encontrado.' });
    const ticket = ticketResult.rows[0];

    const senderType = req.user.role === 'admin' ? 'ADMIN' : 'MODERATOR';

    // Salva mensagem
    const msgResult = await query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, sender_type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_type, message, created_at`,
      [id, req.user.id, senderType, message.trim()]
    );

    // Atualiza status se fornecido
    if (status) {
      const extra = status === 'resolved' ? `, resolved_at=NOW()` : status === 'closed' ? `, closed_at=NOW()` : '';
      await query(
        `UPDATE support_tickets SET status=$1, admin_reply=$2, updated_at=NOW()${extra} WHERE id=$3`,
        [status, message.trim(), id]
      );
      // Mensagem de sistema de mudança de status
      const labels = { resolved:'resolvido', closed:'encerrado', in_progress:'em atendimento' };
      if (labels[status]) {
        await query(
          `INSERT INTO ticket_messages (ticket_id, sender_type, message) VALUES ($1,'SYSTEM',$2)`,
          [id, `Ticket marcado como ${labels[status]}.`]
        );
      }
    } else {
      // Sem mudança de status — só garante assigned
      await query(
        `UPDATE support_tickets
         SET admin_reply=$1, updated_at=NOW(),
             assigned_to=COALESCE(assigned_to,$2), assigned_at=COALESCE(assigned_at,NOW()),
             status=CASE WHEN status='open' THEN 'in_progress' ELSE status END
         WHERE id=$3`,
        [message.trim(), req.user.id, id]
      );
    }

    // Notifica o usuário
    const ticketNum = `#${String(ticket.ticket_number).padStart(5,'0')}`;
    await createNotification(
      ticket.user_id, 'new_message',
      '💬 Nova resposta no seu ticket',
      `O suporte respondeu seu ticket ${ticketNum}.`,
      id
    );

    const newMsg = msgResult.rows[0];
    newMsg.sender_name   = req.user.username;
    newMsg.sender_avatar = req.user.avatar_url;

    res.json({ message: 'Resposta enviada.', data: newMsg });
  } catch (err) { next(err); }
}

// ── GET /api/support/tickets/:id/messages — polling de msgs ──
async function getMessages(req, res, next) {
  try {
    const { id }    = req.params;
    const { since } = req.query; // ISO timestamp para polling
    const userId    = req.user.id;
    const isAdmin   = ['admin','moderator'].includes(req.user.role);

    const ticketResult = await query('SELECT user_id FROM support_tickets WHERE id=$1', [id]);
    if (!ticketResult.rows[0]) return res.status(404).json({ error: 'Ticket não encontrado.' });

    if (!isAdmin && ticketResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const params = [id];
    let timeFilter = '';
    if (since) {
      params.push(since);
      timeFilter = `AND tm.created_at > $2`;
    }

    const result = await query(
      `SELECT
         tm.id, tm.sender_type, tm.message, tm.read_at, tm.created_at,
         u.username AS sender_name, u.avatar_url AS sender_avatar
       FROM ticket_messages tm
       LEFT JOIN users u ON u.id = tm.sender_id
       WHERE tm.ticket_id = $1 ${timeFilter}
       ORDER BY tm.created_at ASC`,
      params
    );

    // Marca como lidas
    if (isAdmin) {
      await query(
        `UPDATE ticket_messages SET read_at=NOW()
         WHERE ticket_id=$1 AND sender_type='USER' AND read_at IS NULL`, [id]
      );
    } else {
      await query(
        `UPDATE ticket_messages SET read_at=NOW()
         WHERE ticket_id=$1 AND sender_type IN ('ADMIN','MODERATOR','SYSTEM') AND read_at IS NULL`, [id]
      );
    }

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

module.exports = {
  createTicket, getMyTickets, getTicket,
  sendMessage, updateTicketStatus, assignTicket,
  adminGetTickets, adminReplyTicket, getMessages,
};
