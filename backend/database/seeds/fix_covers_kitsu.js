/**
 * Atualiza capas de todos os animes via Kitsu API (batch de 20 por req)
 * Kitsu mapeia MAL ID -> imagens funcionais do media.kitsu.app
 */
const { Client } = require('pg');
const https = require('https');

const DB = {
  host: 'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
  port: 5432, database: 'neondb',
  user: 'neondb_owner', password: 'npg_7wXLYIo9ypHi',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
};

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AnimesWorld/1.0' },
      timeout: 15000,
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// Busca mapeamentos de um batch de MAL IDs
// Retorna { malId: { cover, banner } }
async function fetchBatch(malIds) {
  const idStr = malIds.join(',');
  const url = `https://kitsu.app/api/edge/mappings?filter[externalSite]=myanimelist%2Fanime&filter[externalId]=${idStr}&include=item&page[limit]=20`;
  const data = await httpGet(url);
  
  if (!data || !data.data || !data.included) return {};

  // Monta mapa: kitsu_id -> imagens
  const kitsuImages = {};
  for (const item of data.included) {
    const attrs = item.attributes;
    kitsuImages[item.id] = {
      cover:  attrs.posterImage?.large  || attrs.posterImage?.medium || null,
      banner: attrs.coverImage?.large   || attrs.coverImage?.original || null,
    };
  }

  // Monta mapa: mal_id -> imagens
  const result = {};
  for (const mapping of data.data) {
    const malId = mapping.attributes.externalId;
    const kitsuId = mapping.relationships?.item?.data?.id;
    if (kitsuId && kitsuImages[kitsuId]) {
      result[malId] = kitsuImages[kitsuId];
    }
  }
  return result;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const db = new Client(DB);
  await db.connect();

  const result = await db.query(
    `SELECT id, external_id, title FROM anime
     WHERE external_id IS NOT NULL
     ORDER BY popularity DESC NULLS LAST`
  );
  const animes = result.rows;
  console.log(`Total de animes: ${animes.length}`);
  console.log('Buscando capas no Kitsu (lotes de 20)...\n');

  let updated = 0, notFound = 0, errors = 0;
  const BATCH = 20;
  const DELAY = 600; // 600ms entre requests (~100 req/min, seguro no Kitsu)

  for (let i = 0; i < animes.length; i += BATCH) {
    const batch = animes.slice(i, i + BATCH);
    const malIds = batch.map(a => a.external_id);

    try {
      const images = await fetchBatch(malIds);

      for (const anime of batch) {
        const imgs = images[String(anime.external_id)];
        if (imgs && imgs.cover) {
          await db.query(
            `UPDATE anime SET cover_url=$1, banner_url=COALESCE($2,banner_url), updated_at=NOW() WHERE id=$3`,
            [imgs.cover, imgs.banner, anime.id]
          );
          updated++;
        } else {
          notFound++;
        }
      }
    } catch (e) {
      errors += batch.length;
    }

    const done = Math.min(i + BATCH, animes.length);
    const pct = Math.round(done / animes.length * 100);
    if (done % 200 === 0 || done >= animes.length) {
      console.log(`  [${String(pct).padStart(3)}%] ${done}/${animes.length} | ok:${updated} | nf:${notFound} | err:${errors}`);
    }

    await sleep(DELAY);
  }

  // Resultado final
  const final = await db.query(`
    SELECT
      COUNT(*) FILTER (WHERE cover_url LIKE '%kitsu%') as kitsu,
      COUNT(*) FILTER (WHERE cover_url IS NOT NULL) as with_cover,
      COUNT(*) as total
    FROM anime
  `);
  await db.end();

  console.log('\n' + '='.repeat(52));
  console.log(`  Atualizados (Kitsu): ${updated}`);
  console.log(`  Nao encontrados:     ${notFound}`);
  console.log(`  Erros:               ${errors}`);
  console.log(`  Com capa no banco:   ${final.rows[0].with_cover}/${final.rows[0].total}`);
  console.log('='.repeat(52));
  process.exit(0);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
