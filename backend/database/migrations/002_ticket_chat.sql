-- ============================================================
-- ANIMES WORLD — Migration 002: Sistema de Tickets com Chat
-- ============================================================

-- Adiciona colunas faltantes na tabela support_tickets
ALTER TABLE support_tickets
  ADD COLUMN IF NOT EXISTS assigned_to    UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resolved_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS closed_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS ticket_number  SERIAL;

-- Corrige constraint de status para incluir todos os estados
ALTER TABLE support_tickets
  DROP CONSTRAINT IF EXISTS support_tickets_status_check;

ALTER TABLE support_tickets
  ADD CONSTRAINT support_tickets_status_check
  CHECK (status IN ('open','in_progress','resolved','closed'));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tickets_user    ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status  ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON support_tickets(assigned_to);

-- ─────────────────────────────────────────────────────────────
-- MENSAGENS DOS TICKETS (chat)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id     UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_type   VARCHAR(20) NOT NULL DEFAULT 'USER'
                CHECK (sender_type IN ('USER','ADMIN','MODERATOR','SYSTEM')),
  message       TEXT NOT NULL,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmsg_ticket  ON ticket_messages(ticket_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_tmsg_sender  ON ticket_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_tmsg_unread  ON ticket_messages(ticket_id, read_at) WHERE read_at IS NULL;

-- ─────────────────────────────────────────────────────────────
-- ATUALIZA notifications PARA SUPORTAR LINK DE TICKET
-- ─────────────────────────────────────────────────────────────
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS ticket_id UUID REFERENCES support_tickets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS action_url TEXT;

-- ─────────────────────────────────────────────────────────────
-- AVATAR: adicionar coluna de storage local (além de URL)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar_type VARCHAR(10) DEFAULT 'url'
  CHECK (avatar_type IN ('url', 'upload'));

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: atualiza last_message_at no ticket quando nova msg
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_ticket_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_tickets
  SET last_message_at = NOW(), updated_at = NOW()
  WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ticket_last_message ON ticket_messages;
CREATE TRIGGER trg_ticket_last_message
  AFTER INSERT ON ticket_messages
  FOR EACH ROW EXECUTE FUNCTION update_ticket_last_message();

-- Migra admin_reply existente para ticket_messages (se houver)
INSERT INTO ticket_messages (ticket_id, sender_type, message, created_at)
SELECT
  id,
  'ADMIN',
  admin_reply,
  updated_at
FROM support_tickets
WHERE admin_reply IS NOT NULL AND admin_reply != ''
ON CONFLICT DO NOTHING;

-- Migra a mensagem inicial do usuário para ticket_messages
INSERT INTO ticket_messages (ticket_id, sender_id, sender_type, message, created_at)
SELECT
  t.id,
  t.user_id,
  'USER',
  t.message,
  t.created_at
FROM support_tickets t
WHERE t.message IS NOT NULL AND t.message != ''
ON CONFLICT DO NOTHING;
