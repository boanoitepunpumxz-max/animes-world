const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Rate limit específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
});

router.post('/register',
  authLimiter,
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username deve ter entre 3 e 50 caracteres.')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username só pode ter letras, números e _.'),
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
    body('password').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.')
      .matches(/[A-Za-z]/).withMessage('Senha deve conter letras.')
      .matches(/[0-9]/).withMessage('Senha deve conter números.'),
  ],
  validate,
  register
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
    body('password').notEmpty().withMessage('Senha obrigatória.'),
  ],
  validate,
  login
);

router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);

router.post('/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.')],
  validate,
  forgotPassword
);

router.post('/reset-password',
  authLimiter,
  [
    body('token').notEmpty().withMessage('Token obrigatório.'),
    body('password').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.'),
  ],
  validate,
  resetPassword
);

module.exports = router;
