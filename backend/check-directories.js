const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('📁 检查宇宙探索项目目录结构');
console.log('='.repeat(60));

const baseDir = __dirname;
console.log('当前工作目录:', baseDir);
console.log('');

// 需要检查的目录列表
const directories = [
  'public',
  'public/my-site',
  'src',
  'src/utils',
  'src/controllers',
  'src/routes',
  'src/models',
  'node_modules'
];

console.log('🔍 目录结构检查:');
console.log('');

let missingDirs = [];
let existingDirs = [];

directories.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    existingDirs.push(dir);
    console.log(`  ✅ ${dir}`);
    
    // 如果是重要目录，显示里面的内容
    if (dir === 'public' || dir === 'src') {
      try {
        const items = fs.readdirSync(fullPath);
        console.log(`     包含: ${items.join(', ')}`);
      } catch (err) {
        console.log(`     无法读取内容`);
      }
    }
  } else {
    missingDirs.push(dir);
    console.log(`  ❌ ${dir}`);
  }
});

console.log('\n📄 重要文件检查:');
console.log('');

const importantFiles = [
  'src/server.js',
  'src/utils/database.js',
  'package.json',
  '.env',
  '.gitignore'
];

importantFiles.forEach(file => {
  const fullPath = path.join(baseDir, file);
  const exists = fs.existsSync(fullPath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 特别检查前端文件
console.log('\n🌐 前端文件检查:');
const frontendPath = path.join(baseDir, 'public', 'my-site');
if (fs.existsSync(frontendPath)) {
  console.log(`  ✅ 前端目录存在: public/my-site`);
  
  try {
    const files = fs.readdirSync(frontendPath);
    console.log(`     找到 ${files.length} 个文件:`);
    
    files.forEach(file => {
      const filePath = path.join(frontendPath, file);
      try {
        const stats = fs.statSync(filePath);
        const size = stats.size;
        const type = stats.isDirectory() ? '[目录]' : '[文件]';
        console.log(`     ${type} ${file} (${size} 字节)`);
      } catch (err) {
        console.log(`     [?] ${file}`);
      }
    });
    
    // 检查是否有 index.html
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log(`  ✅ 找到 index.html (前端入口文件)`);
    } else {
      console.log(`  ❌ 缺少 index.html 文件`);
    }
    
  } catch (err) {
    console.log(`  ❌ 无法读取前端目录内容: ${err.message}`);
  }
} else {
  console.log(`  ❌ 前端目录不存在: public/my-site`);
  console.log(`  💡 建议: 从前端项目构建或复制文件到此目录`);
}

// 数据库连接测试
console.log('\n🗄️  数据库环境检查:');
try {
  const envPath = path.join(baseDir, '.env');
  if (fs.existsSync(envPath)) {
    console.log(`  ✅ 找到 .env 文件`);
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasMongoURI = envContent.includes('MONGODB_URI');
    const hasPort = envContent.includes('PORT');
    
    console.log(`     ${hasMongoURI ? '✅' : '❌'} MONGODB_URI 配置`);
    console.log(`     ${hasPort ? '✅' : '❌'} PORT 配置`);
    
    if (hasMongoURI) {
      // 提取MongoDB URI（隐藏密码）
      const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
      if (mongoMatch) {
        const uri = mongoMatch[1];
        const maskedURI = uri.replace(/\/\/.*?:.*?@/, '//***:***@');
        console.log(`     连接字符串: ${maskedURI}`);
      }
    }
  } else {
    console.log(`  ❌ 缺少 .env 文件`);
    console.log(`  💡 建议: 复制 .env.example 创建 .env 文件`);
  }
} catch (err) {
  console.log(`  ❌ 检查环境文件时出错: ${err.message}`);
}

console.log('\n' + '='.repeat(60));
console.log('📊 检查总结:');
console.log(`   存在的目录: ${existingDirs.length}/${directories.length}`);
console.log(`   缺失的目录: ${missingDirs.length}`);
if (missingDirs.length > 0) {
  console.log(`   缺失的目录包括: ${missingDirs.join(', ')}`);
}

console.log('\n💡 建议:');
if (missingDirs.includes('public/my-site')) {
  console.log('   1. 创建前端目录: mkdir -p public/my-site');
  console.log('   2. 从前端项目构建或复制文件');
}

if (!fs.existsSync(path.join(baseDir, '.env'))) {
  console.log('   1. 创建 .env 文件并配置数据库连接');
}

console.log('='.repeat(60));