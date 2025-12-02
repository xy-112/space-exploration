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
    const mission = await Mission.findById(req.params.id);
    
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