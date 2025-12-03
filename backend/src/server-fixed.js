// 创建在 backend 目录下的简单测试服务器
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// 使用绝对路径
const FRONTEND_PATH = 'D:\\网页搭建\\space-exploration\\public\\my-site';

console.log('='.repeat(60));
console.log('正在启动宇宙探索服务器...');
console.log('前端路径:', FRONTEND_PATH);
console.log('路径存在:', fs.existsSync(FRONTEND_PATH) ? '是' : '否');

if (fs.existsSync(FRONTEND_PATH)) {
  const files = fs.readdirSync(FRONTEND_PATH);
  console.log('前端文件数:', files.length);
  console.log('包含 index.html:', files.includes('index.html') ? '是' : '否');
  
  // 启用静态文件服务
  app.use(express.static(FRONTEND_PATH));
  
  // 所有非API请求返回前端页面
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
  });
  
} else {
  console.log('警告: 前端目录不存在，仅提供API服务');
}

// 简单的健康检查API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    frontend: fs.existsSync(FRONTEND_PATH)
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('服务器启动成功!');
  console.log('端口:', PORT);
  console.log('前端访问: http://localhost:' + PORT);
  console.log('API健康检查: http://localhost:' + PORT + '/api/health');
  console.log('='.repeat(60));
});