const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { authenticate } = require('../middleware/auth');

// 太空任务相关路由
router.get('/', missionController.getAllMissions);
router.get('/:id', missionController.getMissionById);
router.get('/category/:category', missionController.getMissionsByCategory);
router.post('/', authenticate, missionController.createMission);
router.put('/:id', authenticate, missionController.updateMission);
router.delete('/:id', authenticate, missionController.deleteMission);
router.get('/search/:keyword', missionController.searchMissions);
router.get('/popular/top', missionController.getTopPopularMissions);

// 添加特色任务路由，与前端API客户端匹配
router.get('/featured', missionController.getTopPopularMissions);

// 添加获取任务类别路由
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

module.exports = router;