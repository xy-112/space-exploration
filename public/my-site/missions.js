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
    // 初始化任务模块
    init() {
        console.log('初始化太空任务模块...');
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化收藏按钮功能
        this.initFavoriteButtons();
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
        
        // 关闭任务详情模态框
        const closeMissionModal = document.getElementById('close-mission-modal');
        if (closeMissionModal) {
            closeMissionModal.addEventListener('click', () => this.hideMissionDetails());
        }
        
        // 点击模态框外部关闭
        const missionModal = document.getElementById('mission-modal');
        if (missionModal) {
            missionModal.addEventListener('click', (e) => {
                if (e.target === missionModal) {
                    this.hideMissionDetails();
                }
            });
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
    
    // 显示任务详情
    showMissionDetails(missionId) {
        console.log('显示任务详情:', missionId);
        
        const mission = missionDetails[missionId];
        if (!mission) {
            console.error('任务数据不存在:', missionId);
            return;
        }
        
        // 获取模态框元素
        const modal = document.getElementById('mission-modal');
        if (!modal) {
            console.error('任务详情模态框不存在');
            return;
        }
        
        // 填充模态框内容
        this.fillMissionDetails(mission);
        
        // 显示模态框
        modal.classList.add('active');
    },
    
    // 隐藏任务详情
    hideMissionDetails() {
        const modal = document.getElementById('mission-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // 填充任务详情
    fillMissionDetails(mission) {
        console.log('填充任务详情:', mission.title);
        
        // 更新模态框标题
        const titleEl = document.getElementById('mission-modal-title');
        if (titleEl) {
            titleEl.textContent = mission.title;
        }
        
        // 更新任务描述
        const descEl = document.getElementById('mission-modal-description');
        if (descEl) {
            descEl.textContent = mission.description;
        }
        
        // 更新任务图片
        const imgEl = document.getElementById('mission-detail-image');
        if (imgEl) {
            imgEl.src = mission.image;
            imgEl.alt = mission.title;
        }
        
        // 更新任务概述
        const overviewEl = document.getElementById('mission-overview');
        if (overviewEl) {
            overviewEl.textContent = mission.overview;
        }
        
        // 更新科学目标
        const scienceGoalsEl = document.getElementById('mission-science-goals');
        if (scienceGoalsEl) {
            scienceGoalsEl.innerHTML = mission.scienceGoals.map(goal => `<li>${goal}</li>`).join('');
        }
        
        // 更新探索历程
        const timelineEl = document.getElementById('mission-timeline');
        if (timelineEl) {
            const timelineHTML = mission.timeline.map(item => {
                return `
                    <div class="timeline-item">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-event">${item.event}</div>
                    </div>
                `;
            }).join('');
            timelineEl.innerHTML = timelineHTML;
            
            // 添加时间线样式（如果不存在）
            this.addTimelineStyles();
        }
        
        // 更新技术挑战
        const challengesEl = document.getElementById('mission-challenges');
        if (challengesEl) {
            challengesEl.innerHTML = mission.challenges.map(challenge => `<li>${challenge}</li>`).join('');
        }
        
        // 更新参与机构
        const agenciesEl = document.getElementById('mission-agencies');
        if (agenciesEl) {
            agenciesEl.innerHTML = mission.agencies.map(agency => `<li>${agency}</li>`).join('');
        }
    },
    
    // 添加时间线样式
    addTimelineStyles() {
        // 检查是否已添加样式
        if (document.getElementById('mission-timeline-styles')) {
            return;
        }
        
        // 添加时间线CSS样式
        const style = document.createElement('style');
        style.id = 'mission-timeline-styles';
        style.textContent = `
            .mission-detail-stats {
                margin-top: 20px;
            }
            
            .timeline-item {
                display: flex;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(74, 157, 227, 0.2);
            }
            
            .timeline-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            
            .timeline-year {
                font-weight: bold;
                color: var(--accent-light);
                margin-right: 20px;
                min-width: 80px;
            }
            
            .timeline-event {
                flex: 1;
            }
            
            .mission-detail-content {
                display: grid;
                grid-template-columns: 1fr;
                gap: 30px;
            }
            
            .mission-detail-image {
                text-align: center;
            }
            
            .mission-detail-image img {
                max-width: 100%;
                border-radius: 10px;
                max-height: 300px;
                object-fit: cover;
            }
            
            .mission-detail-section {
                background: rgba(10, 10, 42, 0.5);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid rgba(74, 157, 227, 0.2);
            }
            
            .mission-detail-section h3 {
                color: var(--accent-light);
                margin-bottom: 15px;
                font-size: 1.3rem;
            }
            
            .mission-detail-section ul {
                padding-left: 20px;
            }
            
            .mission-detail-section li {
                margin-bottom: 8px;
                color: var(--text-dim);
            }
            
            @media (min-width: 768px) {
                .mission-detail-content {
                    grid-template-columns: 1fr 1fr;
                }
                
                .mission-detail-image {
                    grid-column: 1 / -1;
                }
            }
        `;
        
        document.head.appendChild(style);
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
