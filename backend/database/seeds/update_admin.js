/**
 * Atualiza as credenciais do admin principal
 */
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DB = {
  host: 'ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech',
  port: 5432, database: 'neondb',
  user: 'neondb_owner', password: 'npg_7wXLYIo9ypHi',
  ssl: { rejectUnauthorized: false },
};

async function main() {
  const db = new Client(DB);
  await db.connect();

  const email    = 'wispyourfacefoxy@animesworld.com';
  const password = 'betterannimesadmin34252@';
  const hash     = await bcrypt.hash(password, 12);

  // Atualiza TODOS os admins existentes para as novas credenciais
  const r = await db.query(
    `UPDATE users
     SET email = $1, password_hash = $2, username = 'admin', updated_at = NOW()
     WHERE role = 'admin'
     RETURNING id, email, username, role`,
    [email, hash]
  );

  if (r.rows.length === 0) {
    // Cria se não existir
    const ins = await db.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ('admin', $1, $2, 'admin')
       RETURNING id, email, username, role`,
      [email, hash]
    );
    await db.query('INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [ins.rows[0].id]);
    console.log('Admin criado:', ins.rows[0]);
  } else {
    console.log('Admin atualizado:', r.rows[0]);
  }

  // Garante que user_settings existe
  if (r.rows[0]) {
    await db.query('INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [r.rows[0].id]);
  }

  await db.end();
  console.log('\n✅ Credenciais atualizadas!');
  console.log('   E-mail:', email);
  console.log('   Senha:  [protegida]');
  process.exit(0);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
