const mongoose = require('mongoose');
const Mission = require('../models/Mission');
require('dotenv').config();

const missions = [
  {
    missionId: 1,
    title: "火星殖民计划",
    description: "建立人类在火星上的第一个永久定居点，为未来的星际移民奠定基础。该计划是人类历史上最雄心勃勃的太空探索项目之一，旨在在2030年前建立可持续的人类火星定居点。",
    shortDescription: "建立人类在火星上的第一个永久定居点",
    image: "images/missions/mar-colony.jpg",
    category: "mars",
    status: "planning",
    launchDate: new Date("2028-06-01"),
    target: "火星表面",
    crewSize: 12,
    duration: { value: 2, unit: "years" },
    budget: { amount: 5000000000, currency: "USD" },
    objectives: [
      "建立可持续的生命支持系统",
      "测试火星资源利用技术",
      "研究长期太空生活对人类的影响"
    ],
    challenges: [
      "长达6-9个月的太空旅行",
      "火星大气稀薄，缺乏磁场保护",
      "极端温度变化（-140°C 到 20°C）",
      "高辐射环境"
    ],
    scientificGoals: [
      "研究火星地质和气候历史",
      "寻找过去或现在存在生命的证据",
      "测试在极端环境中维持人类生命的技术",
      "开发可持续的封闭生态系统"
    ],
    timeline: [
      { year: 2025, event: "初步勘测开始", description: "派遣机器人进行详细勘探" },
      { year: 2028, event: "基础设施部署", description: "部署居住模块和生命支持系统" },
      { year: 2030, event: "首批定居者抵达", description: "12名宇航员开始火星生活" },
      { year: 2035, event: "定居点自给自足", description: "实现资源循环利用" }
    ],
    participatingAgencies: [
      { name: "NASA", country: "美国", role: "主导机构" },
      { name: "ESA", country: "欧洲", role: "合作机构" },
      { name: "SpaceX", country: "美国", role: "运输提供商" }
    ],
    featured: true
  },
  {
    missionId: 2,
    title: "木星探测任务",
    description: "深入探索木星及其卫星系统，研究这个气态巨行星的大气、磁场和卫星环境。特别关注木卫二的冰下海洋，寻找可能存在生命的迹象。",
    shortDescription: "探索木星及其卫星系统",
    image: "images/missions/jupiter-mission.jpg",
    category: "jupiter",
    status: "in_progress",
    launchDate: new Date("2023-04-15"),
    estimatedCompletion: new Date("2030-12-31"),
    target: "木星轨道",
    crewSize: 0,
    duration: { value: 7, unit: "years" },
    budget: { amount: 2000000000, currency: "USD" },
    scientificGoals: [
      "研究木星大气层的结构和成分",
      "分析木星强大的磁场和辐射带",
      "探索木卫二冰层下的海洋",
      "研究木卫一的火山活动"
    ],
    featured: true
  },
  {
    missionId: 3,
    title: "系外行星搜寻",
    description: "使用先进望远镜寻找类地系外行星，评估它们是否具备支持生命的条件。通过分析行星大气成分，寻找可能存在生命的生物标志物。",
    shortDescription: "寻找太阳系外的类地行星",
    image: "images/missions/exoplant-search.jpg",
    category: "exoplanet",
    status: "completed",
    launchDate: new Date("2021-03-01"),
    target: "银河系内",
    duration: { value: 5, unit: "years" },
    statistics: {
      distance: { value: 100, unit: "光年", description: "搜索范围" }
    },
    featured: true
  },
  {
    missionId: 4,
    title: "小行星采矿",
    description: "开发小行星资源，获取稀有矿物和水资源，为宇宙探索提供可持续的物质支持。验证小行星探测、采样和资源提取的关键技术。",
    shortDescription: "开发小行星的宝贵资源",
    image: "images/missions/asteroid-mining.jpg",
    category: "asteroid",
    status: "planning",
    launchDate: new Date("2027-09-01"),
    target: "近地小行星",
    duration: { value: 3, unit: "years" },
    objectives: [
      "评估小行星资源潜力",
      "开发太空资源提取技术",
      "建立太空资源利用标准"
    ],
    featured: true
  },
  {
    missionId: 5,
    title: "月球基地建设",
    description: "在月球南极建立永久性科研基地，作为深空探索的前哨站。利用月球资源，建立可持续的生命支持系统和科研设施。",
    shortDescription: "建立月球永久性科研基地",
    image: "images/missions/moon-base.jpg",
    category: "moon",
    status: "in_progress",
    launchDate: new Date("2024-07-01"),
    target: "月球南极",
    crewSize: 6,
    duration: { value: 1, unit: "years" }
  },
  {
    missionId: 6,
    title: "金星大气探测",
    description: "发射探测器研究金星浓厚大气层，寻找可能存在的微生物生命迹象。研究金星极端温室效应的形成机制。",
    shortDescription: "探索金星浓厚大气层",
    image: "images/missions/venus-probe.jpg",
    category: "venus",
    status: "planning",
    launchDate: new Date("2029-05-01"),
    target: "金星大气层",
    crewSize: 0,
    duration: { value: 2, unit: "years" }
  },
  {
    missionId: 7,
    title: "太空站扩建",
    description: "扩建国际空间站，增加新的科研模块和生活设施，支持更多宇航员同时进行长期太空研究。",
    shortDescription: "扩建国际空间站设施",
    image: "images/missions/space-station.jpg",
    category: "space_station",
    status: "in_progress",
    target: "国际空间站",
    crewSize: 10
  }
];

const seedDatabase = async () => {
  try {
    // 连接到MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 已连接到数据库');
    
    // 清空现有任务数据
    await Mission.deleteMany({});
    console.log('🗑️  已清空现有任务数据');
    
    // 插入新任务数据
    await Mission.insertMany(missions);
    console.log(`✅ 已插入 ${missions.length} 个任务`);
    
    // 获取插入的任务数量
    const count = await Mission.countDocuments();
    console.log(`📊 数据库中共有 ${count} 个任务`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
};

seedDatabase();