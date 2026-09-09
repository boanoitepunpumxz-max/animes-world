/**
 * Importador via psql — gera SQL e executa via psql
 * Abordagem alternativa que funciona no ambiente Windows
 */
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PSQL_URL = 'postgresql://neondb_owner:npg_7wXLYIo9ypHi@ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech/neondb';
const PSQL_PATH = 'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe';

// Gêneros
const G = {
  'Action':'acao','Adventure':'aventura','Comedy':'comedia','Drama':'drama',
  'Fantasy':'fantasia','Horror':'horror','Mystery':'misterio','Romance':'romance',
  'Sci-Fi':'ficcao-cientifica','Slice of Life':'slice-of-life','Sports':'esportes',
  'Supernatural':'sobrenatural','Suspense':'suspense','Ecchi':'ecchi',
  'Award Winning':'premiado','Avant Garde':'avant-garde',
  'Boys Love':'boys-love','Girls Love':'girls-love',
  'Shounen':'shounen','Shoujo':'shoujo','Seinen':'seinen','Josei':'josei',
  'Kids':'infantil','Isekai':'isekai','Mecha':'mecha','Music':'musica',
  'Psychological':'psicologico','Historical':'historico','Military':'militar',
  'School':'escolar','Super Power':'superpoderes','Magic':'magia',
  'Martial Arts':'artes-marciais','Space':'espacial','Vampire':'vampiro',
  'Harem':'harem','Game':'jogos','Samurai':'samurai','Demons':'demonios',
  'Parody':'parodia','Gourmet':'culinaria','Reincarnation':'reencarnacao',
  'Survival':'sobrevivencia','Time Travel':'viagem-no-tempo',
  'Urban Fantasy':'fantasia-urbana','Video Game':'video-game',
  'Detective':'detetive','Gore':'gore','Mahou Shoujo':'mahou-shoujo',
  'Medical':'medico','Mythology':'mitologia','Idols (Female)':'idols',
  'High Stakes Game':'jogos-de-apostas','Strategy Game':'jogo-de-estrategia',
  'Racing':'corrida','Adult Cast':'elenco-adulto',
  'Combat Sports':'esportes-de-combate','Educational':'educacional',
  'Anthropomorphic':'antropomorfico','CGDCT':'cgdct','Crossdressing':'crossdressing',
  'Delinquents':'delinquentes','Performing Arts':'artes-cenicas',
  'Reverse Harem':'reverse-harem','Showbiz':'showbiz','Workplace':'trabalho',
  'Love Polygon':'triangulo-amoroso','Otaku Culture':'cultura-otaku',
};
const GN = {
  'acao':'Ação','aventura':'Aventura','comedia':'Comédia','drama':'Drama',
  'fantasia':'Fantasia','horror':'Horror','misterio':'Mistério','romance':'Romance',
  'ficcao-cientifica':'Ficção Científica','slice-of-life':'Slice of Life',
  'esportes':'Esportes','sobrenatural':'Sobrenatural','suspense':'Suspense',
  'ecchi':'Ecchi','premiado':'Premiado','avant-garde':'Avant Garde',
  'boys-love':'Boys Love','girls-love':'Girls Love','shounen':'Shounen',
  'shoujo':'Shoujo','seinen':'Seinen','josei':'Josei','infantil':'Infantil',
  'isekai':'Isekai','mecha':'Mecha','musica':'Música','psicologico':'Psicológico',
  'historico':'Histórico','militar':'Militar','escolar':'Escolar',
  'superpoderes':'Superpoderes','magia':'Magia','artes-marciais':'Artes Marciais',
  'espacial':'Espacial','vampiro':'Vampiro','harem':'Harem','jogos':'Jogos',
  'samurai':'Samurai','demonios':'Demônios','parodia':'Paródia','culinaria':'Culinária',
  'reencarnacao':'Reencarnação','sobrevivencia':'Sobrevivência',
  'viagem-no-tempo':'Viagem no Tempo','fantasia-urbana':'Fantasia Urbana',
  'video-game':'Video Game','detetive':'Detetive','gore':'Gore',
  'mahou-shoujo':'Mahou Shoujo','medico':'Médico','mitologia':'Mitologia',
  'idols':'Idols','jogos-de-apostas':'Jogos de Apostas',
  'jogo-de-estrategia':'Jogo de Estratégia','corrida':'Corrida',
  'elenco-adulto':'Elenco Adulto','esportes-de-combate':'Esportes de Combate',
  'educacional':'Educacional','antropomorfico':'Antropomórfico','cgdct':'CGDCT',
  'crossdressing':'Crossdressing','delinquentes':'Delinquentes',
  'artes-cenicas':'Artes Cênicas','reverse-harem':'Reverse Harem',
  'showbiz':'Showbiz','trabalho':'Trabalho','triangulo-amoroso':'Triângulo Amoroso',
  'cultura-otaku':'Cultura Otaku',
};

