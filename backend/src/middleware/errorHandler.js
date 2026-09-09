function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Erros do PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Este registro já existe.' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referência inválida.' });
  }

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Ocorreu um erro interno. Tente novamente.'
    : err.message;

  res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };
