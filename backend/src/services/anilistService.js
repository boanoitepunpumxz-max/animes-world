const axios = require('axios');
const slugify = require('slugify');
const { query, getClient } = require('../utils/db');

const ANILIST_API = process.env.ANILIST_API_URL || 'https://graphql.anilist.co';

const ANIME_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage currentPage lastPage }
    media(type: ANIME, sort: $sort, isAdult: false) {
      id title { romaji english native }
      description(asHtml: false)
      coverImage { extraLarge large color }
      bannerImage
      startDate { year month day }
      season seasonYear
      status episodes duration
      format
      averageScore popularity
      studios(isMain: true) { nodes { name } }
      trailer { id site }
      genres
      isAdult
    }
  }
}`;

const RECENT_QUERY = `
query ($page: Int, $perPage: Int, $airingAt_greater: Int, $airingAt_lesser: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage }
    airingSchedules(airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser) {
      episode airingAt
      media {
        id title { romaji english }
        coverImage { large }
        format
      }
    }
  }
}`;

async function anilistRequest(query_str, variables = {}) {
  const response = await axios.post(
    ANILIST_API,
    { query: query_str, variables },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://anilist.co',
        'Referer': 'https://anilist.co/',
      },
      timeout: 20000,
    }
  );
  if (response.data.errors) {
    throw new Error(response.data.errors[0]?.message || 'AniList API error');
  }
  return response.data.data;
}

function generateSlug(title) {
  const text = title.english || title.romaji || title.native || 'anime';
  return slugify(text, { lower: true, strict: true, replacement: '-' });
}

async function upsertGenres(genreNames) {
  const genreIds = [];
  for (const name of genreNames) {
    const slug = slugify(name, { lower: true, strict: true });
    const result = await query(
      `INSERT INTO genres (name, slug) VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name, slug]
    );
    genreIds.push(result.rows[0].id);
  }
  return genreIds;
}

async function upsertAnime(media) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    let slug = generateSlug(media.title);
    // Garantir slug único adicionando ID externo se necessário
    const existing = await client.query(
      'SELECT id FROM anime WHERE slug = $1 AND external_id != $2',
      [slug, media.id]
    );
    if (existing.rows.length > 0) {
      slug = `${slug}-${media.id}`;
    }

    const studio = media.studios?.nodes?.[0]?.name || null;
    const trailerUrl = media.trailer
      ? (media.trailer.site === 'youtube'
          ? `https://www.youtube.com/watch?v=${media.trailer.id}`
          : null)
      : null;
    const year = media.startDate?.year || media.seasonYear || null;
    const coverUrl = media.coverImage?.extraLarge || media.coverImage?.large || null;

    const result = await client.query(
      `INSERT INTO anime (
         external_id, slug, title, title_english, title_japanese, title_romaji,
         description, cover_url, banner_url, year, season, status, type,
         episodes_count, duration, studio, score, popularity, trailer_url, is_adult
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       ON CONFLICT (external_id) DO UPDATE SET
         slug = EXCLUDED.slug,
         title = EXCLUDED.title,
         title_english = EXCLUDED.title_english,
         description = EXCLUDED.description,
         cover_url = EXCLUDED.cover_url,
         banner_url = EXCLUDED.banner_url,
         year = EXCLUDED.year,
         season = EXCLUDED.season,
         status = EXCLUDED.status,
         type = EXCLUDED.type,
         episodes_count = EXCLUDED.episodes_count,
         duration = EXCLUDED.duration,
         studio = EXCLUDED.studio,
         score = EXCLUDED.score,
         popularity = EXCLUDED.popularity,
         trailer_url = EXCLUDED.trailer_url,
         updated_at = NOW()
       RETURNING id, (xmax = 0) AS inserted`,
      [
        media.id, slug,
        media.title.romaji || media.title.english || 'Sem título',
        media.title.english,
        media.title.native,
        media.title.romaji,
        media.description?.replace(/<[^>]+>/g, '').substring(0, 2000) || null,
        coverUrl, media.bannerImage,
        year, media.season,
        media.status, media.format || 'TV',
        media.episodes || 0, media.duration,
        studio,
        media.averageScore ? media.averageScore / 10 : null,
        media.popularity || 0,
        trailerUrl, media.isAdult || false,
      ]
    );

    const animeId = result.rows[0].id;

    // Criar temporada padrão se não existir
    await client.query(
      `INSERT INTO seasons (anime_id, number, title, year, episodes_count)
       VALUES ($1, 1, 'Temporada 1', $2, $3)
       ON CONFLICT (anime_id, number) DO UPDATE SET
         episodes_count = EXCLUDED.episodes_count`,
      [animeId, year, media.episodes || 0]
    );

    // Gêneros
    if (media.genres?.length > 0) {
      await client.query('DELETE FROM anime_genres WHERE anime_id = $1', [animeId]);
      const genreIds = await upsertGenres(media.genres);
      for (const gId of genreIds) {
        await client.query(
          'INSERT INTO anime_genres (anime_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [animeId, gId]
        );
      }
    }

    await client.query('COMMIT');
    return { id: animeId, inserted: result.rows[0].inserted };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function syncAnimes({ page = 1, perPage = 50, sort = ['POPULARITY_DESC'] } = {}) {
  const startedAt = Date.now();
  let added = 0, updated = 0, errors = 0;
  const errorDetails = [];

  const logId = (await query(
    `INSERT INTO sync_logs (sync_type, status, started_at) VALUES ('full_sync', 'running', NOW()) RETURNING id`
  )).rows[0].id;

  try {
    let currentPage = page;
    let hasNextPage = true;
    let totalPages = 0;

    while (hasNextPage && currentPage <= (page + 9)) { // máx 10 páginas por vez
      const data = await anilistRequest(ANIME_QUERY, { page: currentPage, perPage, sort });
      const { pageInfo, media } = data.Page;

      hasNextPage = pageInfo.hasNextPage;
      totalPages = pageInfo.lastPage;

      for (const anime of media) {
        try {
          if (anime.isAdult) continue;
          const result = await upsertAnime(anime);
          if (result.inserted) added++;
          else updated++;
        } catch (err) {
          errors++;
          errorDetails.push({ id: anime.id, error: err.message });
          if (errorDetails.length >= 10) break;
        }
      }

      // Respeitar rate limit da AniList (90 req/min)
      await new Promise(r => setTimeout(r, 700));
      currentPage++;
    }

    const duration = Date.now() - startedAt;
    await query(
      `UPDATE sync_logs SET status='completed', animes_added=$1, animes_updated=$2,
       errors=$3, error_details=$4, finished_at=NOW(), duration_ms=$5 WHERE id=$6`,
      [added, updated, errors, JSON.stringify(errorDetails), duration, logId]
    );

    return { added, updated, errors, totalPages };
  } catch (err) {
    await query(
      `UPDATE sync_logs SET status='failed', error_details=$1, finished_at=NOW() WHERE id=$2`,
      [JSON.stringify([{ error: err.message }]), logId]
    );
    throw err;
  }
}

// Disparar sync pelo admin
async function triggerSync(req, res, next) {
  try {
    // Roda em background para não bloquear a requisição
    syncAnimes({ sort: ['POPULARITY_DESC'] })
      .then(r => console.log(`✅ Sync concluído: +${r.added} adicionados, ${r.updated} atualizados`))
      .catch(e => console.error('❌ Sync falhou:', e.message));

    res.json({ message: 'Sincronização iniciada em segundo plano.' });
  } catch (err) { next(err); }
}

module.exports = { syncAnimes, upsertAnime, triggerSync };
