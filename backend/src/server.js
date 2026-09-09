require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./utils/db');
const { startSyncJob } = require('./jobs/syncJob');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await testConnection();
    if (process.env.NODE_ENV !== 'test') {
      startSyncJob();
    }
    app.listen(PORT, () => {
      console.log(`\n🚀 ANIMES WORLD Backend rodando na porta ${PORT}`);
      console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   URL: http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar servidor:', err.message);
    process.exit(1);
  }
}

start();
