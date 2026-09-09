/**
 * ANIMES WORLD — Importador Final
 * Usa psql com variáveis de ambiente (método confirmado funcionando)
 */
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PSQL = 'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe';
const ENV = Object.assign({}, process.env, {
  PGPASSWORD: 'npg_7wXLYIo9ypHi',
  PGHOST:     'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
  PGPORT:     '5432',
  PGDATABASE: 'neondb',
  PGUSER:     'neondb_owner',
  PGSSLMODE:  'require',
});

function psql(sql) {
  const tmp = path.join(__dirname, '_tmp_import.sql');
  fs.writeFileSync(tmp, sql, 'utf8');
  try {
    return execSync(`"${PSQL}" -f "${tmp}"`, { encoding:'utf8', env:ENV, timeout:120000, maxBuffer:20*1024*1024 });
  } catch(e) { return e.stdout || ''; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}

function psqlQuery(sql) {
  try {
    return execSync(`"${PSQL}" -t -c "${sql}"`, { encoding:'utf8', env:ENV, timeout:15000 }).trim();
  } catch(e) { return '0'; }
}

// ── gêneros ───────────────────────────────────────────────────
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
  'acao':'Acao','aventura':'Aventura','comedia':'Comedia','drama':'Drama',
  'fantasia':'Fantasia','horror':'Horror','misterio':'Misterio','romance':'Romance',
  'ficcao-cientifica':'Ficcao Cientifica','slice-of-life':'Slice of Life',
  'esportes':'Esportes','sobrenatural':'Sobrenatural','suspense':'Suspense',
  'ecchi':'Ecchi','premiado':'Premiado','avant-garde':'Avant Garde',
  'boys-love':'Boys Love','girls-love':'Girls Love','shounen':'Shounen',
  'shoujo':'Shoujo','seinen':'Seinen','josei':'Josei','infantil':'Infantil',
  'isekai':'Isekai','mecha':'Mecha','musica':'Musica','psicologico':'Psicologico',
  'historico':'Historico','militar':'Militar','escolar':'Escolar',
  'superpoderes':'Superpoderes','magia':'Magia','artes-marciais':'Artes Marciais',
  'espacial':'Espacial','vampiro':'Vampiro','harem':'Harem','jogos':'Jogos',
  'samurai':'Samurai','demonios':'Demonios','parodia':'Parodia','culinaria':'Culinaria',
  'reencarnacao':'Reencarnacao','sobrevivencia':'Sobrevivencia',
  'viagem-no-tempo':'Viagem no Tempo','fantasia-urbana':'Fantasia Urbana',
  'video-game':'Video Game','detetive':'Detetive','gore':'Gore',
  'mahou-shoujo':'Mahou Shoujo','medico':'Medico','mitologia':'Mitologia',
  'idols':'Idols','jogos-de-apostas':'Jogos de Apostas',
  'jogo-de-estrategia':'Jogo de Estrategia','corrida':'Corrida',
  'elenco-adulto':'Elenco Adulto','esportes-de-combate':'Esportes de Combate',
  'educacional':'Educacional','antropomorfico':'Antropomorfico','cgdct':'CGDCT',
  'crossdressing':'Crossdressing','delinquentes':'Delinquentes',
  'artes-cenicas':'Artes Cenicas','reverse-harem':'Reverse Harem',
  'showbiz':'Showbiz','trabalho':'Trabalho','triangulo-amoroso':'Triangulo Amoroso',
  'cultura-otaku':'Cultura Otaku',
};

