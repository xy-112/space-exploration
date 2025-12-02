const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// 导入配置
const { connectDB } = require('./utils/database');
const errorHandler = require('./middleware/errorHandler');

// 导入路由
const authRoutes = require('./routes/authRoutes');
const missionRoutes = require('./routes/missionRoutes');
const userRoutes = require('./routes/userRoutes');

// 初始化应用
const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// 请求日志
app.use(morgan('combined'));

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 每个IP限制100个请求
});
app.use('/api/', limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务 - 使用简单路径，避免复杂相对路径计算
app.use(express.static('public/my-site'));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/users', userRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 前端路由处理 - 使用try-catch确保不会崩溃
app.get('*', (req, res) => {
  try {
    // 首先尝试直接使用相对路径
    res.sendFile('public/my-site/index.html', { root: '.' });
  } catch (error) {
    // 如果失败，返回简单的JSON响应，避免应用崩溃
    res.status(404).json({
      success: false,
      error: '无法找到页面' + error.message
    });
  }
});

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
      🚀 宇宙探索后端服务器已启动
      📡 端口: ${PORT}
      🌍 环境: ${process.env.NODE_ENV || 'development'}
      🗄️  数据库: ${process.env.MONGODB_URI ? '已连接' : '未配置'}
      `);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();
