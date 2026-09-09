/**
 * ANIMES WORLD — Importador v3
 * Abordagem: check-then-insert/update para evitar deadlocks no Neon
 */
const fs   = require('fs');
const path = require('path');
const { Client } = require('pg');

const DB = {
  host: 'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
  port: 5432, database: 'neondb',
  user: 'neondb_owner', password: 'npg_7wXLYIo9ypHi',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
};

/* ── gêneros ─────────────────────────────────────────────── */
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
  'boys-love':'Boys Love','girls-love':'Girls Love',
  'shounen':'Shounen','shoujo':'Shoujo','seinen':'Seinen','josei':'Josei',
  'infantil':'Infantil','isekai':'Isekai','mecha':'Mecha','musica':'Música',
  'psicologico':'Psicológico','historico':'Histórico','militar':'Militar',
  'escolar':'Escolar','superpoderes':'Superpoderes','magia':'Magia',
  'artes-marciais':'Artes Marciais','espacial':'Espacial','vampiro':'Vampiro',
  'harem':'Harem','jogos':'Jogos','samurai':'Samurai','demonios':'Demônios',
  'parodia':'Paródia','culinaria':'Culinária','reencarnacao':'Reencarnação',
  'sobrevivencia':'Sobrevivência','viagem-no-tempo':'Viagem no Tempo',
  'fantasia-urbana':'Fantasia Urbana','video-game':'Video Game',
  'detetive':'Detetive','gore':'Gore','mahou-shoujo':'Mahou Shoujo',
  'medico':'Médico','mitologia':'Mitologia','idols':'Idols',
  'jogos-de-apostas':'Jogos de Apostas','jogo-de-estrategia':'Jogo de Estratégia',
  'corrida':'Corrida','elenco-adulto':'Elenco Adulto',
  'esportes-de-combate':'Esportes de Combate','educacional':'Educacional',
  'antropomorfico':'Antropomórfico','cgdct':'CGDCT','crossdressing':'Crossdressing',
  'delinquentes':'Delinquentes','artes-cenicas':'Artes Cênicas',
  'reverse-harem':'Reverse Harem','showbiz':'Showbiz','trabalho':'Trabalho',
  'triangulo-amoroso':'Triângulo Amoroso','cultura-otaku':'Cultura Otaku',
};

const gSlug = r => G[r] || r.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const gName = (slug,fb) => GN[slug] || fb;
const mkSlug = (t,id) => (t||'').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim()
  .replace(/\s+/g,'-').replace(/-+/g,'-').substring(0,90)+'-'+id;
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

