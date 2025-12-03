const fs = require('fs');
const path = require('path');

console.log('诊断前端访问问题...\n');

const frontendPath = 'D:\\\\网页搭建\\\\space-exploration\\\\public\\\\my-site';
console.log('前端路径:', frontendPath);
console.log('是否存在:', fs.existsSync(frontendPath));

if (fs.existsSync(frontendPath)) {
  console.log('\n目录内容:');
  const files = fs.readdirSync(frontendPath);
  files.forEach(file => {
    const filePath = path.join(frontendPath, file);
    const stats = fs.statSync(filePath);
    console.log(\  \ \\);
  });
  
  // 检查index.html
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('\n✅ index.html 存在，大小:', fs.statSync(indexPath).size, '字节');
    
    // 读取前几行内容
    const content = fs.readFileSync(indexPath, 'utf8').substring(0, 500);
    console.log('\n文件开头内容:');
    console.log(content);
  } else {
    console.log('\n❌ index.html 不存在');
  }
} else {
  console.log('\n❌ 前端目录不存在');
}
