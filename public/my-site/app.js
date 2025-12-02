// 宇宙探索网站主应用脚本
// 统一管理所有功能模块

console.log('=== 宇宙探索网站主应用加载 ===');

// 模块初始化状态
const moduleStatus = {
    quiz: false,
    solarSystem: false,
    game: false,
    auth: false,
    missions: false
};

// 初始化所有功能模块
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== DOM已加载，开始初始化所有功能模块 ===');
    
    try {
        // 初始化认证模块
        await initAuthModule();
        
        // 初始化太空任务模块
        initMissionsModule();
        
        // 初始化3D太阳系模块
        initSolarSystemModule();
        
        // 初始化太空战机游戏模块
        initGameModule();
        
        // 初始化太空知识大挑战模块
        initQuizModule();
        
        // 初始化移动菜单模块
        initMobileMenu();
        
        // 初始化首页功能
        initHomePage();
        
        console.log('=== 所有功能模块初始化完成 ===');
        console.log('模块状态:', moduleStatus);
    } catch (error) {
        console.error('初始化功能模块时发生错误:', error);
    }
});

// 初始化认证模块
async function initAuthModule() {
    try {
        console.log('初始化认证模块...');
        
        // 检查认证管理器是否已存在
        if (window.authManager) {
            console.log('认证管理器已存在，跳过初始化');
            moduleStatus.auth = true;
            return;
        }
        
        console.log('认证模块初始化完成');
        moduleStatus.auth = true;
    } catch (error) {
        console.error('初始化认证模块时发生错误:', error);
        moduleStatus.auth = false;
    }
}

// 初始化3D太阳系模块
function initSolarSystemModule() {
    try {
        console.log('初始化3D太阳系模块...');
        
        // 检查Three.js是否已加载
        if (typeof THREE === 'undefined') {
            console.error('Three.js未正确加载，3D太阳系模块初始化失败');
            moduleStatus.solarSystem = false;
            return;
        }
        
        console.log('Three.js版本:', THREE.REVISION);
        
        // 检查DOM元素是否存在
        const solarSystemEl = document.getElementById('solar-system');
        if (!solarSystemEl) {
            console.error('未找到3D太阳系容器元素，初始化失败');
            moduleStatus.solarSystem = false;
            return;
        }
        
        // 3D太阳系模块在加载时已经自行初始化，这里只需要标记状态
        console.log('3D太阳系模块已自动初始化完成');
        moduleStatus.solarSystem = true;
    } catch (error) {
        console.error('初始化3D太阳系模块时发生错误:', error);
        moduleStatus.solarSystem = false;
    }
}

// 初始化太空战机游戏模块
function initGameModule() {
    try {
        console.log('初始化太空战机游戏模块...');
        
        // 检查DOM元素是否存在
        const gameCanvas = document.getElementById('gameCanvas');
        if (!gameCanvas) {
            console.error('未找到游戏画布元素，初始化失败');
            moduleStatus.game = false;
            return;
        }
        
        // 太空战机游戏模块在加载时已经自行初始化，这里只需要标记状态
        console.log('太空战机游戏模块已自动初始化完成');
        moduleStatus.game = true;
    } catch (error) {
        console.error('初始化太空战机游戏模块时发生错误:', error);
        moduleStatus.game = false;
    }
}

// 初始化太空知识大挑战模块
function initQuizModule() {
    try {
        console.log('初始化太空知识大挑战模块...');
        
        // 检查DOM元素是否存在
        const requiredIds = [
            'quiz', 'quiz-progress', 'current-question', 'total-questions',
            'quiz-score', 'quiz-question', 'quiz-options', 'quiz-prev',
            'quiz-next', 'quiz-submit', 'quiz-results', 'final-score',
            'max-score', 'results-message', 'quiz-restart', 'quiz-share'
        ];
        
        let allElementsFound = true;
        requiredIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`未找到必要的DOM元素: #${id}`);
                allElementsFound = false;
            }
        });
        
        if (!allElementsFound) {
            console.error('缺少必要的DOM元素，太空知识大挑战模块初始化失败');
            moduleStatus.quiz = false;
            return;
        }
        
        // 太空知识大挑战模块在加载时已经自行初始化，这里只需要标记状态
        console.log('太空知识大挑战模块已自动初始化完成');
        moduleStatus.quiz = true;
    } catch (error) {
        console.error('初始化太空知识大挑战模块时发生错误:', error);
        moduleStatus.quiz = false;
    }
}

