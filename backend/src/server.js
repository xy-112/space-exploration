// 在 server.js 顶部
const path = require('path');
const fs = require('fs');

// 使用绝对路径
const ABSOLUTE_BASE_PATH = 'D:\\网页搭建\\space-exploration';
const FRONTEND_PATH = path.join(ABSOLUTE_BASE_PATH, 'public', 'my-site');

console.log('[配置] 项目基础路径:', ABSOLUTE_BASE_PATH);
console.log('[配置] 前端文件路径:', FRONTEND_PATH);

// 检查前端路径
if (fs.existsSync(FRONTEND_PATH)) {
  console.log('[状态] ✅ 前端目录存在');
  const files = fs.readdirSync(FRONTEND_PATH);
  console.log(`[信息] 包含 ${files.length} 个文件`);
  
  app.use(express.static(FRONTEND_PATH));
} else {
  console.error('[错误] ❌ 前端目录不存在，请检查路径');
  console.error('[路径]', FRONTEND_PATH);
}

// 前端路由
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const indexPath = path.join(FRONTEND_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next(); // 交给错误处理中间件
  }
});