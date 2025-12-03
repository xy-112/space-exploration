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
    
    // 定义必要的DOM元素，允许部分元素缺失
    const elements = {
        quiz: document.getElementById('quiz'),
        quizContainer: document.querySelector('.quiz-container'),
        quizProgress: document.getElementById('quiz-progress'),
        quizScoreEl: document.getElementById('quiz-score'),
        quizQuestionEl: document.getElementById('quiz-question'),
        quizOptionsEl: document.getElementById('quiz-options'),
        quizPrevBtn: document.getElementById('quiz-prev'),
        quizNextBtn: document.getElementById('quiz-next'),
        quizSubmitBtn: document.getElementById('quiz-submit'),
        quizResults: document.getElementById('quiz-results'),
        finalScoreEl: document.getElementById('final-score'),
        maxScoreEl: document.getElementById('max-score'),
        resultsMessageEl: document.getElementById('results-message'),
        quizRestartBtn: document.getElementById('quiz-restart'),
        quizShareBtn: document.getElementById('quiz-share')
    };
    
    // 检查核心元素是否存在
    const coreElements = ['quiz', 'quizQuestionEl', 'quizOptionsEl', 'quizPrevBtn', 'quizNextBtn'];
    const missingCoreElements = coreElements.filter(key => !elements[key]);
    
    if (missingCoreElements.length > 0) {
        console.error(`核心DOM元素缺失: ${missingCoreElements.join(', ')}，无法初始化太空知识大挑战`);
        return;
    }
    
    console.log('核心DOM元素检查通过，开始初始化功能...');
    
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
    
    // 添加当前问题计数器元素
    let currentQuestionEl, totalQuestionsEl;
    
    // 检查并创建当前问题计数器元素
    function checkAndCreateQuestionCounter() {
        // 检查是否存在当前问题计数器
        const existingCounter = document.querySelector('.quiz-question-counter');
        
        if (existingCounter) {
            currentQuestionEl = existingCounter.querySelector('.current-question');
            totalQuestionsEl = existingCounter.querySelector('.total-questions');
        } else {
            // 创建当前问题计数器元素
            const counterContainer = document.createElement('div');
            counterContainer.className = 'quiz-question-counter';
            counterContainer.innerHTML = `
                第 <span class="current-question">1</span> / <span class="total-questions">${quizQuestions.length}</span> 题
            `;
            
            // 将计数器添加到quiz-header中
            const quizHeader = document.querySelector('.quiz-header');
            if (quizHeader) {
                quizHeader.appendChild(counterContainer);
                currentQuestionEl = counterContainer.querySelector('.current-question');
                totalQuestionsEl = counterContainer.querySelector('.total-questions');
            } else {
                // 如果没有quiz-header，则创建一个简单的计数器并添加到quiz容器中
                currentQuestionEl = document.createElement('span');
                currentQuestionEl.className = 'current-question';
                currentQuestionEl.textContent = '1';
                
                totalQuestionsEl = document.createElement('span');
                totalQuestionsEl.className = 'total-questions';
                totalQuestionsEl.textContent = quizQuestions.length;
                
                const separator = document.createElement('span');
                separator.textContent = ' / ';
                
                elements.quiz.appendChild(currentQuestionEl);
                elements.quiz.appendChild(separator);
                elements.quiz.appendChild(totalQuestionsEl);
            }
        }
    }
    
    // 创建并添加当前问题计数器
    checkAndCreateQuestionCounter();
    
    console.log('所有必要元素已准备就绪，初始化变量...');
    
    // 初始化变量
    let currentQuestionIndex = 0;
    let userAnswers = new Array(quizQuestions.length).fill(null);
    let score = 0;
    
    // API请求函数（如果需要保存成绩到数据库）
    async function saveQuizScore(score, totalQuestions) {
        if (!window.authManager || !window.authManager.getCurrentUser()) {
            // 用户未登录，不保存成绩
            console.log('用户未登录，不保存成绩');
            return;
        }
        
        try {
            // 调用后端API保存成绩
            const response = await fetch('/api/quiz/save-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    score: score,
                    total: totalQuestions,
                    date: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('成绩保存成功');
                window.app.showNotification('成绩已保存到您的个人资料', 'success');
            } else {
                console.error('成绩保存失败');
            }
        } catch (error) {
            console.error('保存成绩时发生错误:', error);
        }
    }
    
    console.log('初始化测验...');
    
    // 初始化测验
    function initQuiz() {
        console.log('调用initQuiz()');
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        score = 0;
        updateQuizUI();
        showQuestion();
        
        // 隐藏结果，显示问题
        if (elements.quizResults) {
            elements.quizResults.style.display = 'none';
        }
        if (elements.quizContainer) {
            elements.quizContainer.style.display = 'block';
        } else if (elements.quiz) {
            elements.quiz.style.display = 'block';
        }
    }
    
    // 更新测验UI
    function updateQuizUI() {
        if (currentQuestionEl) {
            currentQuestionEl.textContent = currentQuestionIndex + 1;
        }
        if (totalQuestionsEl) {
            totalQuestionsEl.textContent = quizQuestions.length;
        }
        if (elements.quizScoreEl) {
            elements.quizScoreEl.textContent = score;
        }
    
        // 更新进度条
        if (elements.quizProgress) {
            const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
            elements.quizProgress.style.width = `${progress}%`;
        }
    
        // 更新按钮状态
        if (elements.quizPrevBtn) {
            elements.quizPrevBtn.disabled = currentQuestionIndex === 0;
        }
    
        if (currentQuestionIndex === quizQuestions.length - 1) {
            if (elements.quizNextBtn) {
                elements.quizNextBtn.style.display = 'none';
            }
            if (elements.quizSubmitBtn) {
                elements.quizSubmitBtn.style.display = 'inline-flex';
            }
        } else {
            if (elements.quizNextBtn) {
                elements.quizNextBtn.style.display = 'inline-flex';
            }
            if (elements.quizSubmitBtn) {
                elements.quizSubmitBtn.style.display = 'none';
            }
        }
    }
    
    // 显示当前问题
    function showQuestion() {
        console.log('显示问题:', currentQuestionIndex);
        const question = quizQuestions[currentQuestionIndex];
        
        if (elements.quizQuestionEl) {
            elements.quizQuestionEl.textContent = question.question;
        }
    
        // 清空选项容器
        if (elements.quizOptionsEl) {
            elements.quizOptionsEl.innerHTML = '';
        
            // 创建选项
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('button');
                optionElement.className = 'quiz-option';
                if (userAnswers[currentQuestionIndex] === index) {
                    optionElement.classList.add('selected');
                }
                optionElement.textContent = option;
                optionElement.addEventListener('click', () => selectOption(index));
                elements.quizOptionsEl.appendChild(optionElement);
            });
        }
    
        updateQuizUI();
    }
    
    // 选择选项
    function selectOption(optionIndex) {
        userAnswers[currentQuestionIndex] = optionIndex;
    
        // 更新UI显示选中的选项
        if (elements.quizOptionsEl) {
            const options = elements.quizOptionsEl.querySelectorAll('.quiz-option');
            options.forEach((option, index) => {
                if (index === optionIndex) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        }
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
        if (elements.finalScoreEl) {
            elements.finalScoreEl.textContent = score;
        }
        if (elements.maxScoreEl) {
            elements.maxScoreEl.textContent = quizQuestions.length;
        }
    
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
    
        if (elements.resultsMessageEl) {
            elements.resultsMessageEl.textContent = message;
        }
    
        // 显示结果，隐藏问题
        if (elements.quizContainer) {
            elements.quizContainer.style.display = 'none';
        } else if (elements.quiz) {
            elements.quiz.style.display = 'none';
        }
        if (elements.quizResults) {
            elements.quizResults.style.display = 'block';
        }
        
        // 保存成绩到数据库（如果用户已登录）
        saveQuizScore(score, quizQuestions.length);
    }
    
    // 保存知识挑战成绩到数据库
    async function saveQuizScore(score, totalQuestions) {
        try {
            // 检查用户是否登录
            if (window.authManager && window.authManager.getCurrentUser()) {
                // 调用后端API保存成绩
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const API_BASE_URL = isLocalhost ? 'http://localhost:5000/api' : '/api';
                
                await fetch(`${API_BASE_URL}/quiz/save-score`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        score: score,
                        totalQuestions: totalQuestions
                    })
                });
            }
        } catch (error) {
            console.error('保存知识挑战成绩失败:', error);
        }
    }
    
    // 事件监听器
    if (elements.quizPrevBtn) {
        elements.quizPrevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion();
            }
        });
    }
    
    if (elements.quizNextBtn) {
        elements.quizNextBtn.addEventListener('click', () => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            }
        });
    }
    
    if (elements.quizSubmitBtn) {
        elements.quizSubmitBtn.addEventListener('click', showResults);
    }
    
    if (elements.quizRestartBtn) {
        elements.quizRestartBtn.addEventListener('click', initQuiz);
    }
    
    if (elements.quizShareBtn) {
        elements.quizShareBtn.addEventListener('click', () => {
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
                    if (window.app && window.app.showNotification) {
                        window.app.showNotification('成绩已复制到剪贴板，快去分享给朋友吧！', 'success');
                    } else {
                        alert('成绩已复制到剪贴板，快去分享给朋友吧！');
                    }
                });
            }
        });
    }
    
    // 调用初始化函数
    initQuiz();
    
    console.log('太空知识大挑战初始化完成！');
    
    // 给window对象暴露一些方法，方便其他脚本调用
    if (!window.quizManager) {
        window.quizManager = {
            initQuiz: initQuiz,
            getScore: () => score,
            getTotalQuestions: () => quizQuestions.length
        };
    }
});