async function run() {
  console.log('='.repeat(58));
  console.log('  ANIMES WORLD — IMPORTAÇÃO COMPLETA');
  console.log('='.repeat(58));

  const csvPath = path.join(__dirname,'all_anime.csv');
  const lines = fs.readFileSync(csvPath,'utf8').split('\n').filter(l=>l.trim());
  const hdr = parseCSV(lines[0]);
  const rows = lines.slice(1);
  console.log(`\n  Dataset: ${rows.length} animes`);

  const st = {ok:0,upd:0,skip:0,err:0};
  const gc = {}; // genre cache slug→id

  // Carrega gêneros existentes
  let db = new Client(DB); await db.connect();
  const eg = await db.query('SELECT id,slug FROM genres');
  eg.rows.forEach(g=>gc[g.slug]=g.id);
  const initCount = (await db.query('SELECT COUNT(*) FROM anime')).rows[0].count;
  console.log(`  Animes no banco agora: ${initCount}\n`);
  await db.end();

  // Processa em lotes de 200 animes por conexão
  const BATCH = 200;
  for(let b=0; b<rows.length; b+=BATCH) {
    const batch = rows.slice(b, b+BATCH);
    db = new Client(DB);
    try {
      await db.connect();
      for(const line of batch) {
        if(!line.trim()){st.skip++;continue;}
        const row = parseCSV(line);
        const g = c => { const i=hdr.indexOf(c); return i>=0?(row[i]||'').trim():''; };

        const malId = parseInt(g('mal_id'));
        if(!malId||isNaN(malId)){st.skip++;continue;}
        if(g('is_hentai')==='True'){st.skip++;continue;}

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
        if(year&&(year<1950||year>2030)){st.skip++;continue;}

        const slug   = mkSlug(titleE||title, malId);
        const folder = Math.floor(malId/1000)*1000+1;
        const cover  = `https://cdn.myanimelist.net/images/anime/${folder}/${malId}l.jpg`;

        try {
          // Verifica se já existe
          const ex = await db.query('SELECT id FROM anime WHERE external_id=$1',[malId]);

          if(ex.rows.length > 0) {
            // Atualiza apenas campos vazios
            await db.query(
              `UPDATE anime SET
                title=COALESCE(NULLIF(title,''), $2),
                title_english=COALESCE(title_english,$3),
                score=COALESCE(score,$4),
                popularity=GREATEST(popularity,$5),
                status=$6, type=$7,
                episodes_count=COALESCE(NULLIF(episodes_count,0),$8),
                updated_at=NOW()
               WHERE external_id=$1`,
              [malId,title,titleE,score,pop,status,type,eps]
            );
            st.upd++;
          } else {
            // Insere novo
            const ins = await db.query(
              `INSERT INTO anime
                (external_id,slug,title,title_english,title_japanese,description,
                 cover_url,year,season,status,type,episodes_count,duration,
                 studio,score,popularity,trailer_url,is_adult)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
               ON CONFLICT (slug) DO UPDATE SET external_id=EXCLUDED.external_id
               RETURNING id`,
              [malId,slug,title,titleE,titleJ,synop,cover,
               year,season,status,type,eps,dur,studio,score,pop,trailer,false]
            );
            const animeId = ins.rows[0].id;

            // Temporada
            await db.query(
              `INSERT INTO seasons (anime_id,number,title,year,episodes_count)
               VALUES ($1,1,'Temporada 1',$2,$3) ON CONFLICT DO NOTHING`,
              [animeId,year,eps]
            );

            // Gêneros
            const rawG = [g('genres'),g('themes'),g('demographics')]
              .join('|').split('|').map(x=>x.trim()).filter(x=>x&&x!=='0');
            for(const rg of [...new Set(rawG)]) {
              const gs = gSlug(rg);
              if(!gc[gs]) {
                const gr = await db.query(
                  `INSERT INTO genres (name,slug) VALUES ($1,$2)
                   ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
                  [gName(gs,rg), gs]
                );
                gc[gs] = gr.rows[0].id;
              }
              await db.query(
                'INSERT INTO anime_genres (anime_id,genre_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
                [animeId, gc[gs]]
              );
            }
            st.ok++;
          }
        } catch(e){ st.err++; }
      }
      await db.end();
    } catch(ce) {
      console.error(`\n  Erro lote ${b}: ${ce.message}`);
      try{await db.end();}catch(_){}
      st.err+=batch.length;
      await new Promise(r=>setTimeout(r,3000));
    }

    const done = Math.min(b+BATCH, rows.length);
    const pct  = Math.round(done/rows.length*100);
    console.log(`  [${String(pct).padStart(3)}%] ${done}/${rows.length} | +${st.ok} novos | ~${st.upd} atualizados | skip:${st.skip} | err:${st.err}`);
  }

  // Relatório final
  db = new Client(DB); await db.connect();
  const [ac,gc2,sc] = await Promise.all([
    db.query('SELECT COUNT(*) FROM anime'),
    db.query('SELECT COUNT(*) FROM genres'),
    db.query('SELECT COUNT(*) FROM seasons'),
  ]);
  await db.end();

  console.log('\n'+'='.repeat(58));
  console.log('  RELATÓRIO FINAL');
  console.log('='.repeat(58));
  console.log(`  Dataset:          ${rows.length} registros`);
  console.log(`  Novos:            ${st.ok}`);
  console.log(`  Atualizados:      ${st.upd}`);
  console.log(`  Ignorados:        ${st.skip}`);
  console.log(`  Erros:            ${st.err}`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  TOTAL NO BANCO:   ${ac.rows[0].count} animes`);
  console.log(`  Gêneros:          ${gc2.rows[0].count}`);
  console.log(`  Temporadas:       ${sc.rows[0].count}`);
  console.log('='.repeat(58));
}

run().catch(e=>{ console.error('FATAL:',e.message); process.exit(1); });
