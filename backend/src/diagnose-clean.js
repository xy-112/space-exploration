const fs = require('fs');
const path = require('path');

console.log('🌍 宇宙探索网站诊断工具');
console.log('='.repeat(50));

// 使用正确的路径格式
const frontendPath = 'D:\\\\网页搭建\\\\space-exploration\\\\public\\\\my-site';
console.log('1. 检查前端路径...');
console.log('   路径:', frontendPath);
console.log('   存在:', fs.existsSync(frontendPath) ? '✅ 是' : '❌ 否');

if (fs.existsSync(frontendPath)) {
  console.log('\n2. 扫描目录内容...');
  const files = fs.readdirSync(frontendPath);
  console.log('   文件数量:', files.length);
  
  // 显示前10个文件
  files.slice(0, 10).forEach(file => {
    const filePath = path.join(frontendPath, file);
    const stats = fs.statSync(filePath);
    const type = stats.isDirectory() ? '[目录]' : '[文件]';
    const size = stats.isDirectory() ? '' : '(' + (stats.size/1024).toFixed(1) + 'KB)';
    console.log('   ' + type + ' ' + file + ' ' + size);
  });
  
  if (files.length > 10) {
    console.log('   ... 还有 ' + (files.length - 10) + ' 个文件');
  }
  
  // 检查index.html
  console.log('\n3. 检查主页面...');
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const size = fs.statSync(indexPath).size;
    console.log('   index.html:', '✅ 存在 (' + (size/1024).toFixed(1) + 'KB)');
    
    // 验证HTML结构
    const content = fs.readFileSync(indexPath, 'utf8');
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
      console.log('   HTML结构:', '✅ 有效');
    }
  } else {
    console.log('   index.html:', '❌ 不存在');
  }
} else {
  console.log('\n❌ 错误: 前端目录不存在');
  console.log('请检查以下可能性:');
  console.log('1. 路径是否正确: ' + frontendPath);
  console.log('2. 目录是否被移动或重命名');
  console.log('3. 权限问题');
}

console.log('\n' + '='.repeat(50));
console.log('诊断完成');
