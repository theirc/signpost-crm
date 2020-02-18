const express = require('express');
const authRoutes = require('./auth/routes');
const sessionRoutes = require('./sessions/routes');
const taskRoutes = require('./tasks/routes');

const router = express.Router();
const verifyToken = require('./middleware/auth');

router.get('/status', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/sessions', sessionRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;