const gSlug = r => G[r] || r.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const gName = (slug,fb) => GN[slug] || fb.replace(/'/g,'');

const mkSlug = (t,id) => (t||'').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim()
  .replace(/\s+/g,'-').replace(/-+/g,'-').substring(0,90)+'-'+id;

// Escapa para SQL — SEM acentos para evitar problema de encoding no psql Windows
const esc = s => {
  if(s===null||s===undefined||s==='') return 'NULL';
  return "'" + String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // remove acentos
    .replace(/[^\x00-\x7F]/g,'')  // remove não-ASCII
    .replace(/'/g,"''")
    .substring(0,1000) + "'";
};
const escN = n => (n===null||n===undefined||isNaN(n)||n==='') ? 'NULL' : String(n);

const normStatus = s => {
  if(!s) return 'FINISHED'; const l=s.toLowerCase();
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

function run() {
  console.log('='.repeat(58));
  console.log('  ANIMES WORLD — IMPORTACAO FINAL');
  console.log('='.repeat(58));

  // Quantos já existem
  const existing = psqlQuery('SELECT COUNT(*) FROM anime');
  console.log(`\n  Animes no banco agora: ${existing}`);

  // Pega IDs que já existem para não reprocessar
  const existingIds = new Set();
  try {
    const idsOut = execSync(`"${PSQL}" -t -c "SELECT external_id FROM anime WHERE external_id IS NOT NULL;"`,
      { encoding:'utf8', env:ENV, timeout:30000, maxBuffer:5*1024*1024 });
    idsOut.split('\n').forEach(l => {
      const n = parseInt(l.trim());
      if(!isNaN(n) && n > 0) existingIds.add(n);
    });
  } catch(_) {}
  console.log(`  IDs já importados: ${existingIds.size}`);

  const csvPath = path.join(__dirname,'all_anime.csv');
  const lines = fs.readFileSync(csvPath,'utf8').split('\n').filter(l=>l.trim());
  const hdr = parseCSV(lines[0]);
  const rows = lines.slice(1);

  console.log(`  Dataset total: ${rows.length}`);

  // Filtra apenas os que ainda não existem
  const toInsert = [];
  let skipped = 0;

  for(const line of rows) {
    if(!line.trim()){skipped++;continue;}
    const row = parseCSV(line);
    const g = c => { const i=hdr.indexOf(c); return i>=0?(row[i]||'').trim():''; };
    const malId = parseInt(g('mal_id'));
    if(!malId||isNaN(malId)){skipped++;continue;}
    if(g('is_hentai')==='True'){skipped++;continue;}
    if(existingIds.has(malId)){skipped++;continue;} // já existe
    toInsert.push({row, hdr, malId});
  }

  console.log(`  Novos para importar: ${toInsert.length} | Ja existem/ignorados: ${skipped}`);

  if(toInsert.length === 0) {
    console.log('\n  Nada para importar! Todos ja estao no banco.');
    const finalCount = psqlQuery('SELECT COUNT(*) FROM anime');
    console.log(`  Total: ${finalCount} animes`);
    return;
  }

  // Gera SQL em chunks de 300
  const CHUNK = 300;
  let inserted = 0;
  const genreMap = {};

  // Carrega gêneros existentes
  try {
    const gout = execSync(`"${PSQL}" -t -c "SELECT slug FROM genres;"`,
      { encoding:'utf8', env:ENV, timeout:15000 });
    gout.split('\n').forEach(l => { const s=l.trim(); if(s) genreMap[s]=true; });
  } catch(_) {}

  console.log(`\n  Importando em chunks de ${CHUNK}...\n`);

  for(let ci=0; ci<toInsert.length; ci+=CHUNK) {
    const chunk = toInsert.slice(ci, ci+CHUNK);
    const sqlParts = ['SET client_encoding TO LATIN1;'];
    const genreParts = [];
    const seasonParts = [];
    const agParts = [];

    for(const {row, hdr: h, malId} of chunk) {
      const g = c => { const i=h.indexOf(c); return i>=0?(row[i]||'').trim():''; };

      const title  = (g('title')||`Anime ${malId}`).replace(/'/g,'');
      const titleE = (g('title_english')||'').replace(/'/g,'')||null;
      const year   = parseInt(g('year'))||null;
      const season = normSeason(g('season'));
      const scoreN = parseFloat(g('score'));
      const score  = isNaN(scoreN)?null:parseFloat(scoreN.toFixed(2));
      const pop    = parseInt(g('popularity'))||parseInt(g('members'))||0;
      const eps    = parseInt(g('episodes'))||0;
      const type   = normType(g('type'));
      const status = normStatus(g('status'));
      const studio = (g('studios').split('|')[0]||'').trim().replace(/'/g,'')||null;
      const dm     = g('duration').match(/(\d+)\s*min/);
      const dur    = dm?parseInt(dm[1]):null;
      const trailer= (g('trailer_url')||'').replace(/'/g,'')||null;
      // Sinopse sem caracteres especiais
      const synop  = g('synopsis_short')
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^\x00-\x7F]/g,'').replace(/'/g,"''")
        .substring(0,500)||null;

      if(year&&(year<1950||year>2030)) continue;

      const slug   = mkSlug(titleE||title, malId);
      const folder = Math.floor(malId/1000)*1000+1;
      const cover  = `https://cdn.myanimelist.net/images/anime/${folder}/${malId}l.jpg`;

      sqlParts.push(
        `INSERT INTO anime (external_id,slug,title,title_english,description,cover_url,` +
        `year,season,status,type,episodes_count,duration,studio,score,popularity,trailer_url,is_adult)` +
        ` VALUES (${malId},'${slug}','${title}',${titleE?`'${titleE}'`:'NULL'},` +
        `${synop?`'${synop}'`:'NULL'},'${cover}',` +
        `${escN(year)},${season?`'${season}'`:'NULL'},'${status}','${type}',` +
        `${escN(eps||0)},${escN(dur)},${studio?`'${studio}'`:'NULL'},` +
        `${escN(score)},${escN(pop||0)},${trailer?`'${trailer}'`:'NULL'},false)` +
        ` ON CONFLICT (external_id) DO NOTHING;`
      );

      seasonParts.push(
        `INSERT INTO seasons (anime_id,number,title,year,episodes_count)` +
        ` SELECT id,1,'Temporada 1',${escN(year)},${escN(eps||0)} FROM anime WHERE external_id=${malId}` +
        ` ON CONFLICT DO NOTHING;`
      );

      const rawG = [g('genres'),g('themes'),g('demographics')]
        .join('|').split('|').map(x=>x.trim()).filter(x=>x&&x!=='0');
      for(const rg of [...new Set(rawG)]) {
        const gs = gSlug(rg);
        const gn = gName(gs, rg);
        if(!genreMap[gs]) {
          genreParts.push(`INSERT INTO genres (name,slug) VALUES ('${gn}','${gs}') ON CONFLICT (slug) DO NOTHING;`);
          genreMap[gs] = true;
        }
        agParts.push(
          `INSERT INTO anime_genres (anime_id,genre_id)` +
          ` SELECT a.id,g.id FROM anime a,genres g` +
          ` WHERE a.external_id=${malId} AND g.slug='${gs}'` +
          ` ON CONFLICT DO NOTHING;`
        );
      }
    }

    // Executa o chunk
    const fullSQL = [
      ...sqlParts,
      ...genreParts,
      ...seasonParts,
      ...agParts,
    ].join('\n');

    const tmpFile = path.join(__dirname,'..','dataset',`chunk_${ci}.sql`);
    fs.mkdirSync(path.dirname(tmpFile), { recursive: true });
    fs.writeFileSync(tmpFile, fullSQL, 'latin1');

    try {
      execSync(`"${PSQL}" -f "${tmpFile}"`,
        { encoding:'utf8', env:ENV, timeout:120000, maxBuffer:10*1024*1024 });
      inserted += chunk.length;
    } catch(e) {
      // continua mesmo com erros parciais
    } finally {
      try { fs.unlinkSync(tmpFile); } catch(_) {}
    }

    const done = Math.min(ci+CHUNK, toInsert.length);
    const pct  = Math.round(done/toInsert.length*100);
    console.log(`  [${String(pct).padStart(3)}%] ${done}/${toInsert.length} processados`);
  }

  // Relatório final
  const finalAnimes  = psqlQuery('SELECT COUNT(*) FROM anime');
  const finalGenres  = psqlQuery('SELECT COUNT(*) FROM genres');
  const finalSeasons = psqlQuery('SELECT COUNT(*) FROM seasons');

  console.log('\n' + '='.repeat(58));
  console.log('  RELATORIO FINAL');
  console.log('='.repeat(58));
  console.log(`  Dataset:         ${rows.length} registros`);
  console.log(`  Ja existiam:     ${existingIds.size}`);
  console.log(`  Novos:           ${inserted}`);
  console.log(`  Ignorados:       ${skipped}`);
  console.log(`  ---`);
  console.log(`  TOTAL NO BANCO:  ${finalAnimes} animes`);
  console.log(`  Generos:         ${finalGenres}`);
  console.log(`  Temporadas:      ${finalSeasons}`);
  console.log('='.repeat(58));
}

run();
