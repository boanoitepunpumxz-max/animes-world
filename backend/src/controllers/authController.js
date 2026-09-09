const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../utils/db');
const { getClientIp } = require('../middleware/requestLogger');
const emailService = require('../services/emailService');

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function logLoginAttempt(email, ip, userAgent, success) {
  try {
    await query(
      `INSERT INTO login_attempts (email, ip_address, user_agent, success)
       VALUES ($1, $2, $3, $4)`,
      [email, ip, userAgent?.substring(0, 500), success]
    );
  } catch (_) {}
}

async function checkBruteForce(ip, email) {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const result = await query(
    `SELECT COUNT(*) FROM login_attempts
     WHERE (ip_address = $1 OR email = $2)
     AND success = false AND created_at > $3`,
    [ip, email, windowStart]
  );
  return parseInt(result.rows[0].count) >= 10;
}

// ─── POST /api/auth/register ─────────────────────────────────
async function register(req, res, next) {
  try {
    const { username, email, password, birthDate } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Verificar duplicatas
    const existing = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username]
    );
    if (existing.rows.length > 0) {
      const isEmail = existing.rows.some(r => r.email === email.toLowerCase());
      return res.status(409).json({
        error: isEmail ? 'Este e-mail já está em uso.' : 'Este nome de usuário já está em uso.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (username, email, password_hash, birth_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, avatar_url, created_at`,
      [username.trim(), email.toLowerCase().trim(), passwordHash, birthDate || null]
    );

    const user = result.rows[0];

    // Criar configurações padrão
    await query('INSERT INTO user_settings (user_id) VALUES ($1)', [user.id]);

    // Atualizar last_login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Log de acesso
    await query(
      `INSERT INTO access_logs (user_id, action, ip_address, user_agent, path, method, status_code)
       VALUES ($1, 'register', $2, $3, '/api/auth/register', 'POST', 201)`,
      [user.id, ip, userAgent?.substring(0, 500)]
    );

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Conta criada com sucesso!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    // Brute force check
    const blocked = await checkBruteForce(ip, email);
    if (blocked) {
      return res.status(429).json({
        error: 'Muitas tentativas de login. Aguarde 15 minutos.',
      });
    }

    const result = await query(
      'SELECT id, username, email, password_hash, role, status, avatar_url FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];
    if (!user) {
      await logLoginAttempt(email, ip, userAgent, false);
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Sua conta foi suspensa.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      await logLoginAttempt(email, ip, userAgent, false);
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // Sucesso
    await logLoginAttempt(email, ip, userAgent, true);
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Log de acesso
    await query(
      `INSERT INTO access_logs (user_id, action, ip_address, user_agent, path, method, status_code)
       VALUES ($1, 'login', $2, $3, '/api/auth/login', 'POST', 200)`,
      [user.id, ip, userAgent?.substring(0, 500)]
    );

    const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '7d');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn });

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/logout ────────────────────────────────────
async function logout(req, res, next) {
  try {
    const ip = getClientIp(req);
    if (req.user) {
      await query(
        `INSERT INTO access_logs (user_id, action, ip_address, path, method, status_code)
         VALUES ($1, 'logout', $2, '/api/auth/logout', 'POST', 200)`,
        [req.user.id, ip]
      );
    }
    res.json({ message: 'Logout realizado.' });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────
async function getMe(req, res, next) {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.email, u.role, u.avatar_url, u.bio,
              u.created_at, u.last_login_at,
              s.autoplay, s.continue_watching, s.default_quality,
              s.default_language, s.subtitles_enabled, s.theme
       FROM users u
       LEFT JOIN user_settings s ON s.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/forgot-password ──────────────────────────
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await query('SELECT id, username FROM users WHERE email = $1', [email.toLowerCase()]);

    // Responde igual mesmo que não exista (segurança)
    if (!result.rows[0]) {
      return res.json({ message: 'Se o e-mail existir, você receberá as instruções.' });
    }

    const user = result.rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas

    await query('UPDATE password_resets SET used = true WHERE user_id = $1', [user.id]);
    await query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    await emailService.sendPasswordReset(email, user.username, token);

    res.json({ message: 'Se o e-mail existir, você receberá as instruções.' });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/reset-password ───────────────────────────
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    const result = await query(
      `SELECT pr.user_id FROM password_resets pr
       WHERE pr.token = $1 AND pr.used = false AND pr.expires_at > NOW()`,
      [token]
    );

    if (!result.rows[0]) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const { user_id } = result.rows[0];
    const hash = await bcrypt.hash(password, 12);

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, user_id]);
    await query('UPDATE password_resets SET used = true WHERE token = $1', [token]);

    // Log
    const ip = getClientIp(req);
    await query(
      `INSERT INTO access_logs (user_id, action, ip_address, path, method, status_code)
       VALUES ($1, 'password_reset', $2, '/api/auth/reset-password', 'POST', 200)`,
      [user_id, ip]
    );

    res.json({ message: 'Senha alterada com sucesso. Faça login.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword };
