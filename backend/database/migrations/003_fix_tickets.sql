-- ============================================================
-- Migration 003: Garante estrutura correta de tickets
-- ============================================================

-- Garante que admin_reply existe
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS admin_reply TEXT;

-- Garante que assigned_to, assigned_at, resolved_at, closed_at existem
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS assigned_to  UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS assigned_at  TIMESTAMPTZ;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS resolved_at  TIMESTAMPTZ;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS closed_at    TIMESTAMPTZ;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT NOW();

-- Garante que resolved_by e closed_by existem
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS resolved_by  UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS closed_by    UUID REFERENCES users(id) ON DELETE SET NULL;

-- Garante ticket_number é serial
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='support_tickets' AND column_name='ticket_number'
  ) THEN
    ALTER TABLE support_tickets ADD COLUMN ticket_number SERIAL;
  END IF;
END $$;

-- Corrige constraint de status
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_status_check;
ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_status_check
  CHECK (status IN ('open','in_progress','resolved','closed'));

-- Garante ticket_messages existe com estrutura correta
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

CREATE INDEX IF NOT EXISTS idx_tmsg_ticket ON ticket_messages(ticket_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_tmsg_sender ON ticket_messages(sender_id);

-- Garante que notifications tem ticket_id e action_url
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS ticket_id   UUID REFERENCES support_tickets(id) ON DELETE SET NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url  TEXT;

-- Trigger para atualizar last_message_at
CREATE OR REPLACE FUNCTION update_ticket_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_tickets SET last_message_at=NOW(), updated_at=NOW() WHERE id=NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ticket_last_message ON ticket_messages;
CREATE TRIGGER trg_ticket_last_message
  AFTER INSERT ON ticket_messages
  FOR EACH ROW EXECUTE FUNCTION update_ticket_last_message();

-- Popula last_message_at para tickets sem ela
UPDATE support_tickets SET last_message_at = updated_at WHERE last_message_at IS NULL;

-- Confirma
SELECT
  (SELECT COUNT(*) FROM support_tickets)  AS total_tickets,
  (SELECT COUNT(*) FROM ticket_messages)  AS total_messages,
  (SELECT COUNT(*) FROM notifications)    AS total_notifications;