const gSlug = r => G[r] || r.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const gName = (slug,fb) => GN[slug] || fb;
const mkSlug = (t,id) => (t||'').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim()
  .replace(/\s+/g,'-').replace(/-+/g,'-').substring(0,90)+'-'+id;

// Escapa string para SQL
const esc = s => {
  if(s === null || s === undefined || s === '') return 'NULL';
  return "'" + String(s).replace(/'/g,"''").substring(0,2000) + "'";
};
const escNum = n => (n === null || n === undefined || isNaN(n)) ? 'NULL' : String(n);

const normStatus = s => {
  if(!s) return 'FINISHED';
  const l=s.toLowerCase();
  if(l.includes('currently')) return 'RELEASING';
  if(l.includes('not yet'))   return 'NOT_YET_AIRED';
  if(l.includes('hiatus'))    return 'HIATUS';
  return 'FINISHED';
};
const normType = t => {
  if(!t) return 'TV'; const u=t.toUpperCase();
  if(u==='TV') return 'TV'; if(u==='MOVIE') return 'Movie';
  if(u==='OVA') return 'OVA'; if(u==='ONA') return 'ONA';
  if(u==='SPECIAL') return 'Special'; if(u==='MUSIC') return 'Music';
  return t;
};
const normSeason = s => {
  if(!s) return null; const l=s.toLowerCase();
  if(l.includes('winter')) return 'WINTER'; if(l.includes('spring')) return 'SPRING';
  if(l.includes('summer')) return 'SUMMER'; if(l.includes('fall')||l.includes('autumn')) return 'FALL';
  return null;
};

function parseCSV(line) {
  const r=[]; let cur='',inQ=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}
    else if(c===','&&!inQ){r.push(cur);cur='';}
    else cur+=c;
  }
  r.push(cur); return r;
}

function runPsql(sqlFile) {
  const env = Object.assign({}, process.env, {
    PGPASSWORD: 'npg_7wXLYIo9ypHi',
    PGHOST: 'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
    PGPORT: '5432',
    PGDATABASE: 'neondb',
    PGUSER: 'neondb_owner',
    PGSSLMODE: 'require',
  });
  try {
    const out = execSync(
      `"${PSQL_PATH}" -f "${sqlFile}"`,
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, timeout: 300000, env }
    );
    return out;
  } catch(e) {
    return e.stdout || e.stderr || e.message || '';
  }
}

