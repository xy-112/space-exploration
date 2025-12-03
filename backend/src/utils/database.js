const mongoose = require('mongoose');

/**
 * 连接 MongoDB 数据库
 * 添加详细的连接日志和监控
 */
const connectDB = async () => {
  try {
    console.log('='.repeat(60));
    console.log('[数据库] 开始连接 MongoDB Atlas 数据库');
    console.log('='.repeat(60));
    
    // 显示连接字符串（隐藏密码）
    const maskedURI = process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/\/\/.*?:.*?@/, '//***:***@') : 
      '未设置';
    
    console.log('[连接] 连接字符串:', maskedURI);
    console.log('[环境] 环境变量:', process.env.NODE_ENV || 'development');
    console.log('[超时] 超时设置: 10秒');
    
    if (!process.env.MONGODB_URI) {
      console.error('[错误] MONGODB_URI 环境变量未设置');
      console.error('[提示] 请在 .env 文件中设置 MONGODB_URI');
      process.exit(1);
    }
    
    // 连接配置选项
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    console.log('[配置] 连接配置:', JSON.stringify(options, null, 2));
    console.log('[状态] 正在建立连接...');
    
    // 执行连接
    const startTime = Date.now();
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    const endTime = Date.now();
    
    // 连接成功后的详细信息
    console.log('\n' + '='.repeat(40));
    console.log('[成功] MongoDB Atlas 连接成功！');
    console.log('='.repeat(40));
    console.log('[详情] 连接详情:');
    console.log('   主机地址:', conn.connection.host);
    console.log('   端口号:', conn.connection.port);
    console.log('   数据库名:', conn.connection.name);
    console.log('   连接状态:', getConnectionState(conn.connection.readyState));
    console.log('   连接耗时:', (endTime - startTime) + 'ms');
    console.log('   驱动版本:', mongoose.version);
    
    // 获取并显示数据库统计信息
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('[集合] 数据库集合 (' + collections.length + ' 个):');
      collections.forEach((collection, index) => {
        console.log(`   ${index + 1}. ${collection.name}`);
      });
    } catch (statsError) {
      console.log('[警告] 无法获取集合列表:', statsError.message);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('[就绪] 数据库连接就绪，准备接收请求');
    console.log('='.repeat(60) + '\n');
    
    // 设置连接事件监听器
    mongoose.connection.on('connected', () => {
      console.log('[事件] Mongoose 已连接到数据库');
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('[事件] Mongoose 连接断开');
    });
    
    return conn;
    
  } catch (error) {
    console.error('\n' + '='.repeat(40));
    console.error('[失败] MongoDB 连接失败！');
    console.error('='.repeat(40));
    console.error('[错误] 错误类型:', error.name);
    console.error('[信息] 错误信息:', error.message);
    
    // 提供具体的解决建议
    if (error.message.includes('querySrv ENOTFOUND')) {
      console.error('[建议] SRV 记录解析失败，请检查网络或使用非SRV连接字符串');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('[建议] 认证失败，请检查用户名和密码');
    } else if (error.message.includes('timeout')) {
      console.error('[建议] 连接超时，请检查网络或增加超时时间');
    }
    
    console.error('\n' + '='.repeat(60));
    process.exit(1);
  }
};

/**
 * 转换连接状态为可读文本
 */
function getConnectionState(state) {
  const states = {
    0: '[已断开]',
    1: '[已连接]',
    2: '[连接中]',
    3: '[断开中]',
  };
  return states[state] || `[未知状态 (${state})]`;
}

module.exports = { connectDB };