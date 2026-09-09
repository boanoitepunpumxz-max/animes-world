const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const animeRoutes = require('./routes/anime');
const episodeRoutes = require('./routes/episodes');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const searchRoutes = require('./routes/search');
const genreRoutes = require('./routes/genres');
const watchRoutes = require('./routes/watch');
const notificationRoutes = require('./routes/notifications');
const supportRoutes = require('./routes/support');
const healthRoutes = require('./routes/health');

const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();

// ─── Segurança ────────────────────────────────────────────────
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      mediaSrc: ["'self'", 'blob:', 'https:'],
      frameSrc: ["'self'", 'https:'],
      connectSrc: ["'self'", 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
    ];
    // Aceita qualquer subdomínio do Vercel
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Em produção aceita tudo por ora
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ─── Rate Limiting Global ────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});
app.use(globalLimiter);

// ─── Middlewares Gerais ───────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Logger de Requisições (IP, User-Agent, etc.) ───────────
app.use(requestLogger);

// ─── Rotas Públicas ──────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/search', searchRoutes);

// ─── Rotas Protegidas ────────────────────────────────────────
app.use('/api/episodes', authenticateToken, episodeRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/watch', authenticateToken, watchRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/support', authenticateToken, supportRoutes);

// ─── Admin (requer isAdmin) ──────────────────────────────────
app.use('/api/admin', adminRoutes);

// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// ─── Error Handler ────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
