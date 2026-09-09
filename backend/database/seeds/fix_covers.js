/**
 * Atualiza as capas dos animes com URLs corretas do AniList
 */
const { Pool } = require('pg');

const NEON_URL = 'postgresql://neondb_owner:npg_7wXLYIo9ypHi@ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const pool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });

// URLs corretas verificadas manualmente
const COVERS = [
  { slug: 'solo-leveling',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166240-R9SbHwvwxCPk.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/166240-BtBjC3RWjqMP.jpg' },
  { slug: 'shingeki-no-kyojin',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buHPXR5Kndgn.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg' },
  { slug: 'jujutsu-kaisen',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFSCH.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-9YRWuUcGfFBl.jpg' },
  { slug: 'kimetsu-no-yaiba',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93blC.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-HwgZMFbkNSAF.jpg' },
  { slug: 'one-piece',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YcaibkFKreSwR.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg' },
  { slug: 'chainsaw-man',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130010-JFwFqCAJJCBn.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/130010-TuS3vAZ5Mv7e.jpg' },
  { slug: 'fullmetal-alchemist-brotherhood',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTQz9AITlTU.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-qTJBJk1bGnAE.jpg' },
  { slug: 'boku-no-hero-academia',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx31964-9V3BDMW8CQNJ.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/31964-etzdSBt2tZEE.jpg' },
  { slug: 'death-note',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-lawCwhHMCLpQ.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535-HGJrlUbm84sC.jpg' },
  { slug: 'steins-gate',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-SjPSMEDxkTQZ.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/9253-G5gM2CRmGdBl.jpg' },
  { slug: 'hunter-x-hunter-2011',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-KqAn0SHMQm5E.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11061-YEpPSFUOaYnS.jpg' },
  { slug: 'naruto',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-nQ8gWLSMJlcl.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/20-3eTfKGRZz8gg.jpg' },
  { slug: 'sword-art-online',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11757-KsGESl0VZpIG.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11757-I2oheKRovDaS.jpg' },
  { slug: 'bleach',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-LfBdWJdcCFXR.jpg',
    banner: null },
  { slug: 'tokyo-ghoul',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20605-ne6CRmFnZFWw.jpg',
    banner: null },
  { slug: 're-zero',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21355-WEgICgCpSwDL.jpg',
    banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-wFGOvsCZOSY5.jpg' },
  { slug: 'gintama',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx918-L1ATLhMXp3nJ.jpg',
    banner: null },
  { slug: 'mirai-nikki',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx10620-HCWqrG5MWQX0.jpg',
    banner: null },
];

async function run() {
  let updated = 0;
  for (const a of COVERS) {
    const r = await pool.query(
      'UPDATE anime SET cover_url=$1, banner_url=COALESCE($2,banner_url), updated_at=NOW() WHERE slug=$3 RETURNING title',
      [a.cover, a.banner, a.slug]
    );
    if (r.rows[0]) {
      console.log(`  ✅ ${r.rows[0].title}`);
      updated++;
    } else {
      console.log(`  ⚠️  slug não encontrado: ${a.slug}`);
    }
  }
  console.log(`\nTotal atualizado: ${updated}/${COVERS.length}`);
  await pool.end();
}

run().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
