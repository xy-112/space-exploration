const User = require('../models/User');

// 获取用户收藏
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('favorites');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 按添加时间排序（最新的在前）
    const sortedFavorites = user.favorites.sort((a, b) => 
      new Date(b.addedAt) - new Date(a.addedAt)
    );
    
    res.json({
      success: true,
      count: sortedFavorites.length,
      favorites: sortedFavorites
    });
    
  } catch (error) {
    console.error('获取收藏错误:', error);
    res.status(500).json({
      success: false,
      error: '获取收藏失败'
    });
  }
};

// 添加收藏
exports.addFavorite = async (req, res) => {
  try {
    const { missionId, missionTitle, missionDescription, missionImage } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 检查是否已收藏
    const existingIndex = user.favorites.findIndex(fav => 
      fav.missionId === parseInt(missionId)
    );
    
    if (existingIndex >= 0) {
      return res.status(400).json({
        success: false,
        error: '该任务已在收藏夹中'
      });
    }
    
    // 添加收藏
    user.favorites.push({
      missionId: parseInt(missionId),
      missionTitle,
      missionDescription,
      missionImage,
      addedAt: new Date()
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: '已添加到收藏',
      favorites: user.favorites
    });
    
  } catch (error) {
    console.error('添加收藏错误:', error);
    res.status(500).json({
      success: false,
      error: '添加收藏失败'
    });
  }
};

// 移除收藏
exports.removeFavorite = async (req, res) => {
  try {
    const { missionId } = req.params;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 查找收藏索引
    const favoriteIndex = user.favorites.findIndex(fav => 
      fav.missionId === parseInt(missionId)
    );
    
    if (favoriteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '未找到该收藏'
      });
    }
    
    // 移除收藏
    user.favorites.splice(favoriteIndex, 1);
    await user.save();
    
    res.json({
      success: true,
      message: '已移除收藏',
      favorites: user.favorites
    });
    
  } catch (error) {
    console.error('移除收藏错误:', error);
    res.status(500).json({
      success: false,
      error: '移除收藏失败'
    });
  }
};

// 切换收藏状态
exports.toggleFavorite = async (req, res) => {
  try {
    const { missionId, missionTitle, missionDescription, missionImage } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 查找收藏索引
    const favoriteIndex = user.favorites.findIndex(fav => 
      fav.missionId === parseInt(missionId)
    );
    
    let message, isFavorite;
    
    if (favoriteIndex >= 0) {
      // 已收藏，执行移除
      user.favorites.splice(favoriteIndex, 1);
      message = '已取消收藏';
      isFavorite = false;
    } else {
      // 未收藏，执行添加
      user.favorites.push({
        missionId: parseInt(missionId),
        missionTitle,
        missionDescription,
        missionImage,
        addedAt: new Date()
      });
      message = '已添加到收藏';
      isFavorite = true;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message,
      isFavorite,
      favorites: user.favorites
    });
    
  } catch (error) {
    console.error('切换收藏错误:', error);
    res.status(500).json({
      success: false,
      error: '操作失败'
    });
  }
};

// 更新用户个人资料
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatar, preferences } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 更新字段
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: '个人资料已更新',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
    
  } catch (error) {
    console.error('更新个人资料错误:', error);
    res.status(500).json({
      success: false,
      error: '更新个人资料失败'
    });
  }
};

// 更新游戏数据
exports.updateGameStats = async (req, res) => {
  try {
    const { score, achievements } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 更新游戏数据
    user.gameStats.gamesPlayed += 1;
    user.gameStats.totalScore += score;
    
    if (score > user.gameStats.highScore) {
      user.gameStats.highScore = score;
    }
    
    // 添加新成就
    if (achievements && Array.isArray(achievements)) {
      achievements.forEach(achievement => {
        if (!user.gameStats.achievements.includes(achievement)) {
          user.gameStats.achievements.push(achievement);
        }
      });
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: '游戏数据已更新',
      gameStats: user.gameStats
    });
    
  } catch (error) {
    console.error('更新游戏数据错误:', error);
    res.status(500).json({
      success: false,
      error: '更新游戏数据失败'
    });
  }
};

// 获取用户排行榜
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const users = await User.find({})
      .select('username avatar gameStats')
      .sort({ 'gameStats.highScore': -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    const total = await User.countDocuments();
    
    res.json({
      success: true,
      total,
      count: users.length,
      leaderboard: users.map(user => ({
        username: user.username,
        avatar: user.avatar,
        highScore: user.gameStats.highScore,
        totalScore: user.gameStats.totalScore,
        gamesPlayed: user.gameStats.gamesPlayed,
        achievements: user.gameStats.achievements.length
      }))
    });
    
  } catch (error) {
    console.error('获取排行榜错误:', error);
    res.status(500).json({
      success: false,
      error: '获取排行榜失败'
    });
  }
};

// 删除用户账户
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { confirmPassword } = req.body;
    
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(confirmPassword);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: '密码不正确'
      });
    }
    
    // 删除用户
    await User.findByIdAndDelete(userId);
    
    // 清除cookie
    res.clearCookie('token');
    
    res.json({
      success: true,
      message: '账户已成功删除'
    });
    
  } catch (error) {
    console.error('删除账户错误:', error);
    res.status(500).json({
      success: false,
      error: '删除账户失败'
    });
  }
};