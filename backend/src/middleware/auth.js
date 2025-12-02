const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 用户认证中间件
exports.authenticate = async (req, res, next) => {
  try {
    // 获取Authorization头
    const authHeader = req.header('Authorization');
    
    // 检查Authorization头是否存在
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: '未提供认证令牌，请登录'
      });
    }
    
    // 提取令牌
    const token = authHeader.replace('Bearer ', '');
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 根据解码的用户ID获取用户
    const user = await User.findById(decoded.userId).select('-password');
    
    // 检查用户是否存在
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户不存在，请重新登录'
      });
    }
    
    // 将用户信息添加到请求对象中
    req.user = user;
    req.token = token;
    
    // 继续下一个中间件或路由处理函数
    next();
  } catch (error) {
    // 处理令牌验证失败的情况
    res.status(401).json({
      success: false,
      error: '认证令牌无效，请重新登录'
    });
  }
};
