// 修复太空知识大挑战功能
console.log('=== 太空知识大挑战修复脚本开始加载 ===');

// 立即执行的代码，用于测试脚本是否被正确加载
if (typeof document !== 'undefined') {
    console.log('DOM对象可用，脚本在浏览器环境中执行');
    console.log('当前页面URL:', window.location.href);
    console.log('脚本路径:', document.currentScript ? document.currentScript.src : '未知');
}

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM已加载，开始初始化太空知识大挑战 ===');
    
    // 检查所有必要的DOM元素是否存在
    console.log('检查DOM元素...');
    const requiredIds = [
        'quiz', 'quiz-progress', 'current-question', 'total-questions',
        'quiz-score', 'quiz-question', 'quiz-options', 'quiz-prev',
        'quiz-next', 'quiz-submit', 'quiz-results', 'final-score',
        'max-score', 'results-message', 'quiz-restart', 'quiz-share'
    ];
    
    const missingIds = [];
    requiredIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            missingIds.push(id);
            console.error(`DOM元素缺失: #${id}`);
        } else {
            console.log(`DOM元素找到: #${id}`);
        }
    });
    
    if (missingIds.length > 0) {
        console.error(`共缺失 ${missingIds.length} 个DOM元素，无法初始化太空知识大挑战`);
        return;
    }
    
    console.log('所有DOM元素检查通过，开始初始化功能...');
    
    // 直接定义太空知识大挑战数据
    const quizQuestions = [
        {
            question: "太阳系中最大的行星是哪一个？",
            options: ["地球", "木星", "土星", "火星"],
            correct: 1
        },
        {
            question: "人类首次登月是在哪一年？",
            options: ["1965", "1969", "1972", "1975"],
            correct: 1
        },
        {
            question: "以下哪颗行星被称为'红色星球'？",
            options: ["金星", "火星", "木星", "土星"],
            correct: 1
        },
        {
            question: "国际空间站(ISS)是由多少个国家和地区合作建造的？",
            options: ["5个", "10个", "15个", "20个"],
            correct: 2
        },
        {
            question: "光年是什么单位？",
            options: ["时间单位", "速度单位", "距离单位", "亮度单位"],
            correct: 2
        },
        {
            question: "太阳系中哪颗行星拥有最显著的行星环？",
            options: ["木星", "土星", "天王星", "海王星"],
            correct: 1
        },
        {
            question: "第一位进入太空的女性宇航员是谁？",
            options: ["萨莉·莱德", "瓦莲京娜·捷列什科娃", "梅·杰米森", "佩吉·惠特森"],
            correct: 1
        },
        {
            question: "哈勃太空望远镜是以谁的名字命名的？",
            options: ["阿尔伯特·爱因斯坦", "埃德温·哈勃", "伽利略·伽利雷", "艾萨克·牛顿"],
            correct: 1
        },
        {
            question: "以下哪项不是太阳系中的矮行星？",
            options: ["冥王星", "谷神星", "阋神星", "木卫二"],
            correct: 3
        },
        {
            question: "中国首次载人航天任务是在哪一年？",
            options: ["1999", "2003", "2008", "2011"],
            correct: 1
        }
    ];
    
    // 获取DOM元素
    const quizContainer = document.getElementById('quiz');
    if (!quizContainer) {
        console.error('未找到quiz元素');
        return;
    }
    
    const quizProgress = document.getElementById('quiz-progress');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const quizScoreEl = document.getElementById('quiz-score');
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizPrevBtn = document.getElementById('quiz-prev');
    const quizNextBtn = document.getElementById('quiz-next');
    const quizSubmitBtn = document.getElementById('quiz-submit');
    const quizResults = document.getElementById('quiz-results');
    const finalScoreEl = document.getElementById('final-score');
    const maxScoreEl = document.getElementById('max-score');
    const resultsMessageEl = document.getElementById('results-message');
    const quizRestartBtn = document.getElementById('quiz-restart');
    const quizShareBtn = document.getElementById('quiz-share');
    
    // 检查所有必要元素是否存在
    const requiredElements = [
        quizProgress, currentQuestionEl, totalQuestionsEl, quizScoreEl,
        quizQuestionEl, quizOptionsEl, quizPrevBtn, quizNextBtn,
        quizSubmitBtn, quizResults, finalScoreEl, maxScoreEl,
        resultsMessageEl, quizRestartBtn, quizShareBtn
    ];
    
    const missingElements = requiredElements.filter(el => !el);
    if (missingElements.length > 0) {
        console.error('缺少必要的DOM元素');
        return;
    }
    
    console.log('所有必要元素已找到，初始化变量...');
    
    // 初始化变量
    let currentQuestionIndex = 0;
    let userAnswers = new Array(quizQuestions.length).fill(null);
    let score = 0;
    
    console.log('初始化测验...');
    
    // 初始化测验
    function initQuiz() {
        console.log('调用initQuiz()');
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        score = 0;
        updateQuizUI();
        showQuestion();
        quizResults.style.display = 'none';
        quizContainer.querySelector('.quiz-container').style.display = 'block';
    }
    
    // 更新测验UI
    function updateQuizUI() {
        currentQuestionEl.textContent = currentQuestionIndex + 1;
        totalQuestionsEl.textContent = quizQuestions.length;
        quizScoreEl.textContent = score;
    
        // 更新进度条
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        quizProgress.style.width = `${progress}%`;
    
        // 更新按钮状态
        quizPrevBtn.disabled = currentQuestionIndex === 0;
    
        if (currentQuestionIndex === quizQuestions.length - 1) {
            quizNextBtn.style.display = 'none';
            quizSubmitBtn.style.display = 'inline-flex';
        } else {
            quizNextBtn.style.display = 'inline-flex';
            quizSubmitBtn.style.display = 'none';
        }
    }
    
    // 显示当前问题
    function showQuestion() {
        console.log('显示问题:', currentQuestionIndex);
        const question = quizQuestions[currentQuestionIndex];
        quizQuestionEl.textContent = question.question;
    
        // 清空选项容器
        quizOptionsEl.innerHTML = '';
    
        // 创建选项
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'quiz-option';
            if (userAnswers[currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectOption(index));
            quizOptionsEl.appendChild(optionElement);
        });
    
        updateQuizUI();
    }
    
    // 选择选项
    function selectOption(optionIndex) {
        userAnswers[currentQuestionIndex] = optionIndex;
    
        // 更新UI显示选中的选项
        const options = quizOptionsEl.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            if (index === optionIndex) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    // 显示结果
    function showResults() {
        // 计算得分
        score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizQuestions[index].correct) {
                score++;
            }
        });
    
        // 更新结果UI
        finalScoreEl.textContent = score;
        maxScoreEl.textContent = quizQuestions.length;
    
        // 根据得分显示不同消息
        let message = "";
        if (score === quizQuestions.length) {
            message = "太棒了！您对太空知识了如指掌，简直就是一位太空专家！";
        } else if (score >= quizQuestions.length * 0.7) {
            message = "做得很好！您对太空有很好的了解，继续探索宇宙的奥秘吧！";
        } else if (score >= quizQuestions.length * 0.5) {
            message = "不错！您对太空有一定的了解，继续学习，探索更多宇宙知识！";
        } else {
            message = "别灰心！宇宙浩瀚无垠，还有很多知识等待您去发现。继续学习，您会越来越了解太空的！";
        }
    
        resultsMessageEl.textContent = message;
    
        // 显示结果，隐藏问题
        quizContainer.querySelector('.quiz-container').style.display = 'none';
        quizResults.style.display = 'block';
    }
    
    // 事件监听器
    quizPrevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });
    
    quizNextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        }
    });
    
    quizSubmitBtn.addEventListener('click', showResults);
    
    quizRestartBtn.addEventListener('click', initQuiz);
    
    quizShareBtn.addEventListener('click', () => {
        // 简单的分享功能
        const shareText = `我在宇宙探索网站的太空知识大挑战中获得了 ${score}/${quizQuestions.length} 分！你也来试试吧！`;
        if (navigator.share) {
            navigator.share({
                title: '太空知识大挑战',
                text: shareText,
                url: window.location.href
            });
        } else {
            // 如果不支持Web Share API，则复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                alert('成绩已复制到剪贴板，快去分享给朋友吧！');
            });
        }
    });
    
    // 调用初始化函数
    initQuiz();
    
    console.log('太空知识大挑战初始化完成！');
});