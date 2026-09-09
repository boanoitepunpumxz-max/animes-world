const jwt = require('jsonwebtoken');
const { query } = require('../utils/db');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso obrigatório.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca usuário atualizado do banco
    const result = await query(
      'SELECT id, username, email, role, status, avatar_url FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (!result.rows[0]) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    
    const user = result.rows[0];
    
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Sua conta foi suspensa. Entre em contato com o suporte.' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    next(err);
  }
}

async function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  next();
}

async function requireModerator(req, res, next) {
  if (!req.user || !['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acesso restrito.' });
  }
  next();
}

// Opcional: não bloqueia, mas popula req.user se tiver token válido
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query(
        'SELECT id, username, email, role, status, avatar_url FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (result.rows[0] && result.rows[0].status !== 'banned') {
        req.user = result.rows[0];
      }
    }
  } catch (_) { /* ignora */ }
  next();
}

module.exports = { authenticateToken, requireAdmin, requireModerator, optionalAuth };
