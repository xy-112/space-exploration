const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB连接成功: ${conn.connection.host}`);
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB连接错误:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB连接断开');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };