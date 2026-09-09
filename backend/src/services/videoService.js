/**
 * ANIMES WORLD — Video Service (Módulo de Episódios)
 *
 * Este serviço é a camada de abstração entre os episódios e a origem dos vídeos.
 * Configure a variável EPISODE_SOURCE no .env para definir o comportamento.
 *
 * Modos disponíveis:
 *   manual  — Você cadastra os links pelo painel admin (padrão)
 *   embed   — URL base para embeds externos (configure VIDEO_BASE_URL)
 *   hls     — Servidor HLS próprio (configure STREAM_SOURCE)
 *   custom  — Implementação customizada abaixo
 */

const { query } = require('../utils/db');

const EPISODE_SOURCE = process.env.EPISODE_SOURCE || 'manual';
const VIDEO_BASE_URL = process.env.VIDEO_BASE_URL || '';
const STREAM_SOURCE = process.env.STREAM_SOURCE || '';

/**
 * Resolve as fontes de vídeo de um episódio.
 * Retorna array de { label, url, quality, language, sourceType }
 */
async function resolveEpisodeSources(episodeId, animeSlug, seasonNumber, episodeNumber) {
  // 1. Sempre busca as fontes cadastradas manualmente no banco
  const dbSources = await query(
    `SELECT id, label, source_type, url, quality, language, is_default, provider_name
     FROM episode_sources
     WHERE episode_id = $1
     ORDER BY is_default DESC, sort_order ASC`,
    [episodeId]
  );

  if (dbSources.rows.length > 0) {
    return dbSources.rows;
  }

  // 2. Se não há fontes manuais, tenta resolver pela configuração do .env
  switch (EPISODE_SOURCE) {
    case 'hls':
      return resolveHLSSources(animeSlug, seasonNumber, episodeNumber);

    case 'embed':
      return resolveEmbedSources(animeSlug, seasonNumber, episodeNumber);

    case 'custom':
      return resolveCustomSources(animeSlug, seasonNumber, episodeNumber);

    default: // 'manual'
      return [];
  }
}

/**
 * Modo HLS: usa STREAM_SOURCE como base
 * Exemplo: https://stream.seusite.com/anime-slug/s1/ep01/index.m3u8
 */
function resolveHLSSources(animeSlug, seasonNumber, episodeNumber) {
  if (!STREAM_SOURCE) return [];
  const epStr = String(episodeNumber).padStart(2, '0');
  return [
    {
      label: 'HD',
      source_type: 'hls',
      url: `${STREAM_SOURCE}/${animeSlug}/s${seasonNumber}/ep${epStr}/index.m3u8`,
      quality: '1080p',
      language: 'legendado',
      is_default: true,
    },
  ];
}

/**
 * Modo Embed: usa VIDEO_BASE_URL como base
 * Exemplo: https://player.seusite.com/embed/anime-slug/1/1
 */
function resolveEmbedSources(animeSlug, seasonNumber, episodeNumber) {
  if (!VIDEO_BASE_URL) return [];
  return [
    {
      label: 'Assistir',
      source_type: 'embed',
      url: `${VIDEO_BASE_URL}/${animeSlug}/${seasonNumber}/${episodeNumber}`,
      quality: 'auto',
      language: 'legendado',
      is_default: true,
    },
  ];
}

/**
 * Modo Custom: implemente aqui sua lógica personalizada
 */
function resolveCustomSources(animeSlug, seasonNumber, episodeNumber) {
  // TODO: implemente sua lógica de resolução de fontes aqui
  // Exemplo: chamar uma API externa, banco próprio, etc.
  return [];
}

/**
 * Verifica se um embed URL é de um domínio permitido
 */
function isAllowedEmbedDomain(url) {
  const allowedDomains = (process.env.EMBED_ALLOWED_DOMAINS || '')
    .split(',').map(d => d.trim()).filter(Boolean);

  if (allowedDomains.length === 0) return true; // sem restrição

  try {
    const urlObj = new URL(url);
    return allowedDomains.some(d => urlObj.hostname.endsWith(d));
  } catch {
    return false;
  }
}

module.exports = { resolveEpisodeSources, isAllowedEmbedDomain };
