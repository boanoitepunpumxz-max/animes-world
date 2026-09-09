/**
 * Upload de avatar usando multer (armazena em base64 no banco)
 * Para produção com muitos usuários, substituir por S3/Cloudflare R2
 */
const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const { query } = require('../utils/db');
const { authenticateToken } = require('../middleware/auth');

// Armazena em memória para converter para base64
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato não permitido. Use JPG, PNG, WEBP ou GIF.'));
    }
  },
});

// POST /api/upload/avatar
router.post('/avatar', authenticateToken, (req, res, next) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Imagem muito grande. Máximo: 2MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });

    try {
      // Converte para base64 data URL para armazenar no banco
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      await query(
        `UPDATE users SET avatar_url=$1, avatar_type='upload', updated_at=NOW() WHERE id=$2`,
        [base64, req.user.id]
      );

      res.json({
        message: 'Avatar atualizado!',
        avatarUrl: base64,
      });
    } catch (dbErr) {
      next(dbErr);
    }
  });
});

module.exports = router;
