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

module.exports = router;