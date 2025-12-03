// 太空战机游戏模块
console.log('=== 太空战机游戏模块加载 ===');

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 太空战机游戏模块初始化 ===');
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-game');
    const gameOverlay = document.getElementById('game-overlay');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    
    // 移动端控制按钮
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const shootBtn = document.getElementById('shoot-btn');
    
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 如果是移动设备，显示移动端提示
    if (isMobile) {
        const mobileInstruction = document.createElement('p');
        mobileInstruction.className = 'mobile-instruction';
        mobileInstruction.textContent = '移动设备：使用虚拟按钮控制';
        mobileInstruction.style.cssText = 'color: var(--accent-light); margin-bottom: 15px; font-size: 1rem;';
        gameOverlay.insertBefore(mobileInstruction, gameOverlay.querySelector('h3'));
    }
    
    // 游戏状态
    let gameActive = false;
    let score = 0;
    let lives = 5;
    let level = 1;
    let isInvincible = false;
    let invincibleTimer = 0;
    
    // 玩家飞机
    const player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 80,
        width: 50,
        height: 70,
        speed: 8,
        color: '#4a9de3',
        bullets: [],
        lastShot: 0,
        shotDelay: 200
    };
    
    // 敌机
    let enemies = [];
    let enemySpawnRate = 90;
    
    // 星星背景
    let stars = [];
    
    // 爆炸效果
    let explosions = [];
    
    // 按键状态
    const keys = {};
    
    // 触摸状态
    let touchState = {
        up: false,
        down: false,
        left: false,
        right: false,
        shoot: false
    };
    
    function initMobileControls() {
        if (!isMobile) return;
        
        console.log("初始化移动控制...");
        
        // 确保按钮存在
        console.log("控制按钮:", {upBtn, downBtn, leftBtn, rightBtn, shootBtn});
        
        if (upBtn) addTouchListeners(upBtn, 'up');
        if (downBtn) addTouchListeners(downBtn, 'down');
        if (leftBtn) addTouchListeners(leftBtn, 'left');
        if (rightBtn) addTouchListeners(rightBtn, 'right');
        if (shootBtn) addTouchListeners(shootBtn, 'shoot');
    }

    // 初始化游戏
    function initGame() {
        // 设置画布尺寸
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        score = 0;
        lives = 5;
        level = 1;
        player.x = canvas.width / 2 - 25;
        player.y = canvas.height - 80;
        player.bullets = [];
        enemies = [];
        explosions = [];
        stars = [];
        isInvincible = false;
        invincibleTimer = 0;
        
         // 重置触摸状态
        touchState = {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false
        };
    
        // 创建星星背景
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 3 + 1
            });
        }

        //初始化移动控制
        initMobileControls();

        updateUI();
        gameActive = true;
        gameOverlay.style.display = 'none';
        gameLoop();
    }
    
    // 游戏主循环
    function gameLoop() {
        if (!gameActive) return;
        
        update();
        draw();
        
        requestAnimationFrame(gameLoop);
    }
    
    // 更新游戏状态
    function update() {
        // 更新无敌状态
        if (isInvincible) {
            invincibleTimer--;
            if (invincibleTimer <= 0) {
                isInvincible = false;
            }
        }
        
        // 移动玩家 - 支持键盘和触摸
        if ((keys['ArrowLeft'] || touchState.left) && player.x > 0) {
            player.x -= player.speed;
        }
        if ((keys['ArrowRight'] || touchState.right) && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
        if ((keys['ArrowUp'] || touchState.up) && player.y > 0) {
            player.y -= player.speed;
        }
        if ((keys['ArrowDown'] || touchState.down) && player.y < canvas.height - player.height) {
            player.y += player.speed;
        }
        
        // 发射子弹 - 支持键盘和触摸
        if ((keys[' '] || touchState.shoot) && Date.now() - player.lastShot > player.shotDelay) {
            player.bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 15,
                speed: 10,
                color: '#ffcc00'
            });
            player.lastShot = Date.now();
        }
        
        // 更新子弹
        for (let i = player.bullets.length - 1; i >= 0; i--) {
            player.bullets[i].y -= player.bullets[i].speed;
            
            // 移除超出屏幕的子弹
            if (player.bullets[i].y < 0) {
                player.bullets.splice(i, 1);
            }
        }
        
        // 生成敌机
        if (Math.random() < 1 / enemySpawnRate) {
            spawnEnemy();
        }
        
        // 更新敌机
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;
            
            // 移除超出屏幕的敌机
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
            }
        }
        
        // 检测碰撞
        checkCollisions();
        
        // 更新星星
        for (let i = 0; i < stars.length; i++) {
            stars[i].y += stars[i].speed;
            if (stars[i].y > canvas.height) {
                stars[i].y = 0;
                stars[i].x = Math.random() * canvas.width;
            }
        }
        
        // 更新爆炸效果
        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].timer--;
            if (explosions[i].timer <= 0) {
                explosions.splice(i, 1);
            }
        }
        
        // 检查关卡升级
        if (score >= level * 500) {
            levelUp();
        }
    }
    
    // 绘制游戏
    function draw() {
        // 清空画布
        ctx.fillStyle = '#0a0a2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制星星
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < stars.length; i++) {
            ctx.beginPath();
            ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制玩家飞机
        drawPlayer();
        
        // 绘制子弹
        for (let i = 0; i < player.bullets.length; i++) {
            ctx.fillStyle = player.bullets[i].color;
            ctx.fillRect(
                player.bullets[i].x, 
                player.bullets[i].y, 
                player.bullets[i].width, 
                player.bullets[i].height
            );
            
            // 子弹尾焰效果
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(
                player.bullets[i].x, 
                player.bullets[i].y + player.bullets[i].height, 
                player.bullets[i].width, 
                5
            );
        }
        
        // 绘制敌机
        for (let i = 0; i < enemies.length; i++) {
            drawEnemy(enemies[i]);
        }
        
        // 绘制爆炸效果
        for (let i = 0; i < explosions.length; i++) {
            drawExplosion(explosions[i]);
        }
    }
    
    // 绘制玩家飞机
    function drawPlayer() {
        // 无敌状态闪烁效果
        if (isInvincible && Math.floor(invincibleTimer / 5) % 2 === 0) {
            return;
        }
        
        // 飞机主体
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();
        
        // 飞机细节
        ctx.fillStyle = '#a8d8ff';
        ctx.fillRect(player.x + player.width / 2 - 5, player.y + 10, 10, 20);
        
        // 飞机尾焰
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2 - 10, player.y + player.height);
        ctx.lineTo(player.x + player.width / 2 + 10, player.y + player.height);
        ctx.lineTo(player.x + player.width / 2, player.y + player.height + 15);
        ctx.closePath();
        ctx.fill();
    }
    
    // 绘制敌机
    function drawEnemy(enemy) {
        // 敌机主体
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y);
        ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        ctx.closePath();
        ctx.fill();
        
        // 敌机细节
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(enemy.x + enemy.width / 2 - 5, enemy.y + 5, 10, 10);
    }
    
    // 绘制爆炸效果
    function drawExplosion(explosion) {
        const radius = explosion.timer / 2;
        ctx.fillStyle = `rgba(255, ${100 + explosion.timer * 5}, 0, ${explosion.timer / 20})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 生成敌机
    function spawnEnemy() {
        const size = 25 + Math.random() * 15;
        enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: 1 + Math.random() * 2 + level * 0.3,
            color: `hsl(${Math.random() * 60}, 70%, 50%)`
        });
    }
    
    // 检测碰撞
    function checkCollisions() {
        // 子弹与敌机碰撞
        for (let i = player.bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (isColliding(player.bullets[i], enemies[j])) {
                    // 添加爆炸效果
                    explosions.push({
                        x: enemies[j].x + enemies[j].width / 2,
                        y: enemies[j].y + enemies[j].height / 2,
                        timer: 20
                    });
                    
                    // 移除子弹和敌机
                    player.bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    
                    // 增加分数
                    score += 100;
                    updateUI();
                    break;
                }
            }
        }
        
        // 玩家与敌机碰撞
        if (!isInvincible) {
            for (let i = enemies.length - 1; i >= 0; i--) {
                if (isColliding(player, enemies[i])) {
                    // 添加爆炸效果
                    explosions.push({
                        x: player.x + player.width / 2,
                        y: player.y + player.height / 2,
                        timer: 30
                    });
                    
                    // 移除敌机
                    enemies.splice(i, 1);
                    
                    // 减少生命
                    loseLife();
                    break;
                }
            }
        }
    }
    
    // 碰撞检测
    function isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    // 减少生命
    function loseLife() {
        lives--;
        updateUI();
        
        // 设置无敌状态
        isInvincible = true;
        invincibleTimer = 120;
        
        if (lives <= 0) {
            gameOver();
        }
    }
    
    // 保存游戏成绩
    async function saveGameScore(finalScore) {
        try {
            // 检查用户是否登录
            if (window.authManager && window.authManager.getCurrentUser()) {
                // 调用后端API保存成绩
                await fetch('/api/games/save-score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        score: finalScore
                    })
                });
            }
        } catch (error) {
            console.error('保存游戏成绩失败:', error);
        }
    }
    
    // 游戏结束
    function gameOver() {
        gameActive = false;
        gameOverlay.innerHTML = `
            <h3>游戏结束</h3>
            <p>最终得分: ${score}</p>
            <button class="btn btn-primary" id="restart-game">重新开始</button>
        `;
        gameOverlay.style.display = 'flex';
        
        // 保存游戏成绩
        saveGameScore(score);
        
        // 重新绑定重启按钮事件
        document.getElementById('restart-game').addEventListener('click', initGame);
    }
    
    // 升级关卡
    function levelUp() {
        level++;
        updateUI();
        
        // 增加难度
        enemySpawnRate = Math.max(30, 90 - level * 3);
        
        // 显示关卡升级信息
        const levelUpMsg = document.createElement('div');
        levelUpMsg.className = 'level-up';
        levelUpMsg.innerHTML = `关卡 ${level}`;
        levelUpMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: #4a9de3;
            text-shadow: 0 0 10px rgba(74, 157, 227, 0.7);
            z-index: 20;
            animation: fadeOut 2s forwards;
        `;
        
        document.querySelector('.game-canvas-container').appendChild(levelUpMsg);
        
        setTimeout(() => {
            levelUpMsg.remove();
        }, 2000);
    }
    
    // 更新UI
    function updateUI() {
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        levelElement.textContent = level;
    }
    
    // 事件监听 - 键盘控制
    startBtn.addEventListener('click', initGame);
    
    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
        
        // 防止空格键滚动页面
        if (e.key === ' ') {
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });
    
    // 事件监听 - 移动端触摸控制
    // 方向按钮触摸事件
    function addTouchListeners(button, direction) {
        // 触摸开始
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchState[direction] = true;
        });
        
        // 触摸结束
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            touchState[direction] = false;
        });
        
        // 鼠标事件（用于支持平板设备的鼠标模式）
        button.addEventListener('mousedown', function(e) {
            e.preventDefault();
            touchState[direction] = true;
        });
        
        button.addEventListener('mouseup', function(e) {
            e.preventDefault();
            touchState[direction] = false;
        });
        
        // 防止拖拽
        button.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    }
    
    // 为所有控制按钮添加触摸事件
    if (upBtn) addTouchListeners(upBtn, 'up');
    if (downBtn) addTouchListeners(downBtn, 'down');
    if (leftBtn) addTouchListeners(leftBtn, 'left');
    if (rightBtn) addTouchListeners(rightBtn, 'right');
    if (shootBtn) addTouchListeners(shootBtn, 'shoot');
    
    // 防止画布上的默认触摸行为
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    
    // 添加淡出动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            70% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('=== 太空战机游戏模块初始化完成 ===');
});
