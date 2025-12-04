const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少需要3个字符'],
    maxlength: [30, '用户名不能超过30个字符'],
    lowercase: true,
    index: true
  },
  
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
  },
  
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少需要6个字符'],
    select: false // 默认不返回密码字段
  },
  
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, '名字不能超过50个字符']
  },
  
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, '姓氏不能超过50个字符']
  },
  
  avatar: {
    type: String,
    default: null
  },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationToken: String,
  verificationExpires: Date,
  
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  favorites: {
    type: [
      {
        missionId: {
          type: Number,
          required: true
        },
        missionTitle: {
          type: String,
          required: true
        },
        missionDescription: {
          type: String,
          required: true
        },
        missionImage: {
          type: String,
          required: true
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  },
  
  gameStats: {
    totalScore: {
      type: Number,
      default: 0
    },
    highScore: {
      type: Number,
      default: 0
    },
    gamesPlayed: {
      type: Number,
      default: 0
    },
    achievements: [{
      type: String,
      enum: ['first_game', 'score_1000', 'score_5000', 'score_10000']
    }]
  },
  
  quizStats: {
    totalScore: {
      type: Number,
      default: 0
    },
    highScore: {
      type: Number,
      default: 0
    },
    quizzesTaken: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    achievements: [{
      type: String,
      enum: ['first_quiz', 'perfect_score', 'quiz_master', 'quiz_champion']
    }]
  },
  
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: false
    }
  },
  
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 更新时间戳中间件
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 生成JWT令牌的方法
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      userId: this._id,
      username: this.username,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// 获取用户简略信息（不包含敏感数据）
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.loginHistory;
  return user;
};

module.exports = mongoose.model('User', userSchema);