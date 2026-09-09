/**
 * Importa apenas os animes faltantes (que ainda nao estao no banco)
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
  'educacional':'Educacional',
};

const gSlug = r => G[r] || r.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const gName = (slug,fb) => GN[slug] || fb;
const mkSlug = (t,id) => (t||'').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim()
  .replace(/\s+/g,'-').replace(/-+/g,'-').substring(0,90)+'-'+id;

const normStatus = s => {
  if(!s) return 'FINISHED'; const l=s.toLowerCase();
  if(l.includes('currently')) return 'RELEASING';
  if(l.includes('not yet'))   return 'NOT_YET_AIRED';
  return 'FINISHED';
};
const normType = t => {
  if(!t) return 'TV'; const u=t.toUpperCase();
  if(u==='TV') return 'TV'; if(u==='MOVIE') return 'Movie';
  if(u==='OVA') return 'OVA'; if(u==='ONA') return 'ONA';
  if(u==='SPECIAL') return 'Special'; return t;
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

async function main() {
  // Conexão para ler IDs existentes
  const db = new Client(DB);
  await db.connect();
  
  const existing = await db.query('SELECT external_id FROM anime WHERE external_id IS NOT NULL');
  const existingSet = new Set(existing.rows.map(r => r.external_id));
  const initCount = (await db.query('SELECT COUNT(*) FROM anime')).rows[0].count;
  
  // Cache de gêneros
  const gc = {};
  const genres = await db.query('SELECT id, slug FROM genres');
  genres.rows.forEach(g => gc[g.slug] = g.id);
  
  console.log(`Animes no banco: ${initCount}`);
  console.log(`IDs existentes:  ${existingSet.size}`);

  // Lê CSV e filtra faltantes
  const csvPath = path.join(__dirname, 'all_anime.csv');
  const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim());
  const hdr = parseCSV(lines[0]);
  
  const missing = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const row = parseCSV(line);
    const g = c => { const i=hdr.indexOf(c); return i>=0?(row[i]||'').trim():''; };
    const malId = parseInt(g('mal_id'));
    if (!malId || isNaN(malId)) continue;
    if (g('is_hentai') === 'True') continue;
    if (existingSet.has(malId)) continue;
    missing.push({ row, malId });
  }

  console.log(`Faltantes:       ${missing.length}`);
  console.log(`\nImportando...\n`);

  let ok = 0, err = 0;

  for (const { row, malId } of missing) {
    const g = c => { const i=hdr.indexOf(c); return i>=0?(row[i]||'').trim():''; };

    const title  = g('title') || `Anime ${malId}`;
    const titleE = g('title_english') || null;
    const titleJ = g('title_japanese') || null;
    const year   = parseInt(g('year')) || null;
    const season = normSeason(g('season'));
    const scoreN = parseFloat(g('score'));
    const score  = isNaN(scoreN) ? null : parseFloat(scoreN.toFixed(2));
    const pop    = parseInt(g('popularity')) || parseInt(g('members')) || 0;
    const eps    = parseInt(g('episodes')) || 0;
    const type   = normType(g('type'));
    const status = normStatus(g('status'));
    const synop  = g('synopsis_short') || null;
    const trailer = g('trailer_url') || null;
    const studio = g('studios') ? g('studios').split('|')[0].trim() : null;
    const dm = g('duration').match(/(\d+)\s*min/);
    const dur = dm ? parseInt(dm[1]) : null;

    if (year && (year < 1950 || year > 2030)) continue;

    const slug   = mkSlug(titleE || title, malId);
    const folder = Math.floor(malId / 1000) * 1000 + 1;
    const cover  = `https://cdn.myanimelist.net/images/anime/${folder}/${malId}l.jpg`;

    try {
      const r = await db.query(
        `INSERT INTO anime (external_id,slug,title,title_english,title_japanese,
           description,cover_url,year,season,status,type,episodes_count,duration,
           studio,score,popularity,trailer_url,is_adult)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         ON CONFLICT (external_id) DO NOTHING
         RETURNING id`,
        [malId,slug,title,titleE,titleJ,synop,cover,year,season,status,type,
         eps,dur,studio,score,pop,trailer,false]
      );

      if (r.rows[0]) {
        const animeId = r.rows[0].id;

        // Temporada
        await db.query(
          `INSERT INTO seasons (anime_id,number,title,year,episodes_count)
           VALUES ($1,1,'Temporada 1',$2,$3) ON CONFLICT DO NOTHING`,
          [animeId, year, eps]
        );

        // Gêneros
        const rawG = [g('genres'),g('themes'),g('demographics')]
          .join('|').split('|').map(x=>x.trim()).filter(x=>x&&x!=='0');
        for (const rg of [...new Set(rawG)]) {
          const gs = gSlug(rg);
          const gn = gName(gs, rg);
          if (!gc[gs]) {
            const gr = await db.query(
              `INSERT INTO genres (name,slug) VALUES ($1,$2)
               ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
              [gn, gs]
            );
            gc[gs] = gr.rows[0].id;
          }
          await db.query(
            'INSERT INTO anime_genres (anime_id,genre_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [animeId, gc[gs]]
          );
        }
        ok++;
      }
    } catch(e) {
      err++;
    }

    if ((ok + err) % 50 === 0) {
      console.log(`  ${ok + err}/${missing.length} | ok:${ok} err:${err}`);
    }
  }

  const finalCount = (await db.query('SELECT COUNT(*) FROM anime')).rows[0].count;
  const finalGenres = (await db.query('SELECT COUNT(*) FROM genres')).rows[0].count;
  await db.end();

  console.log('\n' + '='.repeat(50));
  console.log(`  Inseridos:     ${ok}`);
  console.log(`  Erros:         ${err}`);
  console.log(`  TOTAL BANCO:   ${finalCount} animes`);
  console.log(`  Gêneros:       ${finalGenres}`);
  console.log('='.repeat(50));
  process.exit(0);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
