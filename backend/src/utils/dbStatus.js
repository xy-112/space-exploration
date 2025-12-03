// utils/dbStatus.js
const mongoose = require('mongoose');

function checkDatabaseStatus() {
  const status = {
    state: mongoose.connection.readyState,
    stateText: getConnectionState(mongoose.connection.readyState),
    host: mongoose.connection.host || '未连接',
    port: mongoose.connection.port || '未连接',
    database: mongoose.connection.name || '未连接',
    models: Object.keys(mongoose.models).length,
    connected: mongoose.connection.readyState === 1,
  };
  
  return status;
}

function getConnectionState(state) {
  const states = {
    0: '已断开',
    1: '已连接',
    2: '连接中',
    3: '断开中',
  };
  return states[state] || `未知状态 (${state})`;
}

function printDatabaseStatus() {
  const status = checkDatabaseStatus();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 当前数据库状态');
  console.log('='.repeat(50));
  
  Object.entries(status).forEach(([key, value]) => {
    const icon = key === 'connected' ? (value ? '✅' : '❌') : '📝';
    console.log(`${icon} ${key}: ${value}`);
  });
  
  console.log('='.repeat(50));
  
  return status;
}

module.exports = { checkDatabaseStatus, printDatabaseStatus };