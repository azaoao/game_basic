// 游戏变量
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 界面元素
const startScreen = document.getElementById('startScreen');
const levelSelect = document.getElementById('levelSelect');
const gameScreen = document.getElementById('gameScreen');
const winPopup = document.getElementById('winPopup');
const allLevelsCompletePopup = document.getElementById('allLevelsCompletePopup');
const gameOverPopup = document.getElementById('gameOverPopup');
const settingsPopup = document.getElementById('settingsPopup');
const startButton = document.getElementById('startButton');
const backToStart = document.getElementById('backToStart');
const nextLevel = document.getElementById('nextLevel');
const backToMenu = document.getElementById('backToMenu');
const replayLevel = document.getElementById('replayLevel');
const backToMenuFromAllComplete = document.getElementById('backToMenuFromAllComplete');
const restartLevel = document.getElementById('restartLevel');
const backToLevelSelect = document.getElementById('backToLevelSelect');
const honeyJarButton = document.getElementById('honeyJarButton');
const restartFromSettings = document.getElementById('restartFromSettings');
const backToLevelSelectFromSettings = document.getElementById('backToLevelSelectFromSettings');
const backToMainFromSettings = document.getElementById('backToMainFromSettings');
const closeSettings = document.getElementById('closeSettings');
const stars = document.getElementById('stars');
const levelItems = document.querySelectorAll('.level-item');

// 游戏状态
let currentLevel = 1;
let gameOver = false;
let levelComplete = false;
let completionAnimation = 0;

// 关卡星级存储
let levelStars = {};

// 主角状态
let playerHealth = 5;
const maxHealth = 5;
let isInvincible = false;
let invincibilityTimer = 0;
const invincibilityDuration = 1000; // 1秒

// 武器系统
let currentWeapon = 'sword'; // sword or staff
let weapons = {
    sword: {
        name: '长刀',
        range: 80,
        damage: 100,
        cooldown: 500
    },
    staff: {
        name: '法杖',
        range: 400,
        damage: 15,
        cooldown: 800
    }
};

// 武器状态
let lastAttackTime = 0;
let projectiles = [];
let attackAnimation = 0;

// 敌人
let enemies = [];
let initialEnemyCount = 0;

// 角色属性
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: 15,
    gravity: 0.8,
    isGrounded: false,
    direction: 'right',
    animationFrame: 0,
    isJumping: false
};

// 键盘控制
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    j: false,
    i: false
};

