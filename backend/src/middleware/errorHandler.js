// 全局错误处理中间件

const errorHandler = (err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // 默认错误状态码和消息
  let statusCode = 500;
  let errorMessage = '服务器内部错误';

  // 处理特定类型的错误
  if (err.name === 'CastError') {
    // MongoDB ObjectId 格式错误
    statusCode = 400;
    errorMessage = `无效的资源 ID: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    // Mongoose 验证错误
    statusCode = 400;
    errorMessage = Object.values(err.errors).map(error => error.message).join(', ');
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    // MongoDB 重复键错误
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    errorMessage = `${field} 已被占用`;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT 令牌错误
    statusCode = 401;
    errorMessage = '无效的令牌';
  } else if (err.name === 'TokenExpiredError') {
    // JWT 令牌过期
    statusCode = 401;
    errorMessage = '令牌已过期';
  } else if (err.statusCode) {
    // 自定义错误，包含状态码
    statusCode = err.statusCode;
    errorMessage = err.message;
  }

  // 生产环境下不返回详细错误信息
  if (process.env.NODE_ENV === 'production') {
    err.stack = undefined;
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;