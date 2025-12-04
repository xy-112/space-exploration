// API客户端 - 用于前端与后端通信
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL || ''; // 使用空字符串，让请求使用相对路径
    this.token = localStorage.getItem('auth_token');
  }
  
  // 设置认证令牌
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
  
  // 清除令牌
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
  
  // 获取请求头
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  // 处理响应
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || '请求失败');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  }
  
  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const defaultOptions = {
      headers: this.getHeaders(!options.public),
      credentials: 'include'
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      // 处理认证错误
      if (error.status === 401) {
        this.clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      throw error;
    }
  }
  
  // 用户认证
  auth = {
    // 注册
    register: async (userData) => {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        public: true
      });
    },
    
    // 登录
    login: async (credentials) => {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        public: true
      });
      
      if (data.success && data.token) {
        this.setToken(data.token);
        window.dispatchEvent(new CustomEvent('auth:login', { detail: data.user }));
      }
      
      return data;
    },
    
    // 退出登录
    logout: async () => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        this.clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    },
    
    // 获取当前用户信息
    getCurrentUser: async () => {
      return this.request('/auth/me');
    },
    
    // 修改密码
    changePassword: async (passwords) => {
      return this.request('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(passwords)
      });
    },
    
    // 忘记密码
    forgotPassword: async (email) => {
      return this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        public: true
      });
    },
    
    // 验证邮箱
    verifyEmail: async (token) => {
      return this.request(`/auth/verify-email/${token}`, {
        method: 'GET',
        public: true
      });
    }
  };
  
  // 用户管理
  users = {
    // 获取收藏
    getFavorites: async () => {
      return this.request('/users/favorites');
    },
    
    // 添加收藏
    addFavorite: async (mission) => {
      return this.request('/users/favorites', {
        method: 'POST',
        body: JSON.stringify(mission)
      });
    },
    
    // 移除收藏
    removeFavorite: async (missionId) => {
      return this.request(`/users/favorites/${missionId}`, {
        method: 'DELETE'
      });
    },
    
    // 切换收藏状态
    toggleFavorite: async (mission) => {
      return this.request('/users/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify(mission)
      });
    },
    
    // 更新个人资料
    updateProfile: async (profile) => {
      return this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
    },
    
    // 更新游戏数据
    updateGameStats: async (stats) => {
      return this.request('/users/game-stats', {
        method: 'PUT',
        body: JSON.stringify(stats)
      });
    },
    
    // 获取排行榜
    getLeaderboard: async (limit = 10, offset = 0) => {
      return this.request(`/users/leaderboard?limit=${limit}&offset=${offset}`);
    },
    
    // 删除账户
    deleteAccount: async (confirmPassword) => {
      return this.request('/users/account', {
        method: 'DELETE',
        body: JSON.stringify({ confirmPassword })
      });
    }
  };
  
  // 任务管理
  missions = {
    // 获取所有任务
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/missions${query ? `?${query}` : ''}`);
    },
    
    // 获取单个任务
    getById: async (missionId) => {
      return this.request(`/missions/${missionId}`);
    },
    
    // 获取特色任务
    getFeatured: async () => {
      return this.request('/missions/featured');
    },
    
    // 搜索任务
    search: async (query) => {
      return this.request(`/missions/search?q=${encodeURIComponent(query)}`);
    },
    
    // 获取任务类别
    getCategories: async () => {
      return this.request('/missions/categories');
    }
  };
  
  // 系统
  system = {
    // 健康检查
    health: async () => {
      return this.request('/health', { public: true });
    }
  };
}

// 创建全局API客户端实例
window.API = new APIClient();