const cron = require('node-cron');
const { syncAnimes } = require('../services/anilistService');

function startSyncJob() {
  // Sincroniza diariamente às 03:00 da manhã
  cron.schedule('0 3 * * *', async () => {
    console.log('🔄 [CRON] Iniciando sincronização automática AniList...');
    try {
      const result = await syncAnimes({ sort: ['UPDATED_AT_DESC'], perPage: 50 });
      console.log(`✅ [CRON] Sync concluído: +${result.added} | ~${result.updated} atualizados | ${result.errors} erros`);
    } catch (err) {
      console.error('❌ [CRON] Sync falhou:', err.message);
    }
  });

  // Sincronização de lançamentos recentes toda semana
  cron.schedule('0 6 * * 1', async () => {
    console.log('🔄 [CRON] Sync semanal de populares...');
    try {
      await syncAnimes({ sort: ['POPULARITY_DESC'], perPage: 50 });
    } catch (err) {
      console.error('❌ [CRON] Sync semanal falhou:', err.message);
    }
  });

  console.log('⏰ Jobs de sincronização agendados.');
}

module.exports = { startSyncJob };
