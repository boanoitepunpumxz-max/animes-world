const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');

router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, type, title, message, data, read, created_at
       FROM notifications WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
});

router.get('/unread-count', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false',
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) { next(err); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    await query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'ok' });
  } catch (err) { next(err); }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    await query(
      'UPDATE notifications SET read = true WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ message: 'ok' });
  } catch (err) { next(err); }
});

module.exports = router;
