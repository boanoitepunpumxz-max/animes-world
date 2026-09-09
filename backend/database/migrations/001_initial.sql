-- ============================================================
-- ANIMES WORLD — Migration 001: Schema Inicial
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─────────────────────────────────────────────────────────────
-- USUÁRIOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  role          VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  status        VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'banned', 'suspended')),
  bio           TEXT,
  birth_date    DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ─────────────────────────────────────────────────────────────
-- SESSÕES / TOKENS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_resets (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- LOGS DE ACESSO / SEGURANÇA
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS access_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  action        VARCHAR(100) NOT NULL,
  ip_address    INET NOT NULL,
  user_agent    TEXT,
  path          TEXT,
  method        VARCHAR(10),
  status_code   INTEGER,
  metadata      JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_logs_user ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_ip ON access_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_access_logs_created ON access_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS login_attempts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        VARCHAR(255),
  ip_address   INET NOT NULL,
  success      BOOLEAN NOT NULL,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);

-- ─────────────────────────────────────────────────────────────
-- GÊNEROS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS genres (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  icon       VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- ANIMES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anime (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id         INTEGER UNIQUE,
  slug                VARCHAR(255) UNIQUE NOT NULL,
  title               VARCHAR(500) NOT NULL,
  title_english       VARCHAR(500),
  title_japanese      VARCHAR(500),
  title_romaji        VARCHAR(500),
  description         TEXT,
  cover_url           TEXT,
  banner_url          TEXT,
  background_url      TEXT,
  trailer_url         TEXT,
  year                INTEGER,
  season              VARCHAR(20) CHECK (season IN ('WINTER','SPRING','SUMMER','FALL')),
  status              VARCHAR(30) DEFAULT 'RELEASING',
  type                VARCHAR(30) DEFAULT 'TV',
  episodes_count      INTEGER DEFAULT 0,
  duration            INTEGER,
  studio              VARCHAR(255),
  score               DECIMAL(4,2),
  popularity          INTEGER DEFAULT 0,
  is_adult            BOOLEAN DEFAULT FALSE,
  is_hidden           BOOLEAN DEFAULT FALSE,
  meta_title          VARCHAR(500),
  meta_description    TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anime_slug ON anime(slug);
CREATE INDEX IF NOT EXISTS idx_anime_external_id ON anime(external_id);
CREATE INDEX IF NOT EXISTS idx_anime_score ON anime(score DESC);
CREATE INDEX IF NOT EXISTS idx_anime_popularity ON anime(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_anime_status ON anime(status);
CREATE INDEX IF NOT EXISTS idx_anime_year ON anime(year);
CREATE INDEX IF NOT EXISTS idx_anime_title_trgm ON anime USING gin(title gin_trgm_ops);

-- Relacionamento Anime <-> Gêneros
CREATE TABLE IF NOT EXISTS anime_genres (
  anime_id  UUID REFERENCES anime(id) ON DELETE CASCADE,
  genre_id  INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (anime_id, genre_id)
);

CREATE INDEX IF NOT EXISTS idx_anime_genres_genre ON anime_genres(genre_id);

-- ─────────────────────────────────────────────────────────────
-- TEMPORADAS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seasons (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id     UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  number       INTEGER NOT NULL DEFAULT 1,
  title        VARCHAR(255),
  description  TEXT,
  cover_url    TEXT,
  year         INTEGER,
  air_date     DATE,
  episodes_count INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(anime_id, number)
);

CREATE INDEX IF NOT EXISTS idx_seasons_anime ON seasons(anime_id);

-- ─────────────────────────────────────────────────────────────
-- EPISÓDIOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS episodes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anime_id        UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  season_id       UUID REFERENCES seasons(id) ON DELETE SET NULL,
  season_number   INTEGER NOT NULL DEFAULT 1,
  episode_number  DECIMAL(8,1) NOT NULL,
  title           VARCHAR(500),
  description     TEXT,
  thumbnail_url   TEXT,
  duration        INTEGER,
  air_date        DATE,
  is_filler       BOOLEAN DEFAULT FALSE,
  is_hidden       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(anime_id, season_number, episode_number)
);

CREATE INDEX IF NOT EXISTS idx_episodes_anime ON episodes(anime_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_episodes_number ON episodes(anime_id, season_number, episode_number);

-- ─────────────────────────────────────────────────────────────
-- FONTES DE VÍDEO (MODULAR)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS episode_sources (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id    UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  label         VARCHAR(100) NOT NULL,
  source_type   VARCHAR(30) NOT NULL DEFAULT 'embed',
  -- Tipos: embed | hls | mp4 | iframe | custom
  url           TEXT NOT NULL,
  quality       VARCHAR(20) DEFAULT '1080p',
  language      VARCHAR(20) DEFAULT 'legendado',
  -- Idiomas: legendado | dublado | original
  is_default    BOOLEAN DEFAULT FALSE,
  provider_name VARCHAR(100),
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_episode ON episode_sources(episode_id);

-- ─────────────────────────────────────────────────────────────
-- PROGRESSO DE ASSISTIDO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watch_progress (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id         UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  episode_id       UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  percentage       DECIMAL(5,2) DEFAULT 0,
  completed        BOOLEAN DEFAULT FALSE,
  last_watched_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON watch_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_anime ON watch_progress(user_id, anime_id);
CREATE INDEX IF NOT EXISTS idx_progress_recent ON watch_progress(user_id, last_watched_at DESC);

-- ─────────────────────────────────────────────────────────────
-- HISTÓRICO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watch_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id    UUID NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  episode_id  UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  watched_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_user ON watch_history(user_id, watched_at DESC);

-- ─────────────────────────────────────────────────────────────
-- FAVORITOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  anime_id   UUID REFERENCES anime(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, anime_id)
);

-- ─────────────────────────────────────────────────────────────
-- MINHA LISTA
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watchlist (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  anime_id   UUID REFERENCES anime(id) ON DELETE CASCADE,
  status     VARCHAR(30) DEFAULT 'watching' CHECK (status IN (
    'watching','want_to_watch','completed','paused','dropped'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, anime_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id, status);

-- ─────────────────────────────────────────────────────────────
-- NOTIFICAÇÕES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT,
  data       JSONB,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- SUPORTE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  subject      VARCHAR(255) NOT NULL,
  category     VARCHAR(50) NOT NULL,
  message      TEXT NOT NULL,
  status       VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  priority     VARCHAR(20) DEFAULT 'normal',
  admin_reply  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- CONFIGURAÇÕES DO USUÁRIO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_settings (
  user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  autoplay           BOOLEAN DEFAULT TRUE,
  continue_watching  BOOLEAN DEFAULT TRUE,
  default_quality    VARCHAR(10) DEFAULT '1080p',
  default_language   VARCHAR(20) DEFAULT 'legendado',
  subtitles_enabled  BOOLEAN DEFAULT TRUE,
  theme              VARCHAR(20) DEFAULT 'dark',
  animations         BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications  BOOLEAN DEFAULT FALSE,
  profile_public     BOOLEAN DEFAULT FALSE,
  history_public     BOOLEAN DEFAULT FALSE,
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- SINCRONIZAÇÃO ANILIST
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type       VARCHAR(50) NOT NULL,
  status          VARCHAR(20) NOT NULL,
  animes_added    INTEGER DEFAULT 0,
  animes_updated  INTEGER DEFAULT 0,
  errors          INTEGER DEFAULT 0,
  error_details   JSONB,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  finished_at     TIMESTAMPTZ,
  duration_ms     INTEGER
);

-- ─────────────────────────────────────────────────────────────
-- FUNÇÃO: updated_at automático
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_anime_updated_at
  BEFORE UPDATE ON anime FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_episodes_updated_at
  BEFORE UPDATE ON episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_sources_updated_at
  BEFORE UPDATE ON episode_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at();