// 关卡设计
const levels = [
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 200, y: 250, width: 150, height: 20 },
            { x: 450, y: 200, width: 150, height: 20 },
            { x: 100, y: 150, width: 150, height: 20 }
        ],
        goal: { x: 150, y: 110, width: 40, height: 40 } // 调整到平台上
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 100, y: 300, width: 100, height: 20 },
            { x: 300, y: 250, width: 100, height: 20 },
            { x: 500, y: 200, width: 100, height: 20 },
            { x: 200, y: 150, width: 100, height: 20 },
            { x: 400, y: 100, width: 100, height: 20 }
        ],
        goal: { x: 450, y: 60, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 50, y: 300, width: 80, height: 20 },
            { x: 200, y: 250, width: 80, height: 20 },
            { x: 350, y: 200, width: 80, height: 20 },
            { x: 500, y: 150, width: 80, height: 20 },
            { x: 650, y: 100, width: 80, height: 20 },
            { x: 125, y: 150, width: 80, height: 20 },
            { x: 275, y: 100, width: 80, height: 20 },
            { x: 425, y: 50, width: 80, height: 20 }
        ],
        goal: { x: 465, y: 10, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 150, y: 300, width: 90, height: 20 },
            { x: 350, y: 250, width: 90, height: 20 },
            { x: 550, y: 200, width: 90, height: 20 },
            { x: 100, y: 200, width: 90, height: 20 },
            { x: 300, y: 150, width: 90, height: 20 },
            { x: 500, y: 100, width: 90, height: 20 },
            { x: 200, y: 100, width: 90, height: 20 },
            { x: 400, y: 50, width: 90, height: 20 }
        ],
        goal: { x: 445, y: 10, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 100, y: 320, width: 85, height: 20 },
            { x: 250, y: 280, width: 85, height: 20 },
            { x: 400, y: 240, width: 85, height: 20 },
            { x: 550, y: 200, width: 85, height: 20 },
            { x: 175, y: 160, width: 85, height: 20 },
            { x: 325, y: 120, width: 85, height: 20 },
            { x: 475, y: 80, width: 85, height: 20 },
            { x: 125, y: 80, width: 85, height: 20 },
            { x: 275, y: 40, width: 85, height: 20 }
        ],
        goal: { x: 317, y: 0, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 50, y: 310, width: 80, height: 20 },
            { x: 180, y: 270, width: 80, height: 20 },
            { x: 310, y: 230, width: 80, height: 20 },
            { x: 440, y: 190, width: 80, height: 20 },
            { x: 570, y: 150, width: 80, height: 20 },
            { x: 115, y: 150, width: 80, height: 20 },
            { x: 245, y: 110, width: 80, height: 20 },
            { x: 375, y: 70, width: 80, height: 20 },
            { x: 505, y: 30, width: 80, height: 20 }
        ],
        goal: { x: 545, y: -10, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 120, y: 320, width: 90, height: 20 },
            { x: 300, y: 290, width: 90, height: 20 },
            { x: 480, y: 260, width: 90, height: 20 },
            { x: 660, y: 230, width: 90, height: 20 },
            { x: 60, y: 200, width: 90, height: 20 },
            { x: 240, y: 170, width: 90, height: 20 },
            { x: 420, y: 140, width: 90, height: 20 },
            { x: 600, y: 110, width: 90, height: 20 },
            { x: 150, y: 80, width: 90, height: 20 },
            { x: 330, y: 50, width: 90, height: 20 }
        ],
        goal: { x: 375, y: 10, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 80, y: 310, width: 85, height: 20 },
            { x: 220, y: 270, width: 85, height: 20 },
            { x: 360, y: 230, width: 85, height: 20 },
            { x: 500, y: 190, width: 85, height: 20 },
            { x: 640, y: 150, width: 85, height: 20 },
            { x: 140, y: 150, width: 85, height: 20 },
            { x: 280, y: 110, width: 85, height: 20 },
            { x: 420, y: 70, width: 85, height: 20 },
            { x: 560, y: 30, width: 85, height: 20 },
            { x: 100, y: 70, width: 85, height: 20 }
        ],
        goal: { x: 142, y: 30, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 100, y: 320, width: 80, height: 20 },
            { x: 250, y: 290, width: 80, height: 20 },
            { x: 400, y: 260, width: 80, height: 20 },
            { x: 550, y: 230, width: 80, height: 20 },
            { x: 700, y: 200, width: 80, height: 20 },
            { x: 50, y: 170, width: 80, height: 20 },
            { x: 200, y: 140, width: 80, height: 20 },
            { x: 350, y: 110, width: 80, height: 20 },
            { x: 500, y: 80, width: 80, height: 20 },
            { x: 650, y: 50, width: 80, height: 20 },
            { x: 125, y: 110, width: 80, height: 20 }
        ],
        goal: { x: 165, y: 70, width: 40, height: 40 }
    },
    {
        platforms: [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 120, y: 310, width: 90, height: 20 },
            { x: 270, y: 270, width: 90, height: 20 },
            { x: 420, y: 230, width: 90, height: 20 },
            { x: 570, y: 190, width: 90, height: 20 },
            { x: 720, y: 150, width: 90, height: 20 },
            { x: 60, y: 150, width: 90, height: 20 },
            { x: 210, y: 110, width: 90, height: 20 },
            { x: 360, y: 70, width: 90, height: 20 },
            { x: 510, y: 30, width: 90, height: 20 },
            { x: 135, y: 70, width: 90, height: 20 },
            { x: 285, y: 30, width: 90, height: 20 }
        ],
        goal: { x: 330, y: -10, width: 40, height: 40 }
    }
];

// 已解锁的关卡
let unlockedLevels = 1;

let currentLevelData = levels[0];

