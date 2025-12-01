const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  missionId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, '任务标题不能超过200个字符']
  },
  
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, '简短描述不能超过500个字符']
  },
  
  image: {
    type: String,
    required: true
  },
  
  bannerImage: {
    type: String,
    default: null
  },
  
  category: {
    type: String,
    enum: ['mars', 'jupiter', 'saturn', 'moon', 'exoplanet', 'asteroid', 'space_station'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'completed', 'cancelled'],
    default: 'planning'
  },
  
  launchDate: {
    type: Date,
    default: null
  },
  
  estimatedCompletion: {
    type: Date,
    default: null
  },
  
  target: {
    type: String,
    trim: true
  },
  
  participatingAgencies: [{
    name: String,
    country: String,
    role: String
  }],
  
  crewSize: {
    type: Number,
    default: 0
  },
  
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    }
  },
  
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  objectives: [{
    type: String,
    trim: true
  }],
  
  challenges: [{
    type: String,
    trim: true
  }],
  
  scientificGoals: [{
    type: String,
    trim: true
  }],
  
  timeline: [{
    year: Number,
    event: String,
    description: String
  }],
  
  technologies: [{
    name: String,
    description: String
  }],
  
  images: [{
    url: String,
    caption: String,
    source: String
  }],
  
  videos: [{
    url: String,
    title: String,
    source: String
  }],
  
  documents: [{
    title: String,
    url: String,
    type: String
  }],
  
  statistics: {
    distance: {
      value: Number,
      unit: String,
      description: String
    },
    temperature: {
      min: Number,
      max: Number,
      unit: String
    },
    gravity: Number,
    atmosphericPressure: Number
  },
  
  popularity: {
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  metadata: {
    tags: [String],
    keywords: [String],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
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

// 索引
missionSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
missionSchema.index({ category: 1, status: 1 });
missionSchema.index({ featured: 1, popularity: -1 });

// 更新最后修改时间
missionSchema.pre('save', function(next) {
  this.metadata.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Mission', missionSchema);