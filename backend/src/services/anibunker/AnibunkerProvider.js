/**
 * AnibunkerProvider — Adapter para o site anibunker.com
 *
 * Baseado na análise real do código:
 * https://github.com/e43b/Anibunker-Downloader
 *
 * Estrutura de URLs do Anibunker:
 *  - Anime:    https://www.anibunker.com/anime/{slug}
 *  - Episódio: https://www.anibunker.com/anime/{slug}-episodio-{N}-{legendado|dublado}
 *
 * Vídeo: tag <video src="..."> ou cdn.rumble.cloud no JS
 *
 * Configuração via .env:
 *   ANIBUNKER_BASE_URL   = https://www.anibunker.com (padrão)
 *   ANIBUNKER_TIMEOUT    = 15000
 *   ANIBUNKER_RATE_LIMIT = 1500 (ms entre requisições)
 *   ANIBUNKER_ENABLED    = true
 */
const axios   = require('axios');
const cheerio = require('cheerio');

const BASE_URL   = (process.env.ANIBUNKER_BASE_URL   || 'https://www.anibunker.com').replace(/\/$/, '');
const TIMEOUT    = parseInt(process.env.ANIBUNKER_TIMEOUT    || '15000');
const RATE_LIMIT = parseInt(process.env.ANIBUNKER_RATE_LIMIT || '1500');
const ENABLED    = process.env.ANIBUNKER_ENABLED !== 'false'; // padrão true

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  'Referer': BASE_URL + '/',
};

// ── Rate limiting ─────────────────────────────────────────────
let lastRequest = 0;
async function rateLimited(fn) {
  if (!ENABLED) throw new Error('AnibunkerProvider está desabilitado (ANIBUNKER_ENABLED=false)');
  const wait = RATE_LIMIT - (Date.now() - lastRequest);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastRequest = Date.now();
  return fn();
}

/**
 * Busca informações de um anime pelo slug
 * @param {string} slug - ex: "death-note"
 * @returns {AnibunkerAnime|null}
 */
async function fetchAnime(slug) {
  return rateLimited(async () => {
    const url = `${BASE_URL}/anime/${slug}`;
    try {
      const { data: html } = await axios.get(url, { headers: HEADERS, timeout: TIMEOUT });
      return parseAnimePage(html, slug, url);
    } catch (e) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  });
}

/**
 * Busca detalhes de um episódio específico
 * @param {string} slug - slug do anime
 * @param {number} episode - número do episódio
 * @param {string} version - 'legendado' | 'dublado'
 * @returns {AnibunkerEpisode|null}
 */
async function fetchEpisode(slug, episode, version = 'legendado') {
  return rateLimited(async () => {
    const url = `${BASE_URL}/anime/${slug}-episodio-${episode}-${version}`;
    try {
      const { data: html } = await axios.get(url, { headers: HEADERS, timeout: TIMEOUT });
      return parseEpisodePage(html, slug, episode, version, url);
    } catch (e) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  });
}

/**
 * Lista todos os episódios disponíveis de um anime
 * Verifica legendado e dublado separadamente
 * @param {string} slug
 * @param {number} totalLeg - total de eps legendados (0 = auto-detectar)
 * @param {number} totalDub - total de eps dublados (0 = auto-detectar)
 * @returns {{ legendado: AnibunkerEpisode[], dublado: AnibunkerEpisode[] }}
 */
async function fetchAllEpisodes(slug, totalLeg = 0, totalDub = 0) {
  // Se não temos o total, busca a página do anime primeiro
  if (!totalLeg && !totalDub) {
    const animeData = await fetchAnime(slug);
    if (!animeData) return { legendado: [], dublado: [] };
    totalLeg = animeData.episodesLegendado;
    totalDub = animeData.episodesDublado;
  }

  const results = { legendado: [], dublado: [] };

  // Busca episódios legendados
  if (totalLeg > 0) {
    for (let ep = 1; ep <= totalLeg; ep++) {
      const epData = await fetchEpisode(slug, ep, 'legendado');
      if (!epData) break; // Para quando não encontra
      results.legendado.push(epData);
    }
  }

  // Busca episódios dublados
  if (totalDub > 0) {
    for (let ep = 1; ep <= totalDub; ep++) {
      const epData = await fetchEpisode(slug, ep, 'dublado');
      if (!epData) break;
      results.dublado.push(epData);
    }
  }

  return results;
}

/**
 * Pesquisa animes por título
 * (Anibunker não tem endpoint de busca — gera slugs candidatos)
 * @param {string} title
 * @returns {AnibunkerSearchResult[]}
 */