// 事件监听
window.addEventListener('keydown', (e) => {
    if (e.key === 'w') keys.w = true;
    if (e.key === 'a') keys.a = true;
    if (e.key === 's') keys.s = true;
    if (e.key === 'd') keys.d = true;
    if (e.key === 'j') {
        keys.j = true;
        attack();
    }
    if (e.key === 'i') {
        keys.i = true;
        switchWeapon();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') keys.w = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'd') keys.d = false;
    if (e.key === 'j') keys.j = false;
    if (e.key === 'i') keys.i = false;
});

// 界面切换函数
function showScreen(screen) {
    // 隐藏所有屏幕和弹窗
    startScreen.classList.remove('active');
    levelSelect.classList.remove('active');
    gameScreen.classList.remove('active');
    winPopup.classList.remove('active');
    allLevelsCompletePopup.classList.remove('active');
    gameOverPopup.classList.remove('active');
    
    // 显示目标屏幕
    screen.classList.add('active');
    
    // 如果显示的是关卡选择界面，更新关卡状态
    if (screen === levelSelect) {
        updateLevelSelect();
    }
}

// 更新关卡选择界面
function updateLevelSelect() {
    levelItems.forEach((item, index) => {
        const level = index + 1;
        if (level <= unlockedLevels) {
            item.classList.remove('locked');
            // 移除锁图标
            const lockIcon = item.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.style.display = 'none';
            }
        } else {
            item.classList.add('locked');
            // 显示锁图标
            const lockIcon = item.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.style.display = 'block';
            }
        }
        
        // 显示关卡星级
        const starsElement = item.querySelector('.level-stars');
        if (starsElement) {
            const starsCount = levelStars[level] || 0;
            starsElement.innerHTML = '⭐'.repeat(starsCount);
        }
    });
}

// 初始化游戏
function initGame(level) {
    currentLevel = level;
    currentLevelData = levels[level - 1];
    
    // 重置角色位置
    player.x = 100;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isGrounded = false;
    player.isJumping = false;
    
    // 重置游戏状态
    gameOver = false;
    levelComplete = false;
    completionAnimation = 0;
    
    // 重置玩家健康值
    playerHealth = maxHealth;
    isInvincible = false;
    invincibilityTimer = 0;
    
    // 重置武器状态
    currentWeapon = 'sword';
    projectiles = [];
    
    // 生成敌人
    spawnEnemies();
    
    showScreen(gameScreen);
}

