/**
 * AnimeMatcher — Correspondência segura entre anime do banco e resultado da AnFireAPI
 *
 * Estratégia:
 *  1. Normaliza títulos (remove acentos, pontuação, lowercase)
 *  2. Compara título principal, alternativo, inglês, romaji, japonês
 *  3. Retorna MATCH (≥85%), REVIEW_REQUIRED (50-84%) ou NO_MATCH (<50%)
 *  4. Nunca cria anime novo — apenas mapeia ou rejeita
 */

// ── Normalização ──────────────────────────────────────────────

function normalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // remove diacríticos
    .replace(/[''`´]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')      // pontuação → espaço
    .replace(/\s+/g, ' ')
    .trim();
}

// Similarity baseada em tokens (Jaccard + sequência)
function tokenSimilarity(a, b) {
  const ta = new Set(normalize(a).split(' ').filter(Boolean));
  const tb = new Set(normalize(b).split(' ').filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  const intersection = new Set([...ta].filter(x => tb.has(x)));
  const union = new Set([...ta, ...tb]);
  return intersection.size / union.size; // Jaccard
}

// Levenshtein normalizado
function levenshtein(a, b) {
  const na = normalize(a), nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const la = na.length, lb = nb.length;
  const dp = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= la; i++)
    for (let j = 1; j <= lb; j++)
      dp[i][j] = na[i-1] === nb[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return 1 - dp[la][lb] / Math.max(la, lb);
}

// Verifica se um título é claramente diferente (ex: "Tokyo Ghoul √A" vs "Tokyo Ghoul")
function hasSuffixDifference(a, b) {
  const na = normalize(a), nb = normalize(b);
  // Se um é prefixo do outro mas os dois são completos, podem ser séries diferentes
  if (na === nb) return false;
  const longer  = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  if (longer.startsWith(shorter) && (longer.length - shorter.length) > 3) return true;
  return false;
}

/**
 * Calcula score de correspondência entre um anime do banco e um título da API
 * @param {object} dbAnime - linha do banco (title, title_english, title_japanese, title_romaji, slug)
 * @param {string} apiTitle - título retornado pela API
 * @param {string} apiTitleAlt - título alternativo da API
 * @returns {{ score: number, method: string, reasons: string[] }}
 */
function calculateScore(dbAnime, apiTitle, apiTitleAlt = '') {
  const reasons = [];
  let bestScore = 0;
  let method = 'no_match';

  const candidates = [
    { field: 'title',          val: dbAnime.title },
    { field: 'title_english',  val: dbAnime.title_english },
    { field: 'title_romaji',   val: dbAnime.title_romaji },
    { field: 'title_japanese', val: dbAnime.title_japanese },
  ].filter(c => c.val);

  const apiTitles = [apiTitle, apiTitleAlt].filter(Boolean);

  for (const { field, val } of candidates) {
    for (const at of apiTitles) {
      // Exato normalizado
      if (normalize(val) === normalize(at)) {
        reasons.push(`Título exato: "${val}" = "${at}" (${field})`);
        return { score: 100, method: 'exact', reasons };
      }

      // Levenshtein
      const lev = levenshtein(val, at);
      // Jaccard de tokens
      const jac = tokenSimilarity(val, at);
      // Score combinado
      const combined = Math.round((lev * 0.6 + jac * 0.4) * 100);

      if (combined > bestScore) {
        bestScore = combined;
        method = `${field}_fuzzy`;
        reasons.length = 0;
        reasons.push(`Fuzzy "${val}" ~ "${at}" → lev=${Math.round(lev*100)}% jac=${Math.round(jac*100)}% → ${combined}%`);
      }
    }
  }

  // Penaliza se parece ser temporada diferente
  if (bestScore >= 50) {
    const mainApi = normalize(apiTitle);
    const mainDb  = normalize(dbAnime.title || '');
    if (hasSuffixDifference(mainApi, mainDb)) {
      bestScore = Math.max(0, bestScore - 30);
      reasons.push(`Penalidade: parece temporada/série diferente`);
      method = 'suffix_penalized';
    }
  }

  return { score: bestScore, method, reasons };
}

/**
 * Classifica o resultado do matching
 * @returns {'match'|'review_required'|'no_match'}
 */
function classifyScore(score) {
  if (score >= 85) return 'match';
  if (score >= 50) return 'review_required';
  return 'no_match';
}

/**
 * Tenta encontrar a melhor correspondência para um título da API
 * numa lista de animes do banco
 *
 * @param {string} apiTitle
 * @param {string} apiTitleAlt
 * @param {object[]} dbAnimes - array de { id, title, title_english, title_romaji, title_japanese, slug }
 * @returns {{ anime: object|null, score: number, method: string, classification: string, reasons: string[] }}
 */
function findBestMatch(apiTitle, apiTitleAlt, dbAnimes) {
  if (!dbAnimes || !dbAnimes.length) {
    return { anime: null, score: 0, method: 'no_candidates', classification: 'no_match', reasons: ['Sem candidatos'] };
  }

  let best = { anime: null, score: 0, method: 'no_match', reasons: [] };

  for (const dbAnime of dbAnimes) {
    const { score, method, reasons } = calculateScore(dbAnime, apiTitle, apiTitleAlt);
    if (score > best.score) {
      best = { anime: dbAnime, score, method, reasons };
    }
  }

  return {
    ...best,
    classification: classifyScore(best.score),
  };
}

/**
 * Filtra candidatos usando busca por token (pré-filtragem rápida)
 * Evita comparar todos os 4369 animes para cada título
 *
 * @param {string} apiTitle
 * @param {object[]} allAnimes
 * @returns {object[]} candidatos pré-filtrados
 */
function prefilterCandidates(apiTitle, allAnimes) {
  const tokens = normalize(apiTitle).split(' ').filter(t => t.length > 2);
  if (!tokens.length) return allAnimes.slice(0, 50);

  // Primeiro token principal (geralmente o nome base)
  const mainToken = tokens[0];
  const scored = allAnimes
    .map(a => {
      const fields = [a.title, a.title_english, a.title_romaji, a.title_japanese]
        .filter(Boolean).map(normalize).join(' ');
      // Quantos tokens da API aparecem no anime
      const hits = tokens.filter(t => fields.includes(t)).length;
      return { anime: a, hits };
    })
    .filter(x => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 30)
    .map(x => x.anime);

  return scored.length > 0 ? scored : allAnimes.slice(0, 20);
}

module.exports = { findBestMatch, prefilterCandidates, normalize, calculateScore, classifyScore };
