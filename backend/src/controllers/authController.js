const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { validationResult } = require('express-validator');

// 用户注册
exports.register = async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { username, email, password, firstName, lastName } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: existingUser.email === email ? 
          '该邮箱已被注册' : 
          '该用户名已被使用'
      });
    }
    
    // 创建用户
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      verificationToken: crypto.randomBytes(32).toString('hex'),
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24小时
    });
    
    await user.save();
    
    // 生成令牌
    const token = user.generateAuthToken();
    
    // 发送验证邮件（生产环境中启用）
    if (process.env.NODE_ENV === 'production') {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${user.verificationToken}`;
      await sendEmail({
        email: user.email,
        subject: '验证您的邮箱 - 宇宙探索',
        template: 'verifyEmail',
        context: {
          username: user.username,
          verificationUrl
        }
      });
    }
    
    // 设置HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      sameSite: 'strict'
    });
    
    res.status(201).json({
      success: true,
      message: '注册成功！请检查您的邮箱以完成验证。',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        firstLetter: user.username.charAt(0).toUpperCase()
      }
    });
    
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      error: '注册失败，请稍后重试'
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    
    // 查找用户（包含密码字段）
    const user = await User.findOne({ 
      $or: [{ email: username }, { username }] 
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }
    
    // 更新最后登录时间
    user.lastLogin = Date.now();
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // 限制登录历史记录数量
    if (user.loginHistory.length > 10) {
      user.loginHistory.shift();
    }
    
    await user.save();
    
    // 生成令牌
    const token = user.generateAuthToken();
    
    // 设置Cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30天
    }
    
    res.cookie('token', token, cookieOptions);
    
    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        firstLetter: user.username.charAt(0).toUpperCase(),
        favorites: user.favorites,
        preferences: user.preferences,
        gameStats: user.gameStats
      }
    });
    
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试'
    });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      error: '获取用户信息失败'
    });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // 获取用户（包含密码字段）
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 验证当前密码
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: '当前密码不正确'
      });
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    // 发送密码修改通知邮件
    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: user.email,
        subject: '密码已修改 - 宇宙探索',
        template: 'passwordChanged',
        context: {
          username: user.username,
          timestamp: new Date().toLocaleString('zh-CN')
        }
      });
    }
    
    res.json({
      success: true,
      message: '密码修改成功'
    });
    
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      error: '修改密码失败'
    });
  }
};

// 退出登录
exports.logout = (req, res) => {
  res.clearCookie('token');
  
  res.json({
    success: true,
    message: '已退出登录'
  });
};

// 忘记密码
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // 出于安全考虑，即使邮箱不存在也返回成功
      return res.json({
        success: true,
        message: '如果邮箱存在，重置密码链接已发送'
      });
    }
    
    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1小时
    
    await user.save();
    
    // 发送重置密码邮件
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    if (process.env.NODE_ENV === 'production') {
      await sendEmail({
        email: user.email,
        subject: '重置您的密码 - 宇宙探索',
        template: 'resetPassword',
        context: {
          username: user.username,
          resetUrl,
          expiresIn: '1小时'
        }
      });
    }
    
    res.json({
      success: true,
      message: '重置密码链接已发送到您的邮箱'
    });
    
  } catch (error) {
    console.error('忘记密码错误:', error);
    res.status(500).json({
      success: false,
      error: '发送重置密码邮件失败'
    });
  }
};

// 重置密码
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // 哈希令牌
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // 查找用户并检查令牌是否有效
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: '重置令牌无效或已过期'
      });
    }
    
    // 更新密码
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: '密码重置成功，请使用新密码登录'
    });
    
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({
      success: false,
      error: '重置密码失败'
    });
  }
};

// 验证邮箱
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // 查找用户
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: '验证令牌无效或已过期'
      });
    }
    
    // 更新用户验证状态
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: '邮箱验证成功！'
    });
    
  } catch (error) {
    console.error('验证邮箱错误:', error);
    res.status(500).json({
      success: false,
      error: '邮箱验证失败'
    });
  }
};

// 刷新令牌
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: '未提供刷新令牌'
      });
    }
    
    // 验证刷新令牌
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 生成新访问令牌
    const newAccessToken = user.generateAuthToken();
    
    res.json({
      success: true,
      token: newAccessToken
    });
    
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(401).json({
      success: false,
      error: '无效的刷新令牌'
    });
  }
};