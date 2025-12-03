const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// 保存知识挑战成绩（需要认证）
router.post('/save-score', auth, quizController.saveQuizScore);

// 获取知识挑战统计数据（需要认证）
router.get('/stats', auth, quizController.getQuizStats);

module.exports = router;