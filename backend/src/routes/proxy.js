/**
 * ANIMES WORLD — Proxy de Imagens
 *
 * GET /api/proxy/image?mal_id=21
 *   → Busca a imagem correta via Kitsu API e redireciona
 *
 * GET /api/proxy/image?url=https://...
 *   → Proxy direto para URL permitida
 */
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// Cache em memória: mal_id → { cover, banner }
const imgCache = new Map();

// Busca imagens no Kitsu por MAL ID (com cache)
async function getKitsuImage(malId) {
  const key = String(malId);
  if (imgCache.has(key)) return imgCache.get(key);

  try {
    const url =
      `https://kitsu.app/api/edge/mappings` +
      `?filter[externalSite]=myanimelist%2Fanime` +
      `&filter[externalId]=${malId}` +
      `&include=item&page[limit]=1`;

    const r = await axios.get(url, {
      timeout: 8000,
      headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AnimesWorld/1.0' },
    });

    const included = r.data?.included;
    if (!included || included.length === 0) {
      imgCache.set(key, null);
      return null;
    }

    const attrs = included[0].attributes;
    const result = {
      cover:  attrs.posterImage?.large  || attrs.posterImage?.medium  || null,
      banner: attrs.coverImage?.large   || attrs.coverImage?.original || null,
    };

    imgCache.set(key, result);
    return result;
  } catch {
    imgCache.set(key, null);
    return null;
  }
}

const ALLOWED = [
  'media.kitsu.app', 'kitsu.app',
  'cdn.myanimelist.net', 'myanimelist.net',
  's4.anilist.co', 'anilist.co',
];

// GET /api/proxy/image?mal_id=21
// GET /api/proxy/image?mal_id=21&type=banner
router.get('/image', async (req, res) => {
  const { url, mal_id, type } = req.query;

  // ── Modo MAL ID: resolve via Kitsu ──────────────────────────
  if (mal_id && !url) {
    const imgs = await getKitsuImage(mal_id);
    const imgUrl = type === 'banner' ? imgs?.banner : imgs?.cover;

    if (imgUrl) {
      // Redireciona direto para a URL do Kitsu (sem proxy)
      return res.redirect(302, imgUrl);
    }

    // Fallback: SVG placeholder
    return res.status(200)
      .set('Content-Type', 'image/svg+xml')
      .set('Cache-Control', 'public, max-age=300')
      .send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">` +
        `<rect width="200" height="300" fill="#16161f"/>` +
        `<text x="100" y="155" font-family="sans-serif" font-size="18" ` +
        `fill="#475569" text-anchor="middle">AW</text></svg>`
      );
  }

  // ── Modo URL direta: proxy ────────────────────────────────────
  if (!url) return res.status(400).send('Param mal_id ou url obrigatorio');

  try {
    const parsed = new URL(url);
    if (!ALLOWED.some(d => parsed.hostname.endsWith(d))) {
      return res.status(403).send('Dominio nao permitido');
    }
  } catch {
    return res.status(400).send('URL invalida');
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
    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=604800'); // 7 dias
    res.set('Access-Control-Allow-Origin', '*');
    res.send(response.data);
  } catch {
    res.status(502).send('Erro ao buscar imagem');
  }
});

module.exports = router;
