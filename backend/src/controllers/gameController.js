const User = require('../models/User');

// 保存游戏成绩
exports.saveGameScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user.id;
    
    // 获取用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新游戏统计数据
    user.gameStats.totalScore += score;
    user.gameStats.gamesPlayed += 1;
    
    // 更新最高分
    if (score > user.gameStats.highScore) {
      user.gameStats.highScore = score;
    }
    
    // 添加成就
    if (user.gameStats.gamesPlayed === 1) {
      if (!user.gameStats.achievements.includes('first_game')) {
        user.gameStats.achievements.push('first_game');
      }
    }
    
    if (score >= 1000) {
      if (!user.gameStats.achievements.includes('score_1000')) {
        user.gameStats.achievements.push('score_1000');
      }
    }
    
    if (score >= 5000) {
      if (!user.gameStats.achievements.includes('score_5000')) {
        user.gameStats.achievements.push('score_5000');
      }
    }
    
    if (score >= 10000) {
      if (!user.gameStats.achievements.includes('score_10000')) {
        user.gameStats.achievements.push('score_10000');
      }
    }
    
    // 保存更新
    await user.save();
    
    res.json({
      success: true,
      message: '游戏成绩保存成功',
      gameStats: user.gameStats
    });
  } catch (error) {
    console.error('保存游戏成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '保存游戏成绩失败'
    });
  }
};

// 获取游戏统计数据
exports.getGameStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      gameStats: user.gameStats
    });
  } catch (error) {
    console.error('获取游戏统计数据错误:', error);
    res.status(500).json({
      success: false,
      message: '获取游戏统计数据失败'
    });
  }
};