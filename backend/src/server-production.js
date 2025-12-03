// server-production.js - 生产环境专用服务器
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 生产环境静态文件路径
const FRONTEND_PATH = '/app/public/my-site';

console.log('='.repeat(60));
console.log('🚀 宇宙探索网站 - 生产环境启动');
console.log('端口:', PORT);
console.log('前端路径:', FRONTEND_PATH);
console.log('路径存在:', fs.existsSync(FRONTEND_PATH) ? '✅ 是' : '❌ 否');

// 静态文件服务
if (fs.existsSync(FRONTEND_PATH)) {
  app.use(express.static(FRONTEND_PATH));
  console.log('✅ 静态文件服务已启用');
} else {
  console.log('⚠️  警告: 前端目录不存在');
}

// 健康检查（Railway必需）
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: '宇宙探索网站',
    environment: 'production',
    timestamp: new Date().toISOString(),
    frontend: fs.existsSync(FRONTEND_PATH)
  });
});

// 所有非API请求返回前端页面
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  
  const indexPath = path.join(FRONTEND_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>宇宙探索网站</title></head>
      <body>
        <h1>🌌 宇宙探索网站</h1>
        <p>后端服务器运行正常，前端文件配置中...</p>
        <p><a href="/api/health">查看服务器状态</a></p>
      </body>
      </html>
    `);
  }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('✅ 服务器启动成功！');
  console.log('='.repeat(60));
});

module.exports = app;