async function searchByTitle(title) {
  // Gera slug candidatos baseado no título normalizado
  const slug = titleToSlug(title);
  const candidates = [
    slug,
    `${slug}-legendado`,
    `${slug}-dublado`,
  ];

  const results = [];
  for (const s of candidates) {
    const anime = await fetchAnime(s);
    if (anime && !results.some(r => r.slug === s)) {
      results.push({ title: anime.title, slug: s, url: anime.url,
        episodesLegendado: anime.episodesLegendado, episodesDublado: anime.episodesDublado });
    }
  }
  return results;
}

/**
 * Verifica se um episódio existe (retorna true/false rapidamente via HEAD)
 */
async function episodeExists(slug, episode, version) {
  return rateLimited(async () => {
    const url = `${BASE_URL}/anime/${slug}-episodio-${episode}-${version}`;
    try {
      await axios.head(url, { headers: HEADERS, timeout: TIMEOUT });
      return true;
    } catch { return false; }
  });
}

// ── Parsers ───────────────────────────────────────────────────

function parseAnimePage(html, slug, url) {
  const $ = cheerio.load(html);

  const title = $('h1').first().text().trim() || slug;
  const cover = $('img.perfil--img, .perfil img').first().attr('src') || null;
  const synopsis = $('div.sinopse, .perfil--sinopse').first().text().trim() || null;

  // Extrai totais de episódios da estrutura div.perfil--desc > ul > li
  let episodesLegendado = 0;
  let episodesDublado   = 0;

  const descLis = $('div.perfil--desc li');
  descLis.each((_, el) => {
    const txt = $(el).text().toLowerCase().trim();
    // Formato: "37 legendado" ou "37 dublado" ou "37 Eps Legendado"
    const numMatch = txt.match(/^(\d+)/);
    if (!numMatch) return;
    const num = parseInt(numMatch[1]);
    if (txt.includes('legendado')) episodesLegendado = num;
    if (txt.includes('dublado'))   episodesDublado   = num;
  });

  // Fallback: tenta extrair do texto da página
  if (!episodesLegendado && !episodesDublado) {
    const pageText = $('body').text().toLowerCase();
    const legMatch = pageText.match(/(\d+)\s*ep[a-z]*\s*legendad/);
    const dubMatch = pageText.match(/(\d+)\s*ep[a-z]*\s*dublad/);
    if (legMatch) episodesLegendado = parseInt(legMatch[1]);
    if (dubMatch) episodesDublado   = parseInt(dubMatch[1]);
  }

  return {
    slug, url, title,
    cover:  cover ? sanitizeUrl(cover) : null,
    synopsis: synopsis?.substring(0, 2000) || null,
    episodesLegendado,
    episodesDublado,
    hasDub: episodesDublado > 0,
    hasSub: episodesLegendado > 0,
  };
}

function parseEpisodePage(html, animeSlug, epNumber, version, url) {
  const $ = cheerio.load(html);

  const titleTag  = $('title').text().trim();
  const epTitle   = $('h4').first().text().trim() || `Episódio ${epNumber}`;
  const animeName = $('h1').first().text().trim() || titleTag;

  // Fonte 1: tag <video src="...">
  let videoUrl = $('video').first().attr('src') || null;

  // Fonte 2: Rumble CDN nos scripts
  if (!videoUrl) {
    $('script').each((_, el) => {
      if (videoUrl) return;
      const code = $(el).html() || '';
      const m = code.match(/https:\/\/[^\s"']*cdn\.rumble\.cloud[^\s"']*\.mp4/);
      if (m) videoUrl = m[0];
    });
  }

  // Fonte 3: qualquer <source src="...mp4">
  if (!videoUrl) {
    videoUrl = $('source[src*=".mp4"]').first().attr('src') || null;
  }

  if (!videoUrl) return null;

  return {
    animeSlug,
    episode:  epNumber,
    version,   // 'legendado' | 'dublado'
    language:  version === 'dublado' ? 'dublado' : 'legendado',
    title:     epTitle,
    animeName,
    url,
    videoUrl:  sanitizeUrl(videoUrl),
    quality:   detectQuality(videoUrl),
  };
}

// ── Helpers ───────────────────────────────────────────────────

function titleToSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  // Bloqueia IPs privados (SSRF)
  if (/^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(trimmed)) return null;
  return trimmed;
}

function detectQuality(url) {
  if (!url) return 'auto';
  if (url.includes('1080')) return '1080p';
  if (url.includes('720'))  return '720p';
  if (url.includes('480'))  return '480p';
  if (url.includes('360'))  return '360p';
  return 'auto';
}

module.exports = {
  PROVIDER_NAME: 'anibunker',
  fetchAnime, fetchEpisode, fetchAllEpisodes,
  searchByTitle, episodeExists, titleToSlug,
  get isEnabled() { return ENABLED; },
};
