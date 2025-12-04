const Mission = require('../models/Mission');

// 获取所有太空任务
exports.getAllMissions = async (req, res, next) => {
  try {
    const missions = await Mission.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    next(error);
  }
};

// 根据ID获取太空任务
exports.getMissionById = async (req, res, next) => {
  try {
    // 使用missionId字段，而不是_id
    const missionId = parseInt(req.params.id);
    const mission = await Mission.findOne({ missionId });
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: '未找到该太空任务'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    next(error);
  }
};

// 根据分类获取太空任务
exports.getMissionsByCategory = async (req, res, next) => {
  try {
    const missions = await Mission.find({
      category: req.params.category
    })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    next(error);
  }
};

// 创建太空任务
exports.createMission = async (req, res, next) => {
  try {
    const mission = await Mission.create(req.body);
    
    res.status(201).json({
      success: true,
      data: mission
    });
  } catch (error) {
    next(error);
  }
};

// 更新太空任务
exports.updateMission = async (req, res, next) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: '未找到该太空任务'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    next(error);
  }
};

// 删除太空任务
exports.deleteMission = async (req, res, next) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: '未找到该太空任务'
      });
    }
    
    res.status(200).json({
      success: true,
      message: '太空任务已成功删除'
    });
  } catch (error) {
    next(error);
  }
};

// 搜索太空任务
exports.searchMissions = async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    const missions = await Mission.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    next(error);
  }
};

// 获取最受欢迎的太空任务
exports.getTopPopularMissions = async (req, res, next) => {
  try {
    const missions = await Mission.find()
      .sort({ views: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    next(error);
  }
};

// 收藏/取消收藏任务
exports.toggleFavorite = async (req, res, next) => {
  try {
    // 将字符串ID转换为数字类型，因为前端使用的是数字ID
    const missionId = parseInt(req.params.id);
    const userId = req.user._id;
    
    // 更新用户收藏
    const User = require('../models/User');
    const Mission = require('../models/Mission');
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 检查任务是否已收藏 - 使用数字比较
    const isFavorited = user.favorites.includes(missionId);
    
    // 查找对应的任务，更新popularity.favorites计数
    const mission = await Mission.findOne({ missionId });
    
    if (mission) {
      if (isFavorited) {
        // 取消收藏 - 减少任务的收藏计数
        if (mission.popularity.favorites > 0) {
          mission.popularity.favorites--;
        }
      } else {
        // 添加收藏 - 增加任务的收藏计数
        mission.popularity.favorites++;
      }
      await mission.save();
    }
    
    if (isFavorited) {
      // 取消收藏 - 使用数字比较
      user.favorites = user.favorites.filter(id => id !== missionId);
    } else {
      // 添加收藏 - 存储为数字
      user.favorites.push(missionId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: isFavorited ? '已取消收藏' : '已收藏',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites
      }
    });
  } catch (error) {
    console.error('收藏/取消收藏错误:', error);
    res.status(500).json({
      success: false,
      error: '操作失败，请稍后重试'
    });
  }
};

// 获取用户收藏的任务
exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 获取用户信息
    const user = await require('../models/User').findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 因为favorites是数字ID数组，需要查询missionId字段，而不是_id
    const Mission = require('../models/Mission');
    const favoriteMissions = await Mission.find({
      // 使用数字ID直接查询missionId字段
      missionId: { $in: user.favorites }
    });
    
    res.status(200).json({
      success: true,
      favorites: favoriteMissions
    });
  } catch (error) {
    console.error('获取收藏任务错误:', error);
    res.status(500).json({
      success: false,
      error: '获取收藏任务失败，请稍后重试'
    });
  }
};