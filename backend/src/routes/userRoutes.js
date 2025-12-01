const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// 用户相关路由
router.get('/favorites', authenticate, userController.getFavorites);
router.post('/favorites', authenticate, userController.addFavorite);
router.delete('/favorites/:missionId', authenticate, userController.removeFavorite);
router.post('/favorites/toggle', authenticate, userController.toggleFavorite);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/game-stats', authenticate, userController.updateGameStats);
router.get('/leaderboard', userController.getLeaderboard);
router.delete('/account', authenticate, userController.deleteAccount);

module.exports = router;