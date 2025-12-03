// 用户认证系统功能
console.log('=== 用户认证系统加载 ===');

// API配置 - 使用相对路径，适配不同部署环境
const API_BASE_URL = '/api';

// 辅助函数：处理API请求
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`发起API请求: ${method} ${url}`);
        console.log('请求数据:', data);
        
        // 从localStorage获取token
        const token = localStorage.getItem('token') || '';
        console.log('使用的token:', token);
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            credentials: 'include', // 发送Cookie
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        console.log('响应状态:', response.status);
        console.log('响应头:', response.headers);
        
        let responseData;
        try {
            responseData = await response.json();
            console.log('响应数据:', responseData);
        } catch (jsonError) {
            console.error('JSON解析错误:', jsonError);
            throw new Error('服务器返回了无效的JSON响应');
        }
        
        if (!response.ok) {
            // 处理不同类型的错误响应
            if (responseData.error) {
                // 单条错误信息
                throw new Error(responseData.error);
            } else if (responseData.errors && responseData.errors.length > 0) {
                // 多条错误信息，取第一条
                throw new Error(responseData.errors[0].msg);
            } else {
                // 其他错误
                throw new Error('API请求失败');
            }
        }
        
        return responseData;
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 认证管理器
const authManager = {
    // 当前登录用户
    currentUser: null,
    
    // 初始化认证系统
    init() {
        console.log('初始化用户认证系统...');
        
        // 检查本地存储中是否有登录用户
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            console.log('从本地存储恢复登录用户:', this.currentUser.username);
            this.updateUI();
        }
        
        // 绑定事件监听器
        this.bindEvents();
    },
    
    // 绑定事件监听器
    bindEvents() {
        console.log('绑定认证事件监听器...');
        
        // 登录按钮
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        
        // 注册按钮
        const signupBtn = document.getElementById('signup-btn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.showSignupModal());
        }
        
        // 登录表单提交
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }
        
        // 注册表单提交
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(e);
            });
        }
        
        // 修改密码表单提交
        const changePasswordForm = document.getElementById('change-password-form');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChangePassword(e);
            });
        }
        
        // 模态框切换
        const switchToSignup = document.getElementById('switch-to-signup');
        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideLoginModal();
                this.showSignupModal();
            });
        }
        
        const switchToLogin = document.getElementById('switch-to-login');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideSignupModal();
                this.showLoginModal();
            });
        }
        
        // 关闭模态框
        const closeLoginModal = document.getElementById('close-login-modal');
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => this.hideLoginModal());
        }
        
        const closeSignupModal = document.getElementById('close-signup-modal');
        if (closeSignupModal) {
            closeSignupModal.addEventListener('click', () => this.hideSignupModal());
        }
        
        const closeChangePasswordModal = document.getElementById('close-change-password-modal');
        if (closeChangePasswordModal) {
            closeChangePasswordModal.addEventListener('click', () => this.hideChangePasswordModal());
        }
        
        const closeFavoritesModal = document.getElementById('close-favorites-modal');
        if (closeFavoritesModal) {
            closeFavoritesModal.addEventListener('click', () => this.hideFavoritesModal());
        }
        
        // 点击模态框外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // 用户菜单事件
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => this.toggleUserMenu());
        }
        
        // 关闭用户菜单（点击外部）
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('user-menu');
            const dropdownMenu = document.getElementById('dropdown-menu');
            if (userMenu && dropdownMenu && !userMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
        
        // 用户菜单项点击事件
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfile();
            });
        }
        
        const favoritesBtn = document.getElementById('favorites-btn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFavorites();
            });
        }
        
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showChangePasswordModal();
            });
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // 密码强度检测
        const signupPassword = document.getElementById('signup-password');
        if (signupPassword) {
            signupPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }
        
        const newPassword = document.getElementById('new-password');
        if (newPassword) {
            newPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value, 'new-password'));
        }
        
        console.log('认证事件监听器绑定完成');
    },
    
    // 显示登录模态框
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('active');
            // 清空表单
            document.getElementById('login-form').reset();
            document.getElementById('login-error-alert').style.display = 'none';
        }
    },
    
    // 隐藏登录模态框
    hideLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // 显示注册模态框
    showSignupModal() {
        const modal = document.getElementById('signup-modal');
        if (modal) {
            modal.classList.add('active');
            // 清空表单
            document.getElementById('signup-form').reset();
            document.getElementById('signup-success-alert').style.display = 'none';
        }
    },
    
    // 隐藏注册模态框
    hideSignupModal() {
        const modal = document.getElementById('signup-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // 显示修改密码模态框
    showChangePasswordModal() {
        const modal = document.getElementById('change-password-modal');
        if (modal) {
            modal.classList.add('active');
            // 清空表单
            document.getElementById('change-password-form').reset();
            document.getElementById('change-password-success-alert').style.display = 'none';
            document.getElementById('change-password-error-alert').style.display = 'none';
        }
    },
    
    // 隐藏修改密码模态框
    hideChangePasswordModal() {
        const modal = document.getElementById('change-password-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // 显示收藏模态框
    showFavorites() {
        const modal = document.getElementById('favorites-modal');
        if (modal) {
            this.loadFavorites();
            modal.classList.add('active');
        }
    },
    
    // 隐藏收藏模态框
    hideFavoritesModal() {
        const modal = document.getElementById('favorites-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // 切换用户菜单
    toggleUserMenu() {
        const dropdownMenu = document.getElementById('dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('active');
        }
    },
    
    // 显示用户资料
    showProfile() {
        alert('个人资料功能开发中...');
    },
    
    // 检查密码强度
    checkPasswordStrength(password, prefix = 'signup') {
        let strength = 0;
        let strengthText = '弱';
        let strengthColor = '#f44336';
        
        // 密码长度检查
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // 包含数字检查
        if (/\d/.test(password)) strength++;
        
        // 包含字母检查
        if (/[a-zA-Z]/.test(password)) strength++;
        
        // 包含特殊字符检查
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        // 更新强度文本和颜色
        if (strength <= 2) {
            strengthText = '弱';
            strengthColor = '#f44336';
        } else if (strength <= 3) {
            strengthText = '中';
            strengthColor = '#ff9800';
        } else {
            strengthText = '强';
            strengthColor = '#4CAF50';
        }
        
        // 更新UI
        const strengthBar = document.getElementById(`${prefix}-password-strength-bar`);
        const strengthTextEl = document.getElementById(`${prefix}-password-strength-text`);
        
        if (strengthBar && strengthTextEl) {
            strengthBar.style.width = `${strength * 20}%`;
            strengthBar.style.backgroundColor = strengthColor;
            strengthTextEl.textContent = `密码强度：${strengthText}`;
            strengthTextEl.style.color = strengthColor;
        }
        
        return strength;
    },
    
    // 登录处理
    async handleLogin(e) {
        const form = e.target;
        const username = form.querySelector('#login-username').value;
        const password = form.querySelector('#login-password').value;
        const errorAlert = document.getElementById('login-error-alert');
        
        try {
            console.log('开始登录...');
            console.log('用户名:', username);
            console.log('API_BASE_URL:', API_BASE_URL);
            
            // 调用后端登录API
            const response = await apiRequest('/auth/login', 'POST', { username, password });
            
            // 登录成功
            console.log('登录成功:', response);
            this.currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.hideLoginModal();
            this.updateUI();
            window.app.showNotification('登录成功！', 'success');
        } catch (error) {
            // 登录失败
            console.error('登录失败:', error);
            if (errorAlert) {
                errorAlert.textContent = error.message || '用户名或密码错误';
                errorAlert.style.display = 'block';
            }
        }
    },
    
    // 注册处理
    async handleSignup(e) {
        const form = e.target;
        const username = form.querySelector('#signup-username').value;
        const email = form.querySelector('#signup-email').value;
        const password = form.querySelector('#signup-password').value;
        const confirmPassword = form.querySelector('#signup-confirm-password').value;
        const successAlert = document.getElementById('signup-success-alert');
        const errorAlert = document.getElementById('signup-error-alert');
        
        // 重置提示信息
        if (successAlert) {
            successAlert.style.display = 'none';
        }
        if (errorAlert) {
            errorAlert.style.display = 'none';
        }
        
        // 客户端验证
        let validationError = '';
        
        // 用户名验证
        if (username.length < 3 || username.length > 30) {
            validationError = '用户名长度应在3-30个字符之间';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            validationError = '用户名只能包含字母、数字和下划线';
        }
        // 邮箱验证
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationError = '请输入有效的邮箱地址';
        }
        // 密码验证
        else if (password.length < 6) {
            validationError = '密码至少需要6个字符';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            validationError = '密码必须包含大小写字母和数字';
        }
        // 确认密码验证
        else if (password !== confirmPassword) {
            validationError = '两次输入的密码不一致';
        }
        
        if (validationError) {
            if (errorAlert) {
                errorAlert.textContent = validationError;
                errorAlert.style.display = 'block';
            }
            return;
        }
        
        try {
            // 调用后端注册API
            await apiRequest('/auth/register', 'POST', { username, email, password, confirmPassword });
            
            // 显示注册成功消息
            if (successAlert) {
                successAlert.style.display = 'block';
            }
            
            // 3秒后跳转到登录页面
            setTimeout(() => {
                this.hideSignupModal();
                this.showLoginModal();
            }, 3000);
        } catch (error) {
            // 注册失败
            console.error('注册失败:', error);
            if (errorAlert) {
                errorAlert.textContent = error.message || '注册失败';
                errorAlert.style.display = 'block';
            }
        }
    },
    
    // 修改密码处理
    async handleChangePassword(e) {
        const form = e.target;
        const currentPassword = form.querySelector('#current-password').value;
        const newPassword = form.querySelector('#new-password').value;
        const confirmNewPassword = form.querySelector('#confirm-new-password').value;
        const successAlert = document.getElementById('change-password-success-alert');
        const errorAlert = document.getElementById('change-password-error-alert');
        
        // 验证密码是否匹配
        if (newPassword !== confirmNewPassword) {
            if (errorAlert) {
                errorAlert.textContent = '两次输入的新密码不一致';
                errorAlert.style.display = 'block';
            }
            return;
        }
        
        try {
            // 调用后端修改密码API
            await apiRequest('/auth/change-password', 'POST', { 
                currentPassword, 
                newPassword 
            });
            
            // 更新本地用户数据
            if (this.currentUser) {
                this.currentUser.password = newPassword;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            
            // 显示成功消息
            if (successAlert) {
                successAlert.style.display = 'block';
            }
            if (errorAlert) {
                errorAlert.style.display = 'none';
            }
            
            // 清空表单
            form.reset();
            
            // 3秒后关闭模态框
            setTimeout(() => {
                this.hideChangePasswordModal();
            }, 3000);
            
            window.app.showNotification('密码修改成功！', 'success');
        } catch (error) {
            // 修改失败
            if (errorAlert) {
                errorAlert.textContent = error.message || '修改密码失败';
                errorAlert.style.display = 'block';
            }
        }
    },
    
    // 退出登录
    async logout() {
        try {
            // 调用后端退出登录API
            await apiRequest('/auth/logout', 'POST');
        } catch (error) {
            console.error('退出登录失败:', error);
        }
        
        // 清除本地数据
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.updateUI();
        window.app.showNotification('已退出登录', 'info');
    },
    
    // 更新UI
    updateUI() {
        const loginButtonContainer = document.getElementById('login-button-container');
        const userMenu = document.getElementById('user-menu');
        const userAvatar = document.getElementById('user-avatar');
        
        if (this.currentUser) {
            // 显示用户菜单
            if (loginButtonContainer) {
                loginButtonContainer.style.display = 'none';
            }
            if (userMenu) {
                userMenu.style.display = 'flex';
            }
            if (userAvatar) {
                userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
            }
        } else {
            // 显示登录按钮
            if (loginButtonContainer) {
                loginButtonContainer.style.display = 'flex';
            }
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
        
        // 更新欢迎信息
        this.updateWelcomeMessage();
        
        // 更新收藏按钮状态
        this.updateFavoriteButtons();
    },
    
    // 更新欢迎信息
    updateWelcomeMessage() {
        const welcomeSection = document.getElementById('user-welcome-section');
        const welcomeUsername = document.getElementById('welcome-username');
        
        if (this.currentUser && welcomeSection && welcomeUsername) {
            welcomeUsername.textContent = this.currentUser.username;
            welcomeSection.style.display = 'block';
        } else if (welcomeSection) {
            welcomeSection.style.display = 'none';
        }
    },
    
    // 更新收藏按钮状态
    updateFavoriteButtons() {
        if (!this.currentUser) return;
        
        // 检查所有收藏按钮
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const missionId = parseInt(btn.dataset.mission);
            if (this.currentUser.favorites.includes(missionId)) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.style.color = '#f44336';
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.style.color = '';
            }
        });
    },
    
    // 收藏/取消收藏任务
    async toggleFavorite(missionId) {
        if (!this.currentUser) {
            // 未登录用户提示登录
            this.showLoginModal();
            window.app.showNotification('请先登录再收藏任务', 'info');
            return false;
        }
        
        try {
            // 调用后端收藏API
            const response = await apiRequest('/missions/favorite/' + missionId, 'POST');
            
            // 更新本地用户数据
            this.currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // 更新UI
            this.updateFavoriteButtons();
            
            // 显示通知
            window.app.showNotification(response.message, response.success ? 'success' : 'info');
            
            return true;
        } catch (error) {
            console.error('收藏/取消收藏失败:', error);
            window.app.showNotification(error.message || '操作失败', 'error');
            return false;
        }
    },
    
    // 加载收藏列表
    async loadFavorites() {
        const container = document.getElementById('favorites-container');
        if (!container) return;
        
        try {
            // 调用后端获取收藏列表API
            const response = await apiRequest('/missions/favorites', 'GET');
            
            if (!response.favorites || response.favorites.length === 0) {
                // 没有收藏
                container.innerHTML = `
                    <div class="empty-favorites">
                        <i class="fas fa-heart-broken"></i>
                        <h3>暂无收藏</h3>
                        <p>您还没有收藏任何任务</p>
                    </div>
                `;
                return;
            }
            
            // 生成收藏列表
            let html = '<div class="favorites-list">';
            response.favorites.forEach(mission => {
                html += `
                    <div class="favorite-item">
                        <div class="favorite-item-content">
                            <h4>${mission.title}</h4>
                            <p>${mission.description}</p>
                        </div>
                        <div class="favorite-item-actions">
                            <button class="btn btn-primary" onclick="authManager.viewMission(${mission.id})">查看详情</button>
                            <button class="btn" onclick="authManager.toggleFavorite(${mission.id})">取消收藏</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            container.innerHTML = html;
        } catch (error) {
            console.error('加载收藏列表失败:', error);
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart-broken"></i>
                    <h3>加载失败</h3>
                    <p>无法加载收藏列表，请稍后重试</p>
                </div>
            `;
        }
    },
    
    // 查看任务详情
    viewMission(missionId) {
        // 这里应该实现查看任务详情的功能
        // 可以调用太空任务模块的函数来显示详情
        this.hideFavoritesModal();
        window.app.showNotification(`正在加载任务 ${missionId} 的详情...`, 'info');
        
        // 模拟延迟加载
        setTimeout(() => {
            // 触发任务详情显示
            const missionCard = document.querySelector(`.mission-card[data-mission="${missionId}"]`);
            if (missionCard) {
                // 模拟点击事件
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                missionCard.dispatchEvent(clickEvent);
            }
        }, 500);
    },
    
    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }
};

// 导出认证管理器
window.authManager = authManager;

// 当DOM加载完成后初始化认证系统
document.addEventListener('DOMContentLoaded', () => {
    authManager.init();
});
