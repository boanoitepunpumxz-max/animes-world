const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');

router.post('/', async (req, res, next) => {
  try {
    const { subject, category, message } = req.body;
    if (!subject || !category || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const result = await query(
      `INSERT INTO support_tickets (user_id, subject, category, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.user.id, subject, category, message]
    );

    res.status(201).json({
      message: 'Ticket aberto com sucesso. Responderemos em breve.',
      ticketId: result.rows[0].id,
    });
  } catch (err) { next(err); }
});

router.get('/my-tickets', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, subject, category, status, priority, message, admin_reply, created_at, updated_at
       FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
});

module.exports = router;
