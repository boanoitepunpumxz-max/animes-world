/**
 * Verifica e remove duplicados do catálogo
 */
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

  // 1. Situação atual
  const total = await db.query('SELECT COUNT(*) FROM anime');
  const dups  = await db.query(`
    SELECT external_id, COUNT(*) as cnt
    FROM anime WHERE external_id IS NOT NULL
    GROUP BY external_id HAVING COUNT(*) > 1
  `);
  const noCover = await db.query(`
    SELECT COUNT(*) FROM anime WHERE cover_url IS NULL OR cover_url = ''
  `);
  const dupSlugs = await db.query(`
    SELECT slug, COUNT(*) FROM anime GROUP BY slug HAVING COUNT(*) > 1
  `);

  console.log('='.repeat(50));
  console.log('Estado do catálogo:');
  console.log('  Total animes:         ', total.rows[0].count);
  console.log('  external_id duplicado:', dups.rows.length);
  console.log('  Slugs duplicados:     ', dupSlugs.rows.length);
  console.log('  Sem capa:             ', noCover.rows[0].count);
  console.log('='.repeat(50));

  let removed = 0;

  // 2. Remove duplicados por external_id (mantém o que tem cover_url, senão o mais antigo)
  if (dups.rows.length > 0) {
    console.log('\nRemovendo duplicados por external_id...');
    for (const dup of dups.rows) {
      // Pega todos os registros com esse external_id, ordenados: com capa primeiro
      const all = await db.query(
        `SELECT id, cover_url, created_at FROM anime WHERE external_id = $1
         ORDER BY (cover_url IS NOT NULL AND cover_url != '') DESC, created_at ASC`,
        [dup.external_id]
      );

      // O primeiro é o melhor (tem capa ou é o mais antigo)
      const keepId = all.rows[0].id;
      const removeIds = all.rows.slice(1).map(r => r.id);

      for (const rmId of removeIds) {
        // Migra dados relacionados para o registro que fica
        await db.query('UPDATE favorites       SET anime_id=$1 WHERE anime_id=$2', [keepId, rmId]);
        await db.query('UPDATE watchlist        SET anime_id=$1 WHERE anime_id=$2', [keepId, rmId]);
        await db.query('UPDATE watch_history    SET anime_id=$1 WHERE anime_id=$2', [keepId, rmId]);
        await db.query('UPDATE watch_progress   SET anime_id=$1 WHERE anime_id=$2', [keepId, rmId]);
        await db.query('UPDATE anime_genres     SET anime_id=$1 WHERE anime_id=$2 ON CONFLICT DO NOTHING', [keepId, rmId]);
        await db.query('UPDATE seasons          SET anime_id=$1 WHERE anime_id=$2 ON CONFLICT DO NOTHING', [keepId, rmId]);
        await db.query('UPDATE episodes         SET anime_id=$1 WHERE anime_id=$2', [keepId, rmId]);

        // Remove o duplicado
        await db.query('DELETE FROM anime WHERE id=$1', [rmId]);
        removed++;
        process.stdout.write('.');
      }
    }
    console.log(`\n  Removidos: ${removed}`);
  }

  // 3. Remove animes sem capa E sem episódios cadastrados
  const orphans = await db.query(`
    SELECT a.id FROM anime a
    WHERE (a.cover_url IS NULL OR a.cover_url = '')
    AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id = a.id)
    AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id = a.id)
    AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id = a.id)
  `);

  let removedNoCover = 0;
  if (orphans.rows.length > 0) {
    console.log(`\nRemovendo ${orphans.rows.length} animes sem capa e sem dados...`);
    for (const o of orphans.rows) {
      await db.query('DELETE FROM anime_genres WHERE anime_id=$1', [o.id]);
      await db.query('DELETE FROM seasons WHERE anime_id=$1', [o.id]);
      await db.query('DELETE FROM anime WHERE id=$1', [o.id]);
      removedNoCover++;
    }
    console.log(`  Removidos sem capa: ${removedNoCover}`);
  }

  // 4. Situação final
  const finalTotal = await db.query('SELECT COUNT(*) FROM anime');
  const finalDups  = await db.query(`
    SELECT COUNT(*) FROM (
      SELECT external_id FROM anime WHERE external_id IS NOT NULL
      GROUP BY external_id HAVING COUNT(*) > 1
    ) x
  `);
  const finalNoCover = await db.query(
    'SELECT COUNT(*) FROM anime WHERE cover_url IS NULL OR cover_url = \'\''
  );

  console.log('\n' + '='.repeat(50));
  console.log('RESULTADO FINAL:');
  console.log('  Total animes:         ', finalTotal.rows[0].count);
  console.log('  Duplicados restantes: ', finalDups.rows[0].count);
  console.log('  Sem capa restantes:   ', finalNoCover.rows[0].count);
  console.log('  Removidos duplicados: ', removed);
  console.log('  Removidos sem capa:   ', removedNoCover);
  console.log('='.repeat(50));

  await db.end();
  process.exit(0);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