// 碰撞检测
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// 绘制角色
function drawPlayer() {
    ctx.save();
    
    // 绘制圣光保护效果
    if (isInvincible) {
        const alpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2 + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // 绘制蜜蜂身体
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(player.x + player.width/2, player.y + player.height/2, player.width/2, player.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制蜜蜂条纹
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + player.width/4, player.y, player.width/2, player.height/5);
    ctx.fillRect(player.x + player.width/4, player.y + player.height*3/5, player.width/2, player.height/5);
    
    // 绘制眼睛
    ctx.fillStyle = '#FFFFFF';
    if (player.direction === 'right') {
        ctx.beginPath();
        ctx.arc(player.x + player.width*3/4, player.y + player.height/3, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制瞳孔
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(player.x + player.width*3/4, player.y + player.height/3, 3, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(player.x + player.width/4, player.y + player.height/3, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制瞳孔
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(player.x + player.width/4, player.y + player.height/3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 绘制触角
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y);
    ctx.lineTo(player.x + player.width/2 - 5, player.y - 10);
    ctx.moveTo(player.x + player.width/2, player.y);
    ctx.lineTo(player.x + player.width/2 + 5, player.y - 10);
    ctx.stroke();
    
    // 绘制翅膀
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(player.x + player.width/4, player.y + player.height/2, player.width/3, player.height/2, Math.PI/4, 0, Math.PI * 2);
    ctx.ellipse(player.x + player.width*3/4, player.y + player.height/2, player.width/3, player.height/2, -Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// 绘制平台（像素块草地风格）
function drawPlatforms() {
    currentLevelData.platforms.forEach(platform => {
        // 绘制草地底部
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // 绘制草地顶部（固定色块效果）
        ctx.fillStyle = '#7CFC00';
        ctx.fillRect(platform.x, platform.y, platform.width, 10);
    });
}

// 武器切换函数
function switchWeapon() {
    if (currentWeapon === 'sword') {
        currentWeapon = 'staff';
    } else {
        currentWeapon = 'sword';
    }
}

// 攻击函数
function attack() {
    const now = Date.now();
    if (now - lastAttackTime < weapons[currentWeapon].cooldown) {
        return;
    }
    
    lastAttackTime = now;
    
    if (currentWeapon === 'sword') {
        // 开始攻击动画
        attackAnimation = 1;
        
        // 长刀攻击（近战）
        enemies.forEach(enemy => {
            const distance = Math.sqrt(
                Math.pow(enemy.x - (player.x + player.width/2), 2) +
                Math.pow(enemy.y - (player.y + player.height/2), 2)
            );
            
            if (distance < weapons.sword.range) {
                enemy.health = 0; // 直接消除敌人
            }
        });
    } else if (currentWeapon === 'staff') {
        // 法杖攻击（远程）
        projectiles.push({
            x: player.x + player.width/2,
            y: player.y + player.height/2,
            velocityX: player.direction === 'right' ? 10 : -10,
            velocityY: 0,
            width: 10,
            height: 10,
            damage: weapons.staff.damage,
            lifetime: 60
        });
    }
}

// 绘制武器
function drawWeapon() {
    ctx.save();
    
    if (currentWeapon === 'sword') {
        // 攻击动画（正常攻击动作，不旋转）
        let swordX, swordY;
        if (player.direction === 'right') {
            if (attackAnimation > 0) {
                // 攻击时的位置
                swordX = player.x + player.width - 5;
                swordY = player.y + player.height/2 - 10;
            } else {
                // 正常位置 - 放在右手边
                swordX = player.x + player.width - 5;
                swordY = player.y + player.height/2 - 4;
            }
            
            // 绘制长刀
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(swordX, swordY, 30, 8);
            ctx.beginPath();
            ctx.moveTo(swordX + 30, swordY);
            ctx.lineTo(swordX + 40, swordY + 4);
            ctx.lineTo(swordX + 30, swordY + 8);
            ctx.closePath();
            ctx.fill();
        } else {
            if (attackAnimation > 0) {
                // 攻击时的位置
                swordX = player.x - 25;
                swordY = player.y + player.height/2 - 10;
            } else {
                // 正常位置 - 放在左手边
                swordX = player.x - 20;
                swordY = player.y + player.height/2 - 4;
            }
            
            // 绘制长刀
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(swordX, swordY, 30, 8);
            ctx.beginPath();
            ctx.moveTo(swordX, swordY);
            ctx.lineTo(swordX - 10, swordY + 4);
            ctx.lineTo(swordX, swordY + 8);
            ctx.closePath();
            ctx.fill();
        }
    } else if (currentWeapon === 'staff') {
        // 绘制法杖（根据方向调整）
        if (player.direction === 'right') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(player.x + player.width - 10, player.y + player.height/2 - 15, 5, 30);
            ctx.fillStyle = '#4B0082';
            ctx.beginPath();
            ctx.arc(player.x + player.width - 7, player.y + player.height/2 - 20, 8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(player.x - 5, player.y + player.height/2 - 15, 5, 30);
            ctx.fillStyle = '#4B0082';
            ctx.beginPath();
            ctx.arc(player.x - 2, player.y + player.height/2 - 20, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.restore();
}

// 绘制血条
function drawHealthBar() {
    ctx.save();
    
    // 绘制血条背景
    ctx.fillStyle = '#333';
    ctx.fillRect(canvas.width - 170, 20, 150, 20);
    
    // 绘制血条
    const healthPercentage = playerHealth / maxHealth;
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(canvas.width - 170, 20, 150 * healthPercentage, 20);
    
    // 绘制血条文字
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`生命值: ${playerHealth}/${maxHealth}`, canvas.width - 95, 30);
    
    ctx.restore();
}

// 绘制投射物
function drawProjectiles() {
    projectiles.forEach(projectile => {
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.width/2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 绘制敌人
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // 绘制敌人眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/3, enemy.y + enemy.height/3, 3, 0, Math.PI * 2);
        ctx.arc(enemy.x + enemy.width*2/3, enemy.y + enemy.height/3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制敌人嘴巴
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height*2/3, 3, 0, Math.PI);
        ctx.stroke();
    });
}

// 生成敌人
function spawnEnemies() {
    enemies = [];
    // 根据关卡生成不同数量的敌人
    const enemyCount = Math.min(currentLevel, 5);
    initialEnemyCount = enemyCount;
    
    for (let i = 0; i < enemyCount; i++) {
        enemies.push({
            x: 200 + i * 150,
            y: 300,
            width: 30,
            height: 30,
            velocityX: Math.random() > 0.5 ? 1 : -1,
            health: 50 + currentLevel * 10
        });
    }
}

// 绘制目标
function drawGoal() {
    const goal = currentLevelData.goal;
    const centerX = goal.x + goal.width/2;
    const centerY = goal.y + goal.height/2;
    const radius = goal.width/2;
    
    // 绘制玫瑰花的花瓣（侧面视角）
    ctx.fillStyle = '#FF0000'; // 红色花瓣
    
    // 绘制外层花瓣
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i;
        const petalX = centerX + Math.cos(angle) * radius * 0.8;
        const petalY = centerY + Math.sin(angle) * radius * 0.4;
        
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, radius/2, radius/3, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 绘制内层花瓣
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i + Math.PI/5;
        const petalX = centerX + Math.cos(angle) * radius * 0.5;
        const petalY = centerY + Math.sin(angle) * radius * 0.2;
        
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, radius/3, radius/4, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 绘制花茎
    ctx.fillStyle = '#008000'; // 绿色花茎
    ctx.fillRect(centerX - 3, centerY + radius/2, 6, 20);
    
    // 绘制叶子
    ctx.fillStyle = '#008000';
    ctx.beginPath();
    ctx.ellipse(centerX - 10, centerY + radius/2 + 10, 8, 12, Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + 10, centerY + radius/2 + 5, 8, 12, -Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制花朵光芒
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const startX = centerX + Math.cos(angle) * (radius + 5);
        const startY = centerY + Math.sin(angle) * (radius + 5);
        const endX = startX + Math.cos(angle) * 10;
        const endY = startY + Math.sin(angle) * 10;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// 绘制通关动画
function drawCompletionAnimation() {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#FFD700';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const scale = 1 + Math.sin(completionAnimation * 0.1) * 0.2;
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(scale, scale);
    ctx.fillText('通关成功!', 0, 0);
    ctx.restore();
}

// 更新游戏状态
function update() {
    if (gameOver || levelComplete) return;
    
    // 应用重力
    player.velocityY += player.gravity;
    
    // 水平移动
    if (keys.a) {
        player.velocityX = -player.speed;
        player.direction = 'left';
    } else if (keys.d) {
        player.velocityX = player.speed;
        player.direction = 'right';
    } else {
        player.velocityX = 0;
    }
    
    // 跳跃
    if (keys.w && player.isGrounded) {
        player.velocityY = -player.jumpForce;
        player.isGrounded = false;
        player.isJumping = true;
    }
    
    // 更新位置
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // 碰撞检测
    player.isGrounded = false;
    currentLevelData.platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isGrounded = true;
                player.isJumping = false;
            } else if (player.velocityY < 0) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
        }
    });
    
    // 边界检测
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.isGrounded = true;
        player.isJumping = false;
    }
    
    // 更新投射物
    projectiles.forEach((projectile, index) => {
        projectile.x += projectile.velocityX;
        projectile.y += projectile.velocityY;
        projectile.lifetime--;
        
        // 检查投射物是否碰到敌人（只击中第一个目标）
        let hitEnemy = false;
        enemies.forEach(enemy => {
            if (!hitEnemy && checkCollision(projectile, enemy)) {
                enemy.health = 0; // 直接销毁敌人
                hitEnemy = true;
                projectiles.splice(index, 1);
            }
        });
        
        // 检查投射物是否超出边界或生命周期结束
        if (!hitEnemy && (projectile.x < 0 || projectile.x > canvas.width || projectile.lifetime <= 0)) {
            projectiles.splice(index, 1);
        }
    });
    
    // 更新敌人
    enemies.forEach(enemy => {
        // 敌人移动
        enemy.x += enemy.velocityX;
        
        // 敌人边界检测
        if (enemy.x < 0 || enemy.x > canvas.width - enemy.width) {
            enemy.velocityX *= -1;
        }
        
        // 敌人重力
        enemy.y += 2;
        
        // 敌人碰撞检测
        currentLevelData.platforms.forEach(platform => {
            if (checkCollision(enemy, platform)) {
                enemy.y = platform.y - enemy.height;
            }
        });
        
        // 检查玩家与敌人碰撞
        if (checkCollision(player, enemy) && !isInvincible) {
            // 玩家受伤
            if (playerHealth > 0) {
                playerHealth--;
                // 进入无敌状态
                isInvincible = true;
                invincibilityTimer = Date.now();
            }
        }
        
        // 检查敌人是否死亡
        if (enemy.health <= 0) {
            const enemyIndex = enemies.indexOf(enemy);
            if (enemyIndex > -1) {
                enemies.splice(enemyIndex, 1);
            }
        }
    });
    
    // 检查玩家健康值
    if (playerHealth <= 0 && !gameOver) {
        gameOver = true;
        setTimeout(() => {
            gameOverPopup.classList.add('active');
        }, 500);
    }
    
    // 检查是否到达目标
    if (checkCollision(player, currentLevelData.goal)) {
        levelComplete = true;
        // 计算通关星级
        let starsCount = 1; // 基础星
        const killedEnemies = initialEnemyCount - enemies.length;
        
        if (killedEnemies > 0 && killedEnemies < initialEnemyCount) {
            starsCount = 2;
        } else if (killedEnemies === initialEnemyCount) {
            starsCount = 3;
        }
        
        // 显示星级
        if (stars) {
            stars.innerHTML = '⭐'.repeat(starsCount);
        }
        
        // 存储关卡星级
        if (!levelStars[currentLevel] || starsCount > levelStars[currentLevel]) {
            levelStars[currentLevel] = starsCount;
        }
        
        // 解锁下一关
        if (currentLevel < unlockedLevels) {
            unlockedLevels = currentLevel;
        }
        if (currentLevel < levels.length && currentLevel >= unlockedLevels) {
            unlockedLevels = currentLevel + 1;
        }
        
        // 更新关卡选择界面
        updateLevelSelect();
        
        setTimeout(() => {
            // 检查是否是最后一关
            if (currentLevel === levels.length) {
                allLevelsCompletePopup.classList.add('active');
            } else {
                winPopup.classList.add('active');
            }
        }, 1000);
    }
    
    // 更新攻击动画
    if (attackAnimation > 0) {
        attackAnimation -= 0.05;
        if (attackAnimation < 0) {
            attackAnimation = 0;
        }
    }
    
    // 更新无敌状态
    if (isInvincible) {
        const now = Date.now();
        if (now - invincibilityTimer > invincibilityDuration) {
            isInvincible = false;
        }
    }
    
    // 更新动画帧
    player.animationFrame++;
}

// 渲染游戏
function render() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制平台
    drawPlatforms();
    
    // 绘制敌人
    drawEnemies();
    
    // 绘制投射物
    drawProjectiles();
    
    // 绘制目标
    drawGoal();
    
    // 绘制角色
    drawPlayer();
    
    // 绘制武器
    drawWeapon();
    
    // 绘制血条
    drawHealthBar();
    
    // 绘制通关动画
    if (levelComplete) {
        completionAnimation++;
        drawCompletionAnimation();
    }
    
    // 绘制当前武器信息
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`当前武器: ${weapons[currentWeapon].name}`, 10, 30);
    ctx.fillText(`攻击: J`, 10, 50);
    ctx.fillText(`切换武器: I`, 10, 70);
    
    // 绘制提示信息
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('要消灭所有怪兽才能获得最高评价哦！', canvas.width/2, canvas.height - 10);
    ctx.textAlign = 'left';
}

// 游戏循环
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// 事件绑定
startButton.addEventListener('click', () => {
    showScreen(levelSelect);
});

backToStart.addEventListener('click', () => {
    showScreen(startScreen);
});

replayLevel.addEventListener('click', () => {
    winPopup.classList.remove('active');
    initGame(currentLevel);
});

nextLevel.addEventListener('click', () => {
    winPopup.classList.remove('active');
    // 检查是否有下一关
    if (currentLevel < levels.length) {
        initGame(currentLevel + 1);
    } else {
        // 所有关卡完成，返回主界面
        showScreen(startScreen);
    }
});

backToMenu.addEventListener('click', () => {
    winPopup.classList.remove('active');
    showScreen(startScreen);
});

// 游戏胜利弹窗中的返回关卡选择按钮
const winBackToLevelSelect = document.getElementById('backToLevelSelect');
winBackToLevelSelect.addEventListener('click', () => {
    winPopup.classList.remove('active');
    showScreen(levelSelect);
});

backToMenuFromAllComplete.addEventListener('click', () => {
    allLevelsCompletePopup.classList.remove('active');
    showScreen(startScreen);
});

restartLevel.addEventListener('click', () => {
    gameOverPopup.classList.remove('active');
    initGame(currentLevel);
});

backToLevelSelect.addEventListener('click', () => {
    gameOverPopup.classList.remove('active');
    showScreen(levelSelect);
});

// 关卡选择
levelItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('locked')) {
            const level = parseInt(item.dataset.level);
            initGame(level);
        }
    });
});

// 蜂蜜罐子按钮点击事件
honeyJarButton.addEventListener('click', () => {
    settingsPopup.classList.add('active');
});

// 设置界面按钮事件
restartFromSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    initGame(currentLevel);
});

backToLevelSelectFromSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    showScreen(levelSelect);
});

backToMainFromSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    showScreen(startScreen);
});

closeSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
});

// 开始游戏
gameLoop();