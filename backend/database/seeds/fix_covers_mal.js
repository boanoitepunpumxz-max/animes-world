/**
 * Atualiza capas dos animes com URLs do MyAnimeList CDN
 * O MAL CDN é estável e não bloqueia requisições diretas
 */
const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_7wXLYIo9ypHi@ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const pool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });

// URLs do MyAnimeList CDN — estáveis e sem bloqueio
const COVERS_MAL = [
  { slug: 'solo-leveling',       cover: 'https://cdn.myanimelist.net/images/anime/1801/141551.jpg' },
  { slug: 'solo-leveling-main',  cover: 'https://cdn.myanimelist.net/images/anime/1801/141551.jpg' },
  { slug: 'shingeki-no-kyojin',  cover: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg' },
  { slug: 'jujutsu-kaisen',      cover: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg' },
  { slug: 'kimetsu-no-yaiba',    cover: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { slug: 'demon-slayer-mugen-train', cover: 'https://cdn.myanimelist.net/images/anime/1704/106947.jpg' },
  { slug: 'demon-slayer-entertainment-district', cover: 'https://cdn.myanimelist.net/images/anime/1908/120036.jpg' },
  { slug: 'one-piece',           cover: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg' },
  { slug: 'one-piece-2',         cover: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg' },
  { slug: 'chainsaw-man',        cover: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg' },
  { slug: 'chainsaw-man-2',      cover: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg' },
  { slug: 'fma-brotherhood',     cover: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg' },
  { slug: 'fullmetal-alchemist-brotherhood', cover: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg' },
  { slug: 'boku-no-hero-academia', cover: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
  { slug: 'boku-no-hero-s2',     cover: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
  { slug: 'death-note',          cover: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg' },
  { slug: 'death-note-2',        cover: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg' },
  { slug: 'steins-gate',         cover: 'https://cdn.myanimelist.net/images/anime/2/73842.jpg' },
  { slug: 'hunter-x-hunter',     cover: 'https://cdn.myanimelist.net/images/anime/11/33657.jpg' },
  { slug: 'hunter-x-hunter-2011', cover: 'https://cdn.myanimelist.net/images/anime/11/33657.jpg' },
  { slug: 'naruto',              cover: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg' },
  { slug: 'naruto-s1',           cover: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg' },
  { slug: 'naruto-shippuden',    cover: 'https://cdn.myanimelist.net/images/anime/3/50539.jpg' },
  { slug: 'sword-art-online',    cover: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg' },
  { slug: 'sword-art-online-2',  cover: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg' },
  { slug: 'sword-art-online-2nd', cover: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg' },
  { slug: 'sao-original',        cover: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg' },
  { slug: 'sao-alicization',     cover: 'https://cdn.myanimelist.net/images/anime/1052/118052.jpg' },
  { slug: 'bleach',              cover: 'https://cdn.myanimelist.net/images/anime/3/40451.jpg' },
  { slug: 'tokyo-ghoul',         cover: 'https://cdn.myanimelist.net/images/anime/5/64449.jpg' },
  { slug: 'tokyo-ghoul-2',       cover: 'https://cdn.myanimelist.net/images/anime/5/64449.jpg' },
  { slug: 're-zero',             cover: 'https://cdn.myanimelist.net/images/anime/1522/128489.jpg' },
  { slug: 'gintama',             cover: 'https://cdn.myanimelist.net/images/anime/2/21033.jpg' },
  { slug: 'mirai-nikki',         cover: 'https://cdn.myanimelist.net/images/anime/13/33465.jpg' },
  { slug: 'one-punch-man',       cover: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg' },
  { slug: 'one-punch-man-s2',    cover: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg' },
  { slug: 'mob-psycho-100',      cover: 'https://cdn.myanimelist.net/images/anime/8/80356.jpg' },
  { slug: 'code-geass',          cover: 'https://cdn.myanimelist.net/images/anime/5/50331.jpg' },
  { slug: 'madoka-magica',       cover: 'https://cdn.myanimelist.net/images/anime/10/75171.jpg' },
  { slug: 'a-silent-voice',      cover: 'https://cdn.myanimelist.net/images/anime/1122/96435.jpg' },
  { slug: 'your-lie-in-april',   cover: 'https://cdn.myanimelist.net/images/anime/3/67177.jpg' },
  { slug: 'made-in-abyss',       cover: 'https://cdn.myanimelist.net/images/anime/6/86733.jpg' },
  { slug: 'vinland-saga',        cover: 'https://cdn.myanimelist.net/images/anime/1500/103005.jpg' },
  { slug: 'spy-x-family',        cover: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg' },
  { slug: 'mushoku-tensei',      cover: 'https://cdn.myanimelist.net/images/anime/1530/117776.jpg' },
  { slug: 'kaguya-sama',         cover: 'https://cdn.myanimelist.net/images/anime/1295/106551.jpg' },
  { slug: 'kaguya-sama-s2',      cover: 'https://cdn.myanimelist.net/images/anime/1295/106551.jpg' },
  { slug: 'haikyuu',             cover: 'https://cdn.myanimelist.net/images/anime/7/76014.jpg' },
  { slug: 'hajime-no-ippo',      cover: 'https://cdn.myanimelist.net/images/anime/5/16681.jpg' },
  { slug: 'food-wars',           cover: 'https://cdn.myanimelist.net/images/anime/4/76788.jpg' },
  { slug: 'noragami',            cover: 'https://cdn.myanimelist.net/images/anime/5/55232.jpg' },
  { slug: 'kill-la-kill',        cover: 'https://cdn.myanimelist.net/images/anime/1864/110368.jpg' },
  { slug: 'devil-is-a-part-timer', cover: 'https://cdn.myanimelist.net/images/anime/1484/93969.jpg' },
  { slug: 'magi',                cover: 'https://cdn.myanimelist.net/images/anime/14/62884.jpg' },
  { slug: 'evangelion',          cover: 'https://cdn.myanimelist.net/images/anime/7/71060.jpg' },
  { slug: 'cowboy-bebop',        cover: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg' },
  { slug: 'dragon-ball-z',       cover: 'https://cdn.myanimelist.net/images/anime/1277/97578.jpg' },
  { slug: 'grave-of-the-fireflies', cover: 'https://cdn.myanimelist.net/images/anime/3/69810.jpg' },
  { slug: 'anohana',             cover: 'https://cdn.myanimelist.net/images/anime/1910/115962.jpg' },
  { slug: 'reborn',              cover: 'https://cdn.myanimelist.net/images/anime/6/15741.jpg' },
  { slug: 'frieren',             cover: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg' },
  { slug: 'dandadan',            cover: 'https://cdn.myanimelist.net/images/anime/1636/144941.jpg' },
  { slug: 'wolf-children',       cover: 'https://cdn.myanimelist.net/images/anime/7/62098.jpg' },
  { slug: 'my-love-story',       cover: 'https://cdn.myanimelist.net/images/anime/3/73088.jpg' },
];

async function run() {
  let updated = 0;
  for (const a of COVERS_MAL) {
    try {
      const r = await pool.query(
        'UPDATE anime SET cover_url=$1, updated_at=NOW() WHERE slug=$2 RETURNING title',
        [a.cover, a.slug]
      );
      if (r.rows[0]) {
        process.stdout.write('.');
        updated++;
      }
    } catch (e) {
      process.stdout.write('x');
    }
  }
  console.log(`\n✅ ${updated}/${COVERS_MAL.length} capas atualizadas para MAL CDN`);

  // Verifica total
  const total = await pool.query('SELECT COUNT(*) FROM anime WHERE cover_url LIKE $1', ['%myanimelist%']);
  console.log(`📸 Animes com capa MAL: ${total.rows[0].count}`);
  await pool.end();
}

run().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
