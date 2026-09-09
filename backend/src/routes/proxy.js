const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy de imagens para evitar bloqueio CORS do AniList
// GET /api/proxy/image?url=https://s4.anilist.co/...
router.get('/image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL obrigatória');

  // Só permite domínios confiáveis
  const allowed = [
    's4.anilist.co', 'anilist.co', 'cdn.anilist.co',
    'cdn.myanimelist.net', 'myanimelist.net',
    'img1.ak.crunchyroll.com',
  ];
  try {
    const parsed = new URL(url);
    if (!allowed.some(d => parsed.hostname.endsWith(d))) {
      return res.status(403).send('Domínio não permitido');
    }
  } catch {
    return res.status(400).send('URL inválida');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://anilist.co/',
      },
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(response.data);
  } catch (err) {
    res.status(502).send('Erro ao buscar imagem');
  }
});

module.exports = router;
