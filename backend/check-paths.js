const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('🔍 路径配置检查');
console.log('='.repeat(70));

// 当前工作目录
const currentDir = process.cwd();
console.log('当前工作目录:', currentDir);

// server.js 位置
const serverPath = path.join(currentDir, 'src', 'server.js');
console.log('server.js 路径:', serverPath);
console.log('server.js 存在:', fs.existsSync(serverPath) ? '✅' : '❌');

// 计算静态文件路径
const staticPaths = [
  {
    name: '从工作目录',
    path: path.join(currentDir, 'public', 'my-site')
  },
  {
    name: '从 server.js 位置',
    path: path.join(__dirname, '..', '..', 'public', 'my-site')
  },
  {
    name: '绝对路径',
    path: 'D:\\网页搭建\\space-exploration\\public\\my-site'
  }
];

console.log('\n📁 静态文件路径检查:');
staticPaths.forEach(item => {
  const exists = fs.existsSync(item.path);
  console.log(`  ${exists ? '✅' : '❌'} ${item.name}:`);
  console.log(`     路径: ${item.path}`);
  console.log(`     状态: ${exists ? '存在' : '不存在'}`);
  
  if (exists) {
    try {
      const files = fs.readdirSync(item.path);
      const htmlFiles = files.filter(f => f.endsWith('.html'));
      const hasIndex = files.includes('index.html');
      console.log(`     文件数量: ${files.length}`);
      console.log(`     HTML 文件: ${htmlFiles.length}`);
      console.log(`     index.html: ${hasIndex ? '✅ 存在' : '❌ 缺失'}`);
    } catch (err) {
      console.log(`     无法读取目录: ${err.message}`);
    }
  }
});

// 检查 .env 文件位置
const envPaths = [
  path.join(currentDir, '.env'),
  path.join(__dirname, '.env')
];

console.log('\n⚙️  环境文件检查:');
envPaths.forEach(envPath => {
  const exists = fs.existsSync(envPath);
  console.log(`  ${exists ? '✅' : '❌'} ${envPath}`);
});

console.log('\n💡 建议:');
console.log('   在 server.js 中使用绝对路径配置静态文件服务');
console.log('='.repeat(70));