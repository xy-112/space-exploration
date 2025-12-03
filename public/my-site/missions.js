// 太空任务详情功能
console.log('=== 太空任务模块加载 ===');

// 任务详细数据
const missionDetails = {
    1: {
        id: 1,
        title: '火星殖民计划',
        image: 'images/missions/mar-colony.jpg',
        description: '建立人类在火星上的第一个永久定居点，为未来的星际移民奠定基础。',
        overview: '火星殖民计划是一项雄心勃勃的太空探索计划，旨在将人类送上火星并建立永久定居点。该计划包括多个阶段，从无人探测任务到载人登陆，最终实现大规模殖民。',
        scienceGoals: [
            '研究火星表面环境和地质特征',
            '寻找火星上的水资源和生命迹象',
            '测试人类在火星极端环境下的生存能力',
            '开发火星资源利用技术',
            '为未来的星际移民积累经验'
        ],
        timeline: [
            { year: '2025', event: '无人探测器着陆火星，进行环境评估' },
            { year: '2027', event: '建立火星表面科研基地' },
            { year: '2030', event: '首次载人登陆火星' },
            { year: '2032', event: '扩大基地规模，增加常驻人员' },
            { year: '2035', event: '建立第一个火星城市，容纳100名殖民者' }
        ],
        challenges: [
            '长期太空旅行对人体的影响',
            '火星表面辐射防护',
            '水资源获取和利用',
            '能源供应',
            '食物生产',
            '通信延迟问题',
            '心理健康维护'
        ],
        agencies: [
            '美国国家航空航天局（NASA）',
            '欧洲航天局（ESA）',
            '中国国家航天局（CNSA）',
            '俄罗斯航天局（Roscosmos）',
            '私人航天公司（SpaceX、Blue Origin等）'
        ],
        stats: {
            duration: '2025-2035',
            astronauts: '100+',
            location: '火星'
        }
    },
    2: {
        id: 2,
        title: '木星探测任务',
        image: 'images/missions/jupiter-mission.jpg',
        description: '深入探索木星及其卫星系统，研究这个气态巨行星的大气、磁场和卫星环境。',
        overview: '木星探测任务旨在研究太阳系中最大的行星及其卫星系统。该任务将使用先进的探测器对木星大气、磁场、内部结构以及其卫星（如木卫二欧罗巴）进行详细探测。',
        scienceGoals: [
            '研究木星大气的组成和动力学',
            '探测木星磁场和磁层',
            '研究木星内部结构',
            '探索木卫二欧罗巴的冰壳和地下海洋',
            '研究木星卫星系统的形成和演化'
        ],
        timeline: [
            { year: '2028', event: '探测器发射' },
            { year: '2032', event: '抵达木星轨道' },
            { year: '2033', event: '开始木星大气探测' },
            { year: '2035', event: '木卫二近距离飞掠' },
            { year: '2037', event: '任务结束，探测器撞击木星' }
        ],
        challenges: [
            '强大的木星磁场和辐射环境',
            '长距离通信延迟',
            '探测器能量供应',
            '极端低温环境',
            '高速飞掠时的数据采集'
        ],
        agencies: [
            '美国国家航空航天局（NASA）',
            '欧洲航天局（ESA）',
            '意大利航天局（ASI）'
        ],
        stats: {
            duration: '2028-2037',
            spacecraft: '朱诺号继任者',
            location: '木星'
        }
    },
    3: {
        id: 3,
        title: '系外行星搜寻',
        image: 'images/missions/exoplant-search.jpg',
        description: '使用先进望远镜寻找类地系外行星，评估它们是否具备支持生命的条件。',
        overview: '系外行星搜寻任务旨在发现和研究太阳系外的行星系统，特别是那些可能适合生命存在的类地行星。该任务将使用新一代太空望远镜对邻近恒星进行详细观测。',
        scienceGoals: [
            '发现新的系外行星',
            '研究系外行星的大气组成',
            '寻找类地行星',
            '评估行星的宜居性',
            '研究行星系统的形成和演化'
        ],
        timeline: [
            { year: '2023', event: '太空望远镜发射' },
            { year: '2024', event: '开始全面观测' },
            { year: '2026', event: '首次发现潜在宜居行星' },
            { year: '2030', event: '完成1000颗恒星的观测' },
            { year: '2035', event: '任务扩展，继续观测' }
        ],
        challenges: [
            '行星信号微弱，难以检测',
            '恒星耀斑干扰',
            '望远镜精度要求极高',
            '数据分析量大',
            '宜居性评估标准的制定'
        ],
        agencies: [
            '美国国家航空航天局（NASA）',
            '欧洲航天局（ESA）',
            '加拿大航天局（CSA）'
        ],
        stats: {
            duration: '进行中',
            planetsDiscovered: '1000+',
            location: '银河系'
        }
    },
    4: {
        id: 4,
        title: '小行星采矿',
        image: 'images/missions/asteroid-mining.jpg',
        description: '开发小行星资源，获取稀有矿物和水资源，为宇宙探索提供可持续的物质支持。',
        overview: '小行星采矿任务旨在开发近地小行星上的资源，包括稀有矿物、金属和水资源。这些资源将用于支持太空探索和未来的星际移民。',
        scienceGoals: [
            '探测小行星的组成和结构',
            '开发小行星采样和采矿技术',
            '研究水资源的提取和利用',
            '评估小行星资源的经济价值',
            '为未来的太空资源开发奠定基础'
        ],
        timeline: [
            { year: '2027', event: '首次小行星采样任务' },
            { year: '2029', event: '建立小行星采矿试验基地' },
            { year: '2031', event: '开始商业化采矿运营' },
            { year: '2033', event: '扩大采矿规模，增加目标小行星数量' },
            { year: '2035', event: '建立太空资源加工设施' }
        ],
        challenges: [
            '小行星轨道精确控制',
            '采矿设备的开发和测试',
            '资源提取效率',
            '太空环境对设备的影响',
            '返回地球的成本',
            '法律和伦理问题'
        ],
        agencies: [
            '私人航天公司（Planetary Resources、Deep Space Industries等）',
            '美国国家航空航天局（NASA）',
            '日本宇宙航空研究开发机构（JAXA）'
        ],
        stats: {
            duration: '2027-2035',
            resources: '稀有矿物',
            location: '小行星带'
        }
    }
};

