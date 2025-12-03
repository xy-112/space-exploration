// server.js - 宇宙探索网站服务器（兼容开发和部署环境）
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== 中间件配置 ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS配置 - 使用官方cors包
const cors = require('cors');
app.use(cors({
  origin: '*',
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// ==================== 路径配置 ====================
// 判断运行环境
const isProduction = process.env.NODE_ENV === 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

let FRONTEND_PATH;

if (isProduction || isRailway) {
  // 生产环境：使用容器内绝对路径
  FRONTEND_PATH = '/app/public/my-site';
  console.log('🌐 运行环境: 生产环境 (Railway)');
} else {
  // 开发环境：使用相对路径
  FRONTEND_PATH = path.join(__dirname, '../../public/my-site');
  console.log('💻 运行环境: 本地开发');
}

// 可以用环境变量覆盖
if (process.env.FRONTEND_PATH) {
  FRONTEND_PATH = process.env.FRONTEND_PATH;
  console.log('🔧 使用环境变量中的路径');
}

console.log('📁 前端路径:', FRONTEND_PATH);

// ==================== 静态文件服务 ====================
if (fs.existsSync(FRONTEND_PATH)) {
  console.log('[状态] ✅ 前端目录存在');
  const files = fs.readdirSync(FRONTEND_PATH);
  console.log(`[信息] 包含 ${files.length} 个文件`);
  
  app.use(express.static(FRONTEND_PATH));
  console.log('✅ 静态文件服务已启用');
} else {
  console.error('[警告] ⚠️ 前端目录不存在，请检查路径');
  console.error('[路径]', FRONTEND_PATH);
}

// ==================== API路由 ====================
// 健康检查（Railway依赖这个进行健康检查）
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: '宇宙探索网站',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    frontend: fs.existsSync(FRONTEND_PATH),
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`
    }
  });
});

// 测试API
app.get('/api/test', (req, res) => {
  res.json({
    message: '服务器运行正常',
    path: FRONTEND_PATH,
    exists: fs.existsSync(FRONTEND_PATH),
    isProduction: isProduction,
    isRailway: isRailway
  });
});

// 启用所有API路由
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/missions', require('./routes/missionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));

// ==================== 前端路由 ====================
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const indexPath = path.join(FRONTEND_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // 如果找不到index.html，返回一个简单的页面
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>宇宙探索网站</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 50px; text-align: center; }
          h1 { color: #1a237e; }
          .status { 
            background: #f5f5f5; 
            padding: 20px; 
            border-radius: 10px;
            margin: 20px auto;
            max-width: 600px;
          }
        </style>
      </head>
      <body>
        <h1>🌌 宇宙探索网站</h1>
        <div class="status">
          <p>后端服务器运行正常！</p>
          <p>前端文件路径: ${FRONTEND_PATH}</p>
          <p>文件存在: ${fs.existsSync(indexPath) ? '是' : '否'}</p>
          <p><a href="/api/health">查看服务器状态</a></p>
        </div>
      </body>
      </html>
    `);
  }
});

// ==================== 错误处理 ====================
// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('[服务器错误]', err.stack);
  
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'production' 
      ? '请稍后重试' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// ==================== 数据库连接 ====================
const { connectDB } = require('./utils/database');

async function startServer() {
  try {
    // 连接数据库
    await connectDB();
    
    // ==================== 服务器启动 ====================
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 服务器启动成功！');
      console.log(`   端口: ${PORT}`);
      console.log(`   环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   前端访问: http://localhost:${PORT}`);
      console.log(`   健康检查: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();

module.exports = app;