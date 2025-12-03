const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const gameController = require('../controllers/gameController');

// 保存游戏成绩（需要认证）
router.post('/save-score', authenticate, gameController.saveGameScore);

// 获取游戏统计数据（需要认证）
router.get('/stats', authenticate, gameController.getGameStats);

module.exports = router;