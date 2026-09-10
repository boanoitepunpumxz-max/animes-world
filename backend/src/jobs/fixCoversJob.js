/**
 * Job de correção de capas — executa ao iniciar e periodicamente
 * Atualiza animes com capas AniList quebradas usando Kitsu API
 */
const axios = require('axios');
const { query } = require('../utils/db');

let running = false;

async function fetchKitsuBatch(malIds) {
  try {
    const ids = malIds.join(',');
    const r = await axios.get(
      `https://kitsu.app/api/edge/mappings?filter[externalSite]=myanimelist%2Fanime&filter[externalId]=${ids}&include=item&page[limit]=20`,
      { timeout: 10000, headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AnimesWorld/1.0' } }
    );
    const included = r.data?.included || [];
    const imageMap = {};
    included.forEach(item => {
      imageMap[item.id] = {
        cover:  item.attributes?.posterImage?.large  || item.attributes?.posterImage?.medium,
        banner: item.attributes?.coverImage?.large   || item.attributes?.coverImage?.original,
      };
    });
    const result = {};
    (r.data?.data || []).forEach(mapping => {
      const malId  = mapping.attributes?.externalId;
      const kId    = mapping.relationships?.item?.data?.id;
      if (malId && kId && imageMap[kId]?.cover) {
        result[malId] = imageMap[kId];
      }
    });
    return result;
  } catch {
    return {};
  }
}

async function fixCovers() {
  if (running) return;
  running = true;
  let total = 0, updated = 0;

  try {
    // Busca animes com capas AniList (quebradas)
    const animes = await query(
      `SELECT id, external_id FROM anime
       WHERE external_id IS NOT NULL
         AND (cover_url LIKE '%anilist%' OR cover_url IS NULL OR cover_url = '')
       ORDER BY popularity DESC NULLS LAST
       LIMIT 500`
    );

    total = animes.rows.length;
    if (total === 0) { running = false; return; }

    console.log(`[fix-covers] Processando ${total} animes com capas quebradas...`);

    const BATCH = 20;
    for (let i = 0; i < animes.rows.length; i += BATCH) {
      const batch = animes.rows.slice(i, i + BATCH);
      const malIds = batch.map(a => a.external_id);
      const images = await fetchKitsuBatch(malIds);

      for (const anime of batch) {
        const imgs = images[String(anime.external_id)];
        if (imgs?.cover) {
          await query(
            `UPDATE anime SET cover_url=$1, banner_url=COALESCE($2,banner_url), updated_at=NOW() WHERE id=$3`,
            [imgs.cover, imgs.banner, anime.id]
          );
          updated++;
        }
      }
      // Aguarda 500ms entre batches para não sobrecarregar Kitsu
      await new Promise(r => setTimeout(r, 500));
    }
    console.log(`[fix-covers] Concluído: ${updated}/${total} capas atualizadas.`);
  } catch (e) {
    console.error('[fix-covers] Erro:', e.message);
  } finally {
    running = false;
  }
}

function startFixCoversJob() {
  // Executa 30s após o servidor iniciar
  setTimeout(fixCovers, 30000);
  // Executa a cada 6 horas
  setInterval(fixCovers, 6 * 60 * 60 * 1000);
  console.log('⏰ Job fix-covers agendado (30s após start, a cada 6h).');
}

module.exports = { startFixCoversJob, fixCovers };
