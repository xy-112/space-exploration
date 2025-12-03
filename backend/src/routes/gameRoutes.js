const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const gameController = require('../controllers/gameController');

// 保存游戏成绩（需要认证）
router.post('/save-score', auth, gameController.saveGameScore);

// 获取游戏统计数据（需要认证）
router.get('/stats', auth, gameController.getGameStats);

module.exports = router;