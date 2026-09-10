require('dotenv').config();
const app = require('./app');
const { testConnection, query } = require('./utils/db');
const { startSyncJob } = require('./jobs/syncJob');
const { startFixCoversJob } = require('./jobs/fixCoversJob');

const PORT = process.env.PORT || 3001;

// Cancela jobs que ficaram travados em 'running'/'pending' de execuções anteriores
async function cleanupStaleJobs() {
  try {
    const r = await query(
      `UPDATE import_jobs SET status='cancelled', finished_at=NOW()
       WHERE status IN ('running','pending') RETURNING id, job_type, provider`
    );
    if (r.rowCount > 0) {
      console.log(`🧹 ${r.rowCount} job(s) travado(s) cancelado(s) no startup`);
    }
  } catch (e) {
    console.warn('⚠️  Não foi possível limpar jobs travados:', e.message);
  }
}

async function start() {
  try {
    await testConnection();
    await cleanupStaleJobs();
    if (process.env.NODE_ENV !== 'test') {
      startSyncJob();
      startFixCoversJob();
    }
    app.listen(PORT, () => {
      console.log(`\n🚀 ANIMES WORLD v1.1 Backend rodando na porta ${PORT}`);
      console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   URL: http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar servidor:', err.message);
    process.exit(1);
  }
}

start();