function run() {
  console.log('='.repeat(58));
  console.log('  ANIMES WORLD — IMPORTAÇÃO VIA SQL');
  console.log('='.repeat(58));

  const csvPath = path.join(__dirname,'all_anime.csv');
  const lines = fs.readFileSync(csvPath,'utf8').split('\n').filter(l=>l.trim());
  const hdr = parseCSV(lines[0]);
  const rows = lines.slice(1);

  console.log(`\n  Dataset: ${rows.length} animes`);
  console.log('  Gerando SQL...\n');

  let inserted = 0, skipped = 0, errors = 0;
  const genreMap = {}; // slug → existe
  const genreSQLLines = [];
  const animeSQLLines = [];
  const seasonSQLLines = [];
  const agSQLLines = [];

  for(const line of rows) {
    if(!line.trim()){skipped++;continue;}
    const row = parseCSV(line);
    const g = c => { const i=hdr.indexOf(c); return i>=0?(row[i]||'').trim():''; };

    const malId = parseInt(g('mal_id'));
    if(!malId||isNaN(malId)){skipped++;continue;}
    if(g('is_hentai')==='True'){skipped++;continue;}

    const title  = g('title') || `Anime ${malId}`;
    const titleE = g('title_english')||null;
    const titleJ = g('title_japanese')||null;
    const year   = parseInt(g('year'))||null;
    const season = normSeason(g('season'));
    const scoreN = parseFloat(g('score'));
    const score  = isNaN(scoreN)?null:parseFloat(scoreN.toFixed(2));
    const pop    = parseInt(g('popularity'))||parseInt(g('members'))||0;
    const eps    = parseInt(g('episodes'))||0;
    const type   = normType(g('type'));
    const status = normStatus(g('status'));
    const synop  = g('synopsis_short')||null;
    const trailer= g('trailer_url')||null;
    const studio = g('studios')?(g('studios').split('|')[0].trim()||null):null;
    const dm     = g('duration').match(/(\d+)\s*min/);
    const dur    = dm?parseInt(dm[1]):null;

    if(year&&(year<1950||year>2030)){skipped++;continue;}

    const slug   = mkSlug(titleE||title, malId);
    const folder = Math.floor(malId/1000)*1000+1;
    const cover  = `https://cdn.myanimelist.net/images/anime/${folder}/${malId}l.jpg`;

    // Gera SQL de INSERT para o anime
    animeSQLLines.push(
      `INSERT INTO anime (external_id,slug,title,title_english,title_japanese,description,cover_url,year,season,status,type,episodes_count,duration,studio,score,popularity,trailer_url,is_adult)\n` +
      `VALUES (${malId},${esc(slug)},${esc(title)},${esc(titleE)},${esc(titleJ)},${esc(synop)},${esc(cover)},${escNum(year)},${season?esc(season):'NULL'},${esc(status)},${esc(type)},${escNum(eps||0)},${escNum(dur)},${esc(studio)},${escNum(score)},${escNum(pop||0)},${esc(trailer)},false)\n` +
      `ON CONFLICT (external_id) DO UPDATE SET title=EXCLUDED.title,title_english=EXCLUDED.title_english,score=COALESCE(anime.score,EXCLUDED.score),popularity=GREATEST(anime.popularity,EXCLUDED.popularity),status=EXCLUDED.status,type=EXCLUDED.type,updated_at=NOW();`
    );

    // Temporada
    seasonSQLLines.push(
      `INSERT INTO seasons (anime_id,number,title,year,episodes_count)\n` +
      `SELECT id,1,'Temporada 1',${escNum(year)},${escNum(eps||0)} FROM anime WHERE external_id=${malId}\n` +
      `ON CONFLICT (anime_id,number) DO NOTHING;`
    );

    // Gêneros
    const rawG = [g('genres'),g('themes'),g('demographics')]
      .join('|').split('|').map(x=>x.trim()).filter(x=>x&&x!=='0');
    for(const rg of [...new Set(rawG)]) {
      const gs = gSlug(rg);
      const gn = gName(gs, rg);
      if(!genreMap[gs]) {
        genreMap[gs] = true;
        genreSQLLines.push(
          `INSERT INTO genres (name,slug) VALUES (${esc(gn)},${esc(gs)}) ON CONFLICT (slug) DO NOTHING;`
        );
      }
      agSQLLines.push(
        `INSERT INTO anime_genres (anime_id,genre_id)\n` +
        `SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=${malId} AND g.slug=${esc(gs)}\n` +
        `ON CONFLICT DO NOTHING;`
      );
    }
    inserted++;
  }

  console.log(`  Animes para processar: ${inserted} | Ignorados: ${skipped}`);
  console.log('  Escrevendo arquivos SQL...');

  const tmpDir = path.join(__dirname, '..', 'dataset');
  fs.mkdirSync(tmpDir, { recursive: true });

  // Escreve em lotes para não ultrapassar limites
  const CHUNK = 500;

  // 1. Gêneros
  const genreFile = path.join(tmpDir, 'genres.sql');
  fs.writeFileSync(genreFile, 'SET client_encoding TO UTF8;\n' + genreSQLLines.join('\n'));
  console.log(`  Gêneros: ${genreSQLLines.length} inserções`);

  // 2. Animes em chunks
  console.log(`  Animes: ${animeSQLLines.length} inserções em chunks de ${CHUNK}`);
  const animeChunks = Math.ceil(animeSQLLines.length / CHUNK);

  // 3. Seasons
  const seasonFile = path.join(tmpDir, 'seasons.sql');
  fs.writeFileSync(seasonFile, 'SET client_encoding TO UTF8;\n' + seasonSQLLines.join('\n'));

  // 4. Anime-genres
  const agFile = path.join(tmpDir, 'anime_genres.sql');
  fs.writeFileSync(agFile, 'SET client_encoding TO UTF8;\n' + agSQLLines.join('\n'));

  // EXECUÇÃO
  console.log('\n  Executando via psql...\n');

  // Gêneros
  process.stdout.write('  [1/4] Inserindo generos... ');
  const gr = runPsql(genreFile);
  console.log('OK');

  // Animes por chunk
  for(let ci = 0; ci < animeChunks; ci++) {
    const chunk = animeSQLLines.slice(ci*CHUNK, (ci+1)*CHUNK);
    const chunkFile = path.join(tmpDir, `anime_chunk_${ci}.sql`);
    fs.writeFileSync(chunkFile, 'SET client_encoding TO UTF8;\n' + chunk.join('\n'));
    const pct = Math.round(((ci+1)/animeChunks)*100);
    process.stdout.write(`  [2/4] Animes ${String(pct).padStart(3)}% (${(ci+1)*CHUNK}/${animeSQLLines.length})... `);
    const r = runPsql(chunkFile);
    const errCount = (r.match(/ERROR/g)||[]).length;
    console.log(errCount > 0 ? `${errCount} erros` : 'OK');
    fs.unlinkSync(chunkFile);
  }

  // Temporadas
  process.stdout.write('  [3/4] Criando temporadas... ');
  runPsql(seasonFile);
  console.log('OK');

  // Anime-genres em chunks
  const agChunks = Math.ceil(agSQLLines.length / (CHUNK*2));
  for(let ci = 0; ci < agChunks; ci++) {
    const chunk = agSQLLines.slice(ci*CHUNK*2, (ci+1)*CHUNK*2);
    const chunkFile = path.join(tmpDir, `ag_chunk_${ci}.sql`);
    fs.writeFileSync(chunkFile, 'SET client_encoding TO UTF8;\n' + chunk.join('\n'));
    const pct = Math.round(((ci+1)/agChunks)*100);
    process.stdout.write(`  [4/4] Generos ${String(pct).padStart(3)}%... `);
    runPsql(chunkFile);
    console.log('OK');
    fs.unlinkSync(chunkFile);
  }

  // Relatório final via psql
  const pgEnv = Object.assign({}, process.env, {
    PGPASSWORD: 'npg_7wXLYIo9ypHi',
    PGHOST: 'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
    PGPORT: '5432', PGDATABASE: 'neondb', PGUSER: 'neondb_owner', PGSSLMODE: 'require',
  });
  const countOut = execSync(
    `"${PSQL_PATH}" -t -c "SELECT COUNT(*) FROM anime;"`,
    { encoding: 'utf8', timeout: 15000, env: pgEnv }
  ).trim();
  const genreOut = execSync(
    `"${PSQL_PATH}" -t -c "SELECT COUNT(*) FROM genres;"`,
    { encoding: 'utf8', timeout: 15000, env: pgEnv }
  ).trim();

  console.log('\n' + '='.repeat(58));
  console.log('  RELATÓRIO FINAL');
  console.log('='.repeat(58));
  console.log(`  Dataset processado:  ${rows.length} linhas`);
  console.log(`  Animes gerados:      ${inserted}`);
  console.log(`  Ignorados:           ${skipped}`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  TOTAL NO BANCO:      ${countOut} animes`);
  console.log(`  Gêneros:             ${genreOut}`);
  console.log('='.repeat(58));

  // Limpa arquivos temporários
  try { fs.unlinkSync(genreFile); } catch(_) {}
  try { fs.unlinkSync(seasonFile); } catch(_) {}
  try { fs.unlinkSync(agFile); } catch(_) {}
}

run();
