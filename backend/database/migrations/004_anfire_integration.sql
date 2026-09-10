-- ============================================================
-- Migration 004: Integração AnFireAPI
-- Tabelas auxiliares — NÃO altera estrutura existente
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Mapeamento externo: anime interno ↔ fonte externa
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anime_external_sources (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id       UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  provider       VARCHAR(50)  NOT NULL DEFAULT 'anfire',
  external_slug  VARCHAR(500) NOT NULL,   -- slug usado na AnFireAPI
  external_title VARCHAR(500),            -- título exato encontrado na fonte
  external_url   TEXT,                    -- URL completa na fonte
  match_score    DECIMAL(5,2),            -- 0-100: confiança do matching
  match_method   VARCHAR(50),             -- title_exact | title_norm | slug_match
  status         VARCHAR(30)  NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','synced','partial','error','review_required')),
  last_synced_at TIMESTAMPTZ,
  episode_count  INTEGER DEFAULT 0,
  cover_fetched  BOOLEAN DEFAULT FALSE,
  notes          TEXT,                    -- motivo de review, erros etc.
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(anime_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_aes_provider ON anime_external_sources(provider, status);
CREATE INDEX IF NOT EXISTS idx_aes_anime    ON anime_external_sources(anime_id);

-- ─────────────────────────────────────────────────────────────
-- Jobs de importação: checkpoint + progresso
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS import_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type        VARCHAR(50)  NOT NULL,
  -- Tipos: analyze | sync_covers | sync_episodes | sync_all | dry_run
  provider        VARCHAR(50)  NOT NULL DEFAULT 'anfire',
  status          VARCHAR(30)  NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','running','paused','completed','failed','cancelled')),
  is_dry_run      BOOLEAN DEFAULT FALSE,
  total           INTEGER DEFAULT 0,
  processed       INTEGER DEFAULT 0,
  matched         INTEGER DEFAULT 0,
  updated         INTEGER DEFAULT 0,
  episodes_added  INTEGER DEFAULT 0,
  covers_added    INTEGER DEFAULT 0,
  banners_added   INTEGER DEFAULT 0,
  errors          INTEGER DEFAULT 0,
  skipped         INTEGER DEFAULT 0,
  review_required INTEGER DEFAULT 0,
  current_anime   VARCHAR(500),           -- título do anime sendo processado agora
  checkpoint_id   UUID,                   -- último anime_id processado (retomar de aqui)
  error_details   JSONB DEFAULT '[]',
  result_summary  JSONB,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  finished_at     TIMESTAMPTZ,
  started_by      UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON import_jobs(status, started_at DESC);

-- ─────────────────────────────────────────────────────────────
-- Log detalhado de cada operação de importação
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS import_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID NOT NULL REFERENCES import_jobs(id) ON DELETE CASCADE,
  anime_id    UUID REFERENCES anime(id) ON DELETE SET NULL,
  level       VARCHAR(10) NOT NULL DEFAULT 'INFO'
              CHECK (level IN ('INFO','WARN','ERROR','SKIP','MATCH','BLOCK')),
  message     TEXT NOT NULL,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_logs_job ON import_logs(job_id, created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER trg_aes_updated
  BEFORE UPDATE ON anime_external_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_import_jobs_updated
  BEFORE UPDATE ON import_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Confirma
SELECT
  (SELECT COUNT(*) FROM anime)                    AS animes,
  (SELECT COUNT(*) FROM episode_sources)          AS episode_sources,
  (SELECT COUNT(*) FROM anime_external_sources)   AS ext_sources,
  (SELECT COUNT(*) FROM import_jobs)              AS import_jobs;
