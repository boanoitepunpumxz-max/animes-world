const { query } = require('../utils/db');

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    '0.0.0.0'
  );
}

async function requestLogger(req, res, next) {
  const ip = getClientIp(req);
  req.clientIp = ip;

  // Só loga rotas de API relevantes
  const shouldLog = req.path.startsWith('/api/auth') ||
                    req.path.startsWith('/api/admin') ||
                    req.path.startsWith('/api/user');

  if (!shouldLog) return next();

  const startTime = Date.now();

  res.on('finish', async () => {
    try {
      const duration = Date.now() - startTime;
      await query(
        `INSERT INTO access_logs (user_id, action, ip_address, user_agent, path, method, status_code, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          req.user?.id || null,
          req.path.split('/')[2] || 'unknown',
          ip,
          req.headers['user-agent']?.substring(0, 500) || null,
          req.path,
          req.method,
          res.statusCode,
          JSON.stringify({ duration_ms: duration, query: req.query }),
        ]
      );
    } catch (_) { /* não interrompe se o log falhar */ }
  });

  next();
}

module.exports = { requestLogger, getClientIp };
