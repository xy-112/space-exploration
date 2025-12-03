const User = require('../models/User');

// 保存知识挑战成绩
exports.saveQuizScore = async (req, res) => {
  try {
    const { score, totalQuestions } = req.body;
    const userId = req.user.id;
    
    // 获取用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 计算得分百分比
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    
    // 更新知识挑战统计数据
    user.quizStats.totalScore += score;
    user.quizStats.quizzesTaken += 1;
    user.quizStats.highScore = Math.max(user.quizStats.highScore, scorePercentage);
    user.quizStats.averageScore = Math.round(
      (user.quizStats.totalScore / user.quizStats.quizzesTaken)
    );
    
    // 添加成就
    if (user.quizStats.quizzesTaken === 1) {
      if (!user.quizStats.achievements.includes('first_quiz')) {
        user.quizStats.achievements.push('first_quiz');
      }
    }
    
    if (score === totalQuestions) {
      if (!user.quizStats.achievements.includes('perfect_score')) {
        user.quizStats.achievements.push('perfect_score');
      }
    }
    
    if (user.quizStats.quizzesTaken >= 10) {
      if (!user.quizStats.achievements.includes('quiz_master')) {
        user.quizStats.achievements.push('quiz_master');
      }
    }
    
    if (user.quizStats.highScore === 100 && user.quizStats.quizzesTaken >= 5) {
      if (!user.quizStats.achievements.includes('quiz_champion')) {
        user.quizStats.achievements.push('quiz_champion');
      }
    }
    
    // 保存更新
    await user.save();
    
    res.json({
      success: true,
      message: '知识挑战成绩保存成功',
      quizStats: user.quizStats
    });
  } catch (error) {
    console.error('保存知识挑战成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '保存知识挑战成绩失败'
    });
  }
};

// 获取知识挑战统计数据
exports.getQuizStats = async (req, res) => {
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
      quizStats: user.quizStats
    });
  } catch (error) {
    console.error('获取知识挑战统计数据错误:', error);
    res.status(500).json({
      success: false,
      message: '获取知识挑战统计数据失败'
    });
  }
};