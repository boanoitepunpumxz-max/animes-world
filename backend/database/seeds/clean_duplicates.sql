-- ============================================================
-- ANIMES WORLD — Limpeza de duplicados e animes sem capa
-- ============================================================

-- 1. Situação antes da limpeza
SELECT 'ANTES' as momento,
  (SELECT COUNT(*) FROM anime) as total,
  (SELECT COUNT(*) FROM (SELECT external_id FROM anime WHERE external_id IS NOT NULL GROUP BY external_id HAVING COUNT(*)>1) x) as dups_ext,
  (SELECT COUNT(*) FROM anime WHERE cover_url IS NULL OR cover_url = '') as sem_capa;

-- 2. Remove duplicados por external_id (mantém o que tem cover_url)
-- Primeiro: marca o ID a manter (com capa, ou mais popular)
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY external_id
      ORDER BY
        (CASE WHEN cover_url IS NOT NULL AND cover_url != '' THEN 0 ELSE 1 END) ASC,
        popularity DESC NULLS LAST,
        created_at ASC
    ) AS rn
  FROM anime
  WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1)

-- Migra favoritos
UPDATE favorites SET anime_id = (
  SELECT id FROM ranked r2 WHERE r2.external_id = (SELECT external_id FROM anime WHERE id = favorites.anime_id) AND r2.rn = 1 LIMIT 1
)
WHERE anime_id IN (SELECT id FROM to_remove)
AND EXISTS (SELECT 1 FROM anime WHERE id = favorites.anime_id);

-- Migra watchlist
WITH ranked AS (
  SELECT id, external_id,
    ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) AS rn
  FROM anime WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1),
keeper AS (SELECT id, external_id FROM ranked WHERE rn = 1)
UPDATE watchlist SET anime_id = k.id
FROM to_remove tr
JOIN anime a ON a.id = tr.id
JOIN keeper k ON k.external_id = a.external_id
WHERE watchlist.anime_id = tr.id
ON CONFLICT (user_id, anime_id) DO NOTHING;

-- Migra watch_history
WITH ranked AS (
  SELECT id, external_id,
    ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) AS rn
  FROM anime WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1),
keeper AS (SELECT id, external_id FROM ranked WHERE rn = 1)
UPDATE watch_history SET anime_id = k.id
FROM to_remove tr
JOIN anime a ON a.id = tr.id
JOIN keeper k ON k.external_id = a.external_id
WHERE watch_history.anime_id = tr.id;

-- Migra watch_progress
WITH ranked AS (
  SELECT id, external_id,
    ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) AS rn
  FROM anime WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1),
keeper AS (SELECT id, external_id FROM ranked WHERE rn = 1)
UPDATE watch_progress SET anime_id = k.id
FROM to_remove tr
JOIN anime a ON a.id = tr.id
JOIN keeper k ON k.external_id = a.external_id
WHERE watch_progress.anime_id = tr.id
ON CONFLICT (user_id, episode_id) DO NOTHING;

-- Remove anime_genres dos duplicados
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) AS rn
  FROM anime WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1)
DELETE FROM anime_genres WHERE anime_id IN (SELECT id FROM to_remove);

-- Remove seasons dos duplicados
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) AS rn
  FROM anime WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1)
DELETE FROM seasons WHERE anime_id IN (SELECT id FROM to_remove);

-- Remove os animes duplicados
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) AS rn
  FROM anime WHERE external_id IS NOT NULL
),
to_remove AS (SELECT id FROM ranked WHERE rn > 1)
DELETE FROM anime WHERE id IN (SELECT id FROM to_remove);

-- 3. Remove slugs duplicados (mantém o com maior popularidade)
WITH slug_ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY slug
      ORDER BY
        (CASE WHEN cover_url IS NOT NULL AND cover_url != '' THEN 0 ELSE 1 END) ASC,
        popularity DESC NULLS LAST
    ) AS rn
  FROM anime
),
to_remove_slugs AS (SELECT id FROM slug_ranked WHERE rn > 1)
DELETE FROM anime WHERE id IN (SELECT id FROM to_remove_slugs);

-- 4. Remove animes sem capa que não têm episódios nem interação de usuários
DELETE FROM anime_genres WHERE anime_id IN (
  SELECT a.id FROM anime a
  WHERE (a.cover_url IS NULL OR a.cover_url = '')
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id = a.id)
  AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id = a.id)
  AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id = a.id)
  AND NOT EXISTS (SELECT 1 FROM watchlist wl WHERE wl.anime_id = a.id)
);

DELETE FROM seasons WHERE anime_id IN (
  SELECT a.id FROM anime a
  WHERE (a.cover_url IS NULL OR a.cover_url = '')
  AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id = a.id)
  AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id = a.id)
  AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id = a.id)
  AND NOT EXISTS (SELECT 1 FROM watchlist wl WHERE wl.anime_id = a.id)
);

DELETE FROM anime
WHERE (cover_url IS NULL OR cover_url = '')
AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id = anime.id)
AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id = anime.id)
AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id = anime.id)
AND NOT EXISTS (SELECT 1 FROM watchlist wl WHERE wl.anime_id = anime.id);

-- 5. Situação depois da limpeza
SELECT 'DEPOIS' as momento,
  (SELECT COUNT(*) FROM anime) as total,
  (SELECT COUNT(*) FROM (SELECT external_id FROM anime WHERE external_id IS NOT NULL GROUP BY external_id HAVING COUNT(*)>1) x) as dups_ext,
  (SELECT COUNT(*) FROM anime WHERE cover_url IS NULL OR cover_url = '') as sem_capa;