// 初始化太空任务模块
function initMissionsModule() {
    try {
        console.log('初始化太空任务模块...');
        
        // 检查任务管理器是否已存在
        if (window.missionManager) {
            console.log('太空任务管理器已存在，跳过初始化');
            moduleStatus.missions = true;
            return;
        }
        
        // 检查DOM元素是否存在
        const missionsSection = document.getElementById('missions');
        if (!missionsSection) {
            console.error('未找到太空任务区域，初始化失败');
            moduleStatus.missions = false;
            return;
        }
        
        // 等待任务模块加载完成
        const checkMissionModule = setInterval(() => {
            if (window.missionManager) {
                clearInterval(checkMissionModule);
                console.log('太空任务模块初始化完成');
                moduleStatus.missions = true;
            }
        }, 100);
        
        // 5秒后停止检查
        setTimeout(() => {
            clearInterval(checkMissionModule);
            if (!window.missionManager) {
                console.error('太空任务模块加载超时，初始化失败');
                moduleStatus.missions = false;
            }
        }, 5000);
    } catch (error) {
        console.error('初始化太空任务模块时发生错误:', error);
        moduleStatus.missions = false;
    }
}

// 初始化移动菜单模块
function initMobileMenu() {
    try {
        console.log('初始化移动菜单模块...');
        
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            // 点击导航链接后关闭菜单
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    body.style.overflow = '';
                });
            });

            // 点击其他地方关闭菜单
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        }
        
        console.log('移动菜单模块初始化完成');
    } catch (error) {
        console.error('初始化移动菜单模块时发生错误:', error);
    }
}

// 初始化首页功能
function initHomePage() {
    try {
        console.log('初始化首页功能...');
        
        // 实现"开始旅程"按钮的点击事件
        const startJourneyBtn = document.querySelector('.hero-buttons .btn');
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => {
                console.log('开始旅程按钮被点击');
                // 滚动到探索主题区域
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        console.log('首页功能初始化完成');
    } catch (error) {
        console.error('初始化首页功能时发生错误:', error);
    }
}

// 全局工具函数
window.app = {
    // 显示通知
    showNotification: function(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 3秒后隐藏并移除通知
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },
    
    // 获取模块状态
    getModuleStatus: function() {
        return { ...moduleStatus };
    },
    
    // 重新初始化所有模块
    reinitializeModules: function() {
        console.log('=== 重新初始化所有模块 ===');
        initAuthModule();
        initSolarSystemModule();
        initGameModule();
        initQuizModule();
        initMobileMenu();
        console.log('重新初始化完成，模块状态:', moduleStatus);
    }
};

// 页面加载完成后显示模块状态
window.addEventListener('load', function() {
    console.log('=== 页面完全加载完成，最终模块状态 ===');
    console.table(moduleStatus);
    
    // 检查是否有未初始化成功的模块
    const failedModules = Object.entries(moduleStatus).filter(([name, status]) => !status).map(([name]) => name);
    if (failedModules.length > 0) {
        console.warn(`以下模块初始化失败: ${failedModules.join(', ')}`);
        window.app.showNotification(`以下功能模块初始化失败: ${failedModules.join(', ')}`, 'error');
    } else {
        console.log('所有功能模块初始化成功！');
        window.app.showNotification('所有功能模块初始化成功！', 'success');
    }
});
