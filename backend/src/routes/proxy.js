/**
 * ANIMES WORLD — Proxy de Imagens com Cache
 * GET /api/proxy/image?mal_id=21          → resolve via Kitsu e redireciona
 * GET /api/proxy/image?mal_id=21&type=banner → retorna banner
 * GET /api/proxy/image?url=https://...    → proxy de URL direta
 */
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// Cache em memória (sobrevive enquanto o processo estiver rodando)
const imgCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

function getCached(key) {
  const entry = imgCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { imgCache.delete(key); return null; }
  return entry.data;
}
function setCache(key, data) {
  imgCache.set(key, { data, ts: Date.now() });
}

// Busca imagens no Kitsu por MAL ID
async function getKitsuImage(malId) {
  const cacheKey = `kitsu:${malId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://kitsu.app/api/edge/mappings?filter[externalSite]=myanimelist%2Fanime&filter[externalId]=${malId}&include=item&page[limit]=1`;
    const r = await axios.get(url, {
      timeout: 8000,
      headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AnimesWorld/1.0' },
    });
    const included = r.data?.included;
    if (!included || included.length === 0) { setCache(cacheKey, null); return null; }
    const attrs = included[0].attributes;
    const result = {
      cover:  attrs.posterImage?.large  || attrs.posterImage?.medium  || null,
      banner: attrs.coverImage?.large   || attrs.coverImage?.original || null,
    };
    setCache(cacheKey, result);
    return result;
  } catch {
    // Não cacheia erro para tentar novamente depois
    return null;
  }
}

const ALLOWED_DOMAINS = [
  'media.kitsu.app', 'kitsu.app',
  'cdn.myanimelist.net', 'myanimelist.net',
  's4.anilist.co', 'anilist.co',
  'img1.ak.crunchyroll.com',
];

const PLACEHOLDER_SVG = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">` +
  `<rect width="200" height="300" fill="#16161f"/>` +
  `<text x="100" y="155" font-family="sans-serif" font-size="18" fill="#475569" text-anchor="middle">AW</text>` +
  `</svg>`
);

// GET /api/proxy/image?mal_id=21
// GET /api/proxy/image?mal_id=21&type=banner
router.get('/image', async (req, res) => {
  const { url, mal_id, type } = req.query;

  // ── Modo MAL ID: resolve via Kitsu ─────────────────────────
  if (mal_id && !url) {
    const imgs = await getKitsuImage(mal_id);
    const imgUrl = type === 'banner' ? (imgs?.banner || imgs?.cover) : imgs?.cover;

    if (imgUrl) {
      // Cache no browser por 7 dias
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.redirect(302, imgUrl);
    }

    // Placeholder se Kitsu não encontrou
    return res
      .status(200)
      .set('Content-Type', 'image/svg+xml')
      .set('Cache-Control', 'public, max-age=60')
      .send(PLACEHOLDER_SVG);
  }

  // ── Modo URL direta: proxy ──────────────────────────────────
  if (!url) return res.status(400).send('Param mal_id ou url obrigatorio');

  try {
    const parsed = new URL(url);
    if (!ALLOWED_DOMAINS.some(d => parsed.hostname.endsWith(d))) {
      return res.status(403).send('Dominio nao permitido');
    }
  } catch {
    return res.status(400).send('URL invalida');
  }

  // Cache da resposta de URL direta
  const urlCacheKey = `url:${url}`;
  const cachedUrl = getCached(urlCacheKey);
  if (cachedUrl) {
    res.setHeader('Content-Type', cachedUrl.contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(cachedUrl.buffer);
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://myanimelist.net/',
        'Accept': 'image/webp,image/jpeg,image/*',
      },
    });
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const buf = Buffer.from(response.data);
    setCache(urlCacheKey, { contentType, buffer: buf });
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buf);
  } catch {
    res.status(502).send('Erro ao buscar imagem');
  }
});

module.exports = router;
