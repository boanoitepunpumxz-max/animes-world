require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'animesworld',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const genres = [
  { name: 'Ação', slug: 'acao', icon: '⚔️' },
  { name: 'Aventura', slug: 'aventura', icon: '🗺️' },
  { name: 'Comédia', slug: 'comedia', icon: '😂' },
  { name: 'Drama', slug: 'drama', icon: '🎭' },
  { name: 'Fantasia', slug: 'fantasia', icon: '🔮' },
  { name: 'Romance', slug: 'romance', icon: '💕' },
  { name: 'Shounen', slug: 'shounen', icon: '👊' },
  { name: 'Shoujo', slug: 'shoujo', icon: '🌸' },
  { name: 'Seinen', slug: 'seinen', icon: '🔞' },
  { name: 'Isekai', slug: 'isekai', icon: '🌀' },
  { name: 'Terror', slug: 'terror', icon: '👻' },
  { name: 'Horror', slug: 'horror', icon: '😱' },
  { name: 'Mistério', slug: 'misterio', icon: '🔍' },
  { name: 'Sobrenatural', slug: 'sobrenatural', icon: '✨' },
  { name: 'Esportes', slug: 'esportes', icon: '⚽' },
  { name: 'Slice of Life', slug: 'slice-of-life', icon: '☕' },
  { name: 'Ficção Científica', slug: 'ficcao-cientifica', icon: '🚀' },
  { name: 'Escolar', slug: 'escolar', icon: '📚' },
  { name: 'Militar', slug: 'militar', icon: '🪖' },
  { name: 'Histórico', slug: 'historico', icon: '📜' },
  { name: 'Mecha', slug: 'mecha', icon: '🤖' },
  { name: 'Música', slug: 'musica', icon: '🎵' },
  { name: 'Psicológico', slug: 'psicologico', icon: '🧠' },
  { name: 'Superpoderes', slug: 'superpoderes', icon: '💥' },
];

async function runSeed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Iniciando seed...\n');

    // Gêneros
    console.log('  📂 Inserindo gêneros...');
    for (const genre of genres) {
      await client.query(
        `INSERT INTO genres (name, slug, icon) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING`,
        [genre.name, genre.slug, genre.icon]
      );
    }
    console.log(`  ✅ ${genres.length} gêneros inseridos\n`);

    // Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@animesworld.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminHash = await bcrypt.hash(adminPassword, 12);

    const adminResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ('admin', $1, $2, 'admin')
       ON CONFLICT (email) DO UPDATE SET role = 'admin'
       RETURNING id`,
      [adminEmail, adminHash]
    );
    const adminId = adminResult.rows[0].id;

    await client.query(
      `INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [adminId]
    );

    console.log(`  👑 Admin criado: ${adminEmail}`);
    console.log(`  🔑 Senha admin: ${adminPassword}\n`);

    console.log('✅ Seed concluído!');
    console.log('\n📌 Próximos passos:');
    console.log('   1. Acesse /admin com as credenciais acima');
    console.log('   2. Vá em Sincronização → Sincronizar Agora');
    console.log('   3. O catálogo será populado com dados reais da AniList API\n');
  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