// 太空任务管理器
const missionManager = {
    currentMissionId: null,
    totalMissions: 4,
    
    // 初始化任务模块
    init() {
        console.log('初始化太空任务模块...');
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化收藏按钮功能
        this.initFavoriteButtons();
        
        // 设置总任务数量
        this.updateTotalMissions();
    },
    
    // 绑定事件监听器
    bindEvents() {
        console.log('绑定太空任务事件监听器...');
        
        // 任务卡片点击事件
        document.querySelectorAll('.mission-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是收藏按钮，不触发详情显示
                if (e.target.closest('.favorite-btn')) {
                    return;
                }
                
                const missionId = parseInt(card.dataset.mission);
                this.showMissionDetails(missionId);
            });
        });
        
        // 返回按钮事件
        const backBtn = document.getElementById('mission-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.hideMissionDetails());
        }
        
        // 上一个任务按钮事件
        const prevBtn = document.getElementById('mission-prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.showPrevMission());
        }
        
        // 下一个任务按钮事件
        const nextBtn = document.getElementById('mission-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showNextMission());
        }
    },
    
    // 初始化收藏按钮功能
    initFavoriteButtons() {
        console.log('初始化收藏按钮功能...');
        
        // 收藏按钮点击事件
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
                
                const missionId = parseInt(btn.dataset.mission);
                
                // 调用认证管理器的收藏功能
                if (window.authManager) {
                    window.authManager.toggleFavorite(missionId);
                }
            });
        });
    },
    
    // 更新总任务数量
    updateTotalMissions() {
        const totalMissionsEl = document.getElementById('total-missions');
        if (totalMissionsEl) {
            totalMissionsEl.textContent = this.totalMissions;
        }
    },
    
    // 更新当前任务计数器
    updateCurrentMission() {
        const currentMissionEl = document.getElementById('current-mission');
        if (currentMissionEl && this.currentMissionId) {
            currentMissionEl.textContent = this.currentMissionId;
        }
    },
    
    // 显示任务详情
    showMissionDetails(missionId) {
        console.log('显示任务详情:', missionId);
        
        const mission = missionDetails[missionId];
        if (!mission) {
            console.error('任务数据不存在:', missionId);
            return;
        }
        
        // 设置当前任务ID
        this.currentMissionId = missionId;
        
        // 更新当前任务计数器
        this.updateCurrentMission();
        
        // 生成任务详情内容
        this.generateMissionContent(mission);
        
        // 显示任务详情页面
        const detailPage = document.getElementById('mission-detail-page');
        if (detailPage) {
            detailPage.classList.add('active');
        }
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
    },
    
    // 生成任务详情内容
    generateMissionContent(mission) {
        console.log('生成任务详情内容:', mission.title);
        
        // 获取模板
        const template = document.getElementById('mission-detail-template');
        if (!template) {
            console.error('任务详情模板不存在');
            return;
        }
        
        // 获取滑块容器
        const slider = document.getElementById('mission-detail-slider');
        if (!slider) {
            console.error('任务详情滑块不存在');
            return;
        }
        
        // 生成科学目标HTML
        const scienceGoalsHTML = mission.scienceGoals.map(goal => `<li>${goal}</li>`).join('');
        
        // 生成时间线HTML
        const timelineHTML = mission.timeline.map(item => {
            return `
                <div class="timeline-item">
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-event">${item.event}</div>
                </div>
            `;
        }).join('');
        
        // 生成挑战HTML
        const challengesHTML = mission.challenges.map(challenge => `<li>${challenge}</li>`).join('');
        
        // 生成机构HTML
        const agenciesHTML = mission.agencies.map(agency => `<li>${agency}</li>`).join('');
        
        // 生成统计数据HTML
        let statsHTML = '';
        for (const [key, value] of Object.entries(mission.stats)) {
            statsHTML += `
                <div class="stat-item">
                    <div class="stat-label">${this.formatStatLabel(key)}</div>
                    <div class="stat-value">${value}</div>
                </div>
            `;
        }
        
        // 替换模板变量
        const templateContent = template.innerHTML
            .replace(/{{title}}/g, mission.title)
            .replace(/{{description}}/g, mission.description)
            .replace(/{{image}}/g, mission.image)
            .replace(/{{overview}}/g, mission.overview)
            .replace(/{{scienceGoals}}/g, scienceGoalsHTML)
            .replace(/{{timeline}}/g, timelineHTML)
            .replace(/{{challenges}}/g, challengesHTML)
            .replace(/{{agencies}}/g, agenciesHTML)
            .replace(/{{stats}}/g, statsHTML);
        
        // 更新滑块内容
        slider.innerHTML = templateContent;
    },
    
    // 隐藏任务详情
    hideMissionDetails() {
        console.log('隐藏任务详情');
        
        // 隐藏任务详情页面
        const detailPage = document.getElementById('mission-detail-page');
        if (detailPage) {
            detailPage.classList.remove('active');
        }
        
        // 恢复页面滚动
        document.body.style.overflow = '';
    },
    
    // 显示上一个任务
    showPrevMission() {
        if (this.currentMissionId > 1) {
            this.showMissionDetails(this.currentMissionId - 1);
        }
    },
    
    // 显示下一个任务
    showNextMission() {
        if (this.currentMissionId < this.totalMissions) {
            this.showMissionDetails(this.currentMissionId + 1);
        }
    },
    
    // 格式化统计数据标签
    formatStatLabel(key) {
        const labelMap = {
            duration: '持续时间',
            astronauts: '宇航员数量',
            spacecraft: '探测器',
            planetsDiscovered: '发现行星数量',
            resources: '资源类型',
            location: '位置'
        };
        return labelMap[key] || key;
    },
    
    // 获取任务详情
    getMissionDetails(missionId) {
        return missionDetails[missionId];
    }
};

// 当DOM加载完成后初始化任务模块
document.addEventListener('DOMContentLoaded', () => {
    missionManager.init();
});

// 导出任务管理器
window.missionManager = missionManager;
