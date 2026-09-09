const { Client } = require('pg');
const c = new Client({
  host: 'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_7wXLYIo9ypHi',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

c.connect().then(async () => {
  console.log('conectado');
  const r = await c.query(
    `INSERT INTO anime (external_id, slug, title, status, type, is_adult, popularity)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (external_id) DO UPDATE SET popularity = 0
     RETURNING id`,
    [88888, 'test-88888', 'Test Anime', 'FINISHED', 'TV', false, 0]
  );
  console.log('INSERT OK id=', r.rows[0].id);
  await c.query('DELETE FROM anime WHERE external_id = $1', [88888]);
  console.log('DELETE OK');
  await c.end();
  console.log('CONEXAO ENCERRADA');
  process.exit(0);
}).catch(e => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
