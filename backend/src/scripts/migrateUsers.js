const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// 定义连接字符串
const TEST_DB_URI = process.env.MONGODB_URI.replace('space_exploration', 'test');
const MAIN_DB_URI = process.env.MONGODB_URI;

/**
 * 数据迁移脚本
 * 将test数据库中的用户数据迁移到space_exploration数据库
 */
async function migrateUsers() {
  let testConnection = null;
  let mainConnection = null;
  
  try {
    console.log('='.repeat(60));
    console.log('📦 开始数据迁移: test.users -> space_exploration.users');
    console.log('='.repeat(60));
    
    // 1. 连接到test数据库
    console.log('🔌 连接到test数据库...');
    testConnection = await mongoose.connect(TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ 成功连接到test数据库');
    
    // 2. 从test数据库读取所有用户
    console.log('📖 从test数据库读取用户数据...');
    const testUsers = await mongoose.connection.db.collection('users').find().toArray();
    console.log(`✅ 读取到 ${testUsers.length} 个用户`);
    
    if (testUsers.length === 0) {
      console.log('📭 test数据库中没有用户数据，迁移结束');
      process.exit(0);
    }
    
    // 3. 断开test数据库连接
    await mongoose.disconnect();
    console.log('🔌 已断开test数据库连接');
    
    // 4. 连接到main数据库
    console.log('🔌 连接到space_exploration数据库...');
    mainConnection = await mongoose.connect(MAIN_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ 成功连接到space_exploration数据库');
    
    // 5. 检查main数据库中已有的用户
    console.log('🔍 检查space_exploration数据库中的现有用户...');
    const existingUsers = await User.find({}, '_id username email');
    const existingUsernames = new Set(existingUsers.map(user => user.username));
    const existingEmails = new Set(existingUsers.map(user => user.email));
    
    // 6. 过滤掉已存在的用户，避免重复
    const usersToMigrate = testUsers.filter(user => {
      if (existingUsernames.has(user.username)) {
        console.log(`⚠️  跳过用户 ${user.username} (用户名已存在)`);
        return false;
      }
      if (existingEmails.has(user.email)) {
        console.log(`⚠️  跳过用户 ${user.email} (邮箱已存在)`);
        return false;
      }
      return true;
    });
    
    console.log(`📋 准备迁移 ${usersToMigrate.length} 个新用户`);
    
    if (usersToMigrate.length === 0) {
      console.log('📭 没有新用户需要迁移，迁移结束');
      process.exit(0);
    }
    
    // 7. 执行迁移
    console.log('🚀 开始迁移用户数据...');
    
    // 转换用户数据，删除_id字段以便MongoDB自动生成新的
    const usersToInsert = usersToMigrate.map(user => {
      const { _id, ...userData } = user;
      return userData;
    });
    
    // 批量插入用户数据
    const result = await User.insertMany(usersToInsert, {
      ordered: false // 跳过单个失败的插入，继续处理其他用户
    });
    
    console.log(`✅ 成功迁移 ${result.length} 个用户`);
    
    // 8. 断开main数据库连接
    await mongoose.disconnect();
    console.log('🔌 已断开space_exploration数据库连接');
    
    // 9. 显示迁移结果
    console.log('='.repeat(60));
    console.log('🎉 数据迁移完成!');
    console.log(`📊 总用户数: ${testUsers.length}`);
    console.log(`📤 迁移成功: ${result.length}`);
    console.log(`📥 已存在: ${testUsers.length - usersToMigrate.length}`);
    console.log(`❌ 迁移失败: ${usersToMigrate.length - result.length}`);
    console.log('='.repeat(60));
    
    process.exit(0);
    
  } catch (error) {
    console.error('='.repeat(60));
    console.error('❌ 数据迁移失败!');
    console.error('错误信息:', error.message);
    console.error('='.repeat(60));
    
    // 确保断开所有连接
    if (testConnection) {
      await mongoose.disconnect();
    }
    if (mainConnection) {
      await mongoose.disconnect();
    }
    
    process.exit(1);
  }
}

// 执行迁移
migrateUsers();
