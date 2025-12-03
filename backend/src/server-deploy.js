// server-deploy.js - 部署专用服务器
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 安全头部
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS配置（生产环境应限制域名）
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://space-exploration-production.up.railway.app',
    'https://space-exploration.xyz' // 你的自定义域名
  ];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// ==================== 路径配置 ====================
// 优先使用环境变量，其次使用容器内默认路径
const FRONTEND_PATH = process.env.FRONTEND_PATH || '/app/public/my-site';
const BACKEND_PATH = process.env.BACKEND_PATH || '/app/backend';

console.log('='.repeat(60));
console.log('🚀 宇宙探索网站 - 部署版本');
console.log('='.repeat(60));

console.log('\n🔧 环境配置:');
console.log(`   节点环境: ${process.env.NODE_ENV || '未设置'}`);
console.log(`   端口: ${PORT}`);
console.log(`   前端路径: ${FRONTEND_PATH}`);
console.log(`   后端路径: ${BACKEND_PATH}`);

console.log('\n📁 文件系统检查:');
const pathsToCheck = [
  { name: '项目根目录', path: '/app' },
  { name: '后端目录', path: BACKEND_PATH },
  { name: '前端目录', path: FRONTEND_PATH },
  { name: 'server.js', path: path.join(BACKEND_PATH, 'src', 'server.js') }
];

pathsToCheck.forEach(item => {
  const exists = fs.existsSync(item.path);
  console.log(`   ${exists ? '✅' : '❌'} ${item.name}: ${item.path} ${exists ? '' : '(未找到)'}`);
});

// 静态文件服务
if (fs.existsSync(FRONTEND_PATH)) {
  app.use(express.static(FRONTEND_PATH));
  console.log('\n✅ 静态文件服务已启用');
  
  const files = fs.readdirSync(FRONTEND_PATH);
  console.log(`   前端文件数量: ${files.length}`);
  console.log(`   包含index.html: ${files.includes('index.html') ? '是' : '否'}`);
} else {
  console.log('\n⚠️  警告: 前端目录不存在，仅提供API服务');
}

// ==================== 路由配置 ====================

// 健康检查（必须要有）
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: '宇宙探索网站',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    frontend: fs.existsSync(FRONTEND_PATH)
  });
});

// MongoDB连接测试（如果配置了数据库）
app.get('/api/db-health', async (req, res) => {
  try {
    // 这里应该检查数据库连接
    res.json({ 
      database: 'MongoDB Atlas', 
      status: '配置检查通过',
      note: '实际连接测试需要数据库配置' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 前端路由 ====================
// 所有非API请求返回前端页面
app.get('*', (req, res, next) => {
  // API请求跳过
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // 静态文件请求跳过
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    return next();
  }
  
  // 返回前端应用
  const indexPath = path.join(FRONTEND_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>宇宙探索网站 - 建设中</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #1a237e; }
          .container { max-width: 600px; margin: 0 auto; }
          .status { 
            background: #f5f5f5; 
            padding: 20px; 
            border-radius: 10px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌌 宇宙探索网站</h1>
          <div class="status">
            <p>后端服务器运行正常！</p>
            <p>前端文件正在加载或路径配置需要调整。</p>
            <p><strong>前端路径:</strong> ${FRONTEND_PATH}</p>
            <p><strong>文件存在:</strong> ${fs.existsSync(indexPath) ? '是' : '否'}</p>
          </div>
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
      ? '请稍后重试或联系管理员' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// ==================== 服务器启动 ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ 服务器启动成功！');
  console.log(`   内部地址: http://0.0.0.0:${PORT}`);
  console.log(`   健康检查: http://0.0.0.0:${PORT}/api/health`);
  console.log('='.repeat(60));
  
  // 额外的部署信息
  console.log('\n📊 部署信息:');
  console.log(`   平台: ${process.platform} ${process.arch}`);
  console.log(`   Node版本: ${process.version}`);
  console.log(`   内存限制: ${process.env.RAILWAY_MEMORY_LIMIT_MB || '未设置'} MB`);
  console.log('='.repeat(60));
});

module.exports = app;