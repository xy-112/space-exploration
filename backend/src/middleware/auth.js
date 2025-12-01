const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 验证JWT令牌
const authenticate = async (req, res, next) => {
  try {
    // 从Header、Cookie或查询参数中获取令牌
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.query.token) {
      token = req.query.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: '请先登录以访问此资源'
      });
    }
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 获取用户信息
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户不存在或已被删除'
      });
    }
    
    // 检查用户是否被禁用
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: '账户已被禁用'
      });
    }
    
    // 将用户信息附加到请求对象
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: '无效的令牌'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: '令牌已过期，请重新登录'
      });
    }
    
    res.status(500).json({
      success: false,
      error: '身份验证失败'
    });
  }
};

// 管理员权限检查
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: '您没有权限执行此操作'
      });
    }
    next();
  };
};

// 限流中间件（可选）
const rateLimitMiddleware = (req, res, next) => {
  // 这里可以添加具体的限流逻辑
  // 例如：检查IP地址、用户ID等
  next();
};

module.exports = {
  authenticate,
  authorize,
  rateLimitMiddleware
};