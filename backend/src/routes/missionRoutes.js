const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { authenticate } = require('../middleware/auth');

// 太空任务相关路由
router.get('/', missionController.getAllMissions);
router.get('/favorites', authenticate, missionController.getUserFavorites); // 移到/:id之前
router.get('/featured', missionController.getTopPopularMissions); // 移到/:id之前
router.get('/categories', async (req, res) => {
  try {
    // 获取所有唯一的任务类别
    const categories = await require('../models/Mission').distinct('category');
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取任务类别失败'
    });
  }
});
router.get('/category/:category', missionController.getMissionsByCategory);
router.get('/search/:keyword', missionController.searchMissions);
router.get('/popular/top', missionController.getTopPopularMissions);
router.get('/:id', missionController.getMissionById); // 移到所有特定路由之后
router.post('/', authenticate, missionController.createMission);
router.put('/:id', authenticate, missionController.updateMission);
router.delete('/:id', authenticate, missionController.deleteMission);

// 收藏/取消收藏任务
router.post('/favorite/:id', authenticate, missionController.toggleFavorite);

module.exports = router;