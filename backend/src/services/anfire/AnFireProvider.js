/**
 * AnFireProvider — Adapter para a AnFireAPI (scraper do animefire.plus)
 *
 * Responsabilidades:
 *  - Consultar a AnFireAPI (pode ser local ou remota)
 *  - Interpretar e normalizar a resposta
 *  - Retornar estrutura interna padronizada
 *  - Nunca modificar o banco diretamente
 *
 * Configuração via .env:
 *   ANFIRE_API_URL    = http://localhost:3001 (URL da AnFireAPI rodando)
 *   ANFIRE_API_KEY    = SUA_API_KEY
 *   ANFIRE_BASE_URL   = https://animefire.plus (site base para slugs)
 *   ANFIRE_RATE_LIMIT = 1000 (ms entre requisições)
 */
const axios = require('axios');

const ANFIRE_API_URL  = process.env.ANFIRE_API_URL  || 'http://localhost:3000';
const ANFIRE_API_KEY  = process.env.ANFIRE_API_KEY  || '';
const ANFIRE_BASE_URL = process.env.ANFIRE_BASE_URL || 'https://animefire.plus';
const RATE_LIMIT_MS   = parseInt(process.env.ANFIRE_RATE_LIMIT || '1200');

// Delay entre requisições
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let lastRequestTime = 0;
async function rateLimitedRequest(fn) {
  const now = Date.now();
  const wait = RATE_LIMIT_MS - (now - lastRequestTime);
  if (wait > 0) await sleep(wait);
  lastRequestTime = Date.now();
  return fn();
}

/**
 * Busca anime na AnFireAPI por slug
 * @param {string} slug - slug do anime no animefire.plus
 * @returns {AnFireAnime|null}
 */
async function fetchAnime(slug) {
  return rateLimitedRequest(async () => {
    try {
      const url = `${ANFIRE_API_URL}/api`;
      const params = {
        anime_link: `${ANFIRE_BASE_URL}/animes/${slug}`,
        ...(ANFIRE_API_KEY ? { api_key: ANFIRE_API_KEY } : {}),
      };
      const r = await axios.get(url, { params, timeout: 15000 });
      if (!r.data || r.data.response?.status === '500') return null;
      return normalizeAnime(r.data, slug);
    } catch {
      return null;
    }
  });
}

/**
 * Busca episódios de um anime (update=true só pega novos)
 * @param {string} slug
 * @param {boolean} onlyNew
 * @returns {AnFireEpisode[]}
 */
async function fetchEpisodes(slug, onlyNew = false) {
  return rateLimitedRequest(async () => {
    try {
      const url = `${ANFIRE_API_URL}/api`;
      const params = {
        anime_link: `${ANFIRE_BASE_URL}/animes/${slug}`,
        ...(onlyNew ? { update: 'true' } : {}),
        ...(ANFIRE_API_KEY ? { api_key: ANFIRE_API_KEY } : {}),
      };
      const r = await axios.get(url, { params, timeout: 30000 });
      if (!r.data || r.data.response?.status === '500') return [];
      return normalizeEpisodes(r.data.episodes || [], slug);
    } catch {
      return [];
    }
  });
}

/**
 * Pesquisa animes na AnFireAPI por título
 * Usa o endpoint de search (index.php ou /search)
 * @param {string} query
 * @returns {AnFireSearchResult[]}
 */
async function searchAnime(query) {
  return rateLimitedRequest(async () => {
    try {
      // Tenta endpoint de search do Node.js
      const r = await axios.get(`${ANFIRE_API_URL}/search`, {
        params: { q: query },
        timeout: 10000,
      });
      if (Array.isArray(r.data)) {
        return r.data.map(item => ({
          title: sanitize(item.title || ''),
          slug:  extractSlug(item.url || ''),
          cover: sanitize(item.image || ''),
          url:   sanitize(item.url || ''),
        })).filter(i => i.slug);
      }
      return [];
    } catch {
      return [];
    }
  });
}

// ── Normalizadores ────────────────────────────────────────────

function normalizeAnime(data, slug) {
  return {
    slug:     slug,
    title:    sanitize(data.anime_title   || data.anime_title1 || ''),
    titleAlt: sanitize(data.anime_title1  || ''),
    cover:    sanitizeUrl(data.anime_image || ''),
    synopsis: sanitize(data.anime_synopsis || ''),
    score:    parseFloat(data.anime_score  || '0') || null,
    info:     sanitize(data.anime_info     || ''),  // ex: "TV, 2019, Legendado"
    trailer:  sanitizeUrl(data.youtube_trailer || ''),
    episodes: normalizeEpisodes(data.episodes || [], slug),
    raw:      {
      response: data.response,
      metadata: data.metadata,
    },
  };
}

function normalizeEpisodes(episodes, animeSlug) {
  if (!Array.isArray(episodes)) return [];
  return episodes
    .filter(ep => ep && ep.episode != null)
    .map(ep => ({
      number:  parseFloat(ep.episode),
      sources: normalizeSources(ep.data || [], animeSlug, ep.episode),
    }))
    .filter(ep => !isNaN(ep.number) && ep.number > 0);
}

function normalizeSources(sources, animeSlug, epNumber) {
  if (!Array.isArray(sources)) return [];
  return sources
    .filter(s => s && s.url && s.status !== 'OFFLINE' && isValidUrl(s.url))
    .map((s, i) => ({
      url:      sanitizeUrl(s.url),
      quality:  sanitize(s.resolution || 'auto'),
      language: 'legendado',  // AnFireAPI não distingue dub/sub por episódio
      type:     detectSourceType(s.url),
      isDefault: i === 0,
      sortOrder: i,
      provider:  'anfire',
    }));
}

// ── Helpers ───────────────────────────────────────────────────

function sanitize(str) {
  if (!str || typeof str !== 'string') return '';
  // Remove HTML tags, trim, limita tamanho
  return str.replace(/<[^>]+>/g, '').trim().substring(0, 2000);
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!isValidUrl(trimmed)) return '';
  // Bloqueia SSRF para IPs privados
  if (/^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(trimmed)) return '';
  return trimmed;
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

function extractSlug(url) {
  if (!url) return '';
  // Extrai slug de URLs como https://animefire.plus/animes/SLUG ou /AnFire_Player.php?link=...
  const linkMatch = url.match(/[?&]link=([^&]+)/);
  if (linkMatch) {
    const decoded = decodeURIComponent(linkMatch[1]);
    return extractSlug(decoded);
  }
  const match = url.match(/\/animes\/([^/?#]+)/);
  return match ? match[1] : '';
}

function detectSourceType(url) {
  if (!url) return 'embed';
  if (url.includes('.m3u8')) return 'hls';
  if (url.includes('.mp4'))  return 'mp4';
  if (url.includes('embed') || url.includes('player') || url.includes('iframe')) return 'embed';
  return 'hls';
}

module.exports = { fetchAnime, fetchEpisodes, searchAnime, extractSlug, sanitize, sanitizeUrl };
