// 游戏变量
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 相机系统
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// 界面元素
const startScreen = document.getElementById('startScreen');
const levelSelect = document.getElementById('levelSelect');
const gameScreen = document.getElementById('gameScreen');
const winPopup = document.getElementById('winPopup');
const allLevelsCompletePopup = document.getElementById('allLevelsCompletePopup');
const gameOverPopup = document.getElementById('gameOverPopup');
const settingsPopup = document.getElementById('settingsPopup');
const keybindingsPopup = document.getElementById('keybindingsPopup');
const shopScreen = document.getElementById('shopScreen');
const customizeScreen = document.getElementById('customizeScreen');
const startButton = document.getElementById('startButton');
const shopButton = document.getElementById('shopButton');
const customizeButton = document.getElementById('customizeButton');
const memoryButton = document.getElementById('memoryButton');
const backToStart = document.getElementById('backToStart');
const backToStartFromShop = document.getElementById('backToStartFromShop');
const backToStartFromCustomize = document.getElementById('backToStartFromCustomize');
const backToStartFromMemory = document.getElementById('backToStartFromMemory');
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
const keybindingsButton = document.getElementById('keybindingsButton');
const closeKeybindings = document.getElementById('closeKeybindings');
const stars = document.getElementById('stars');
const levelItems = document.querySelectorAll('.level-item');
const coinCount = document.getElementById('coinCount');
const customizeCoinCount = document.getElementById('customizeCoinCount');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const skinItems = document.querySelectorAll('.skin-item');
const previewCharacter = document.getElementById('previewCharacter');
const memoryScreen = document.getElementById('memoryScreen');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const loadFile = document.getElementById('loadFile');
const confirmLoad = document.getElementById('confirmLoad');

// 虚拟按键元素
const btnUp = document.getElementById('btnUp');
const btnLeft = document.getElementById('btnLeft');
const btnDown = document.getElementById('btnDown');
const btnRight = document.getElementById('btnRight');
const btnAttack = document.getElementById('btnAttack');
const btnSwitch = document.getElementById('btnSwitch');

// 游戏状态
let currentLevel = 1;
let gameOver = false;
let levelComplete = false;
let completionAnimation = 0;
let isPaused = false;

// 关卡星级存储
let levelStars = {};

// 金币系统
let coins = 0;
let coinsInLevel = [];

// 皮肤系统
let currentSkin = 'bee';
let ownedSkins = ['bee'];
let customSkin = null; // 存储自定义皮肤
const skinData = {
    bee: { name: '小蜜蜂', price: 0, unlocked: true },
    orange: { name: '橙子', price: 10, unlocked: false },
    apple: { name: '苹果', price: 10, unlocked: false },
    butterfly: { name: '蝴蝶', price: 10, unlocked: false },
    pineapple: { name: '菠萝', price: 10, unlocked: false },
    special1: { name: '特殊外观', price: 0, unlocked: false },
    custom: { name: '自定义', price: 0, unlocked: false }
};

// 背包系统
let backpack = [];
const itemData = {
    coin: { name: '金币', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20gold%20coin%20icon%20on%20white%20background&image_size=square' },
    letter: { name: '作者给你的信', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20envelope%20icon%20on%20white%20background&image_size=square' }
};

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
        width: 1000, // 关卡1宽度
        platforms: [
            { x: 0, y: 350, width: 1000, height: 50 },
            { x: 200, y: 250, width: 150, height: 20 },
            { x: 450, y: 200, width: 150, height: 20 },
            { x: 700, y: 150, width: 150, height: 20 }
        ],
        coins: [
            { x: 275, y: 230, width: 20, height: 20 },
            { x: 525, y: 180, width: 20, height: 20 },
            { x: 775, y: 130, width: 20, height: 20 }
        ],
        goal: { x: 800, y: 110, width: 40, height: 40 } // 调整到平台上
    },
    {
        width: 1200, // 关卡2宽度
        platforms: [
            { x: 0, y: 350, width: 1200, height: 50 },
            { x: 100, y: 300, width: 100, height: 20 },
            { x: 300, y: 250, width: 100, height: 20 },
            { x: 500, y: 200, width: 100, height: 20 },
            { x: 700, y: 150, width: 100, height: 20 },
            { x: 900, y: 100, width: 100, height: 20 }
        ],
        coins: [
            { x: 150, y: 280, width: 20, height: 20 },
            { x: 350, y: 230, width: 20, height: 20 },
            { x: 550, y: 180, width: 20, height: 20 },
            { x: 750, y: 130, width: 20, height: 20 },
            { x: 950, y: 80, width: 20, height: 20 }
        ],
        goal: { x: 1000, y: 60, width: 40, height: 40 }
    },
    {
        width: 1400, // 关卡3宽度
        platforms: [
            { x: 0, y: 350, width: 1400, height: 50 },
            { x: 50, y: 300, width: 80, height: 20 },
            { x: 200, y: 250, width: 80, height: 20 },
            { x: 350, y: 200, width: 80, height: 20 },
            { x: 500, y: 150, width: 80, height: 20 },
            { x: 650, y: 100, width: 80, height: 20 },
            { x: 800, y: 150, width: 80, height: 20 },
            { x: 950, y: 100, width: 80, height: 20 },
            { x: 1100, y: 50, width: 80, height: 20 }
        ],
        coins: [
            { x: 90, y: 280, width: 20, height: 20 },
            { x: 240, y: 230, width: 20, height: 20 },
            { x: 390, y: 180, width: 20, height: 20 },
            { x: 540, y: 130, width: 20, height: 20 },
            { x: 690, y: 80, width: 20, height: 20 },
            { x: 840, y: 130, width: 20, height: 20 },
            { x: 990, y: 80, width: 20, height: 20 },
            { x: 1140, y: 30, width: 20, height: 20 }
        ],
        goal: { x: 1200, y: 10, width: 40, height: 40 }
    },
    {
        width: 1600, // 关卡4宽度
        platforms: [
            { x: 0, y: 350, width: 1600, height: 50 },
            { x: 150, y: 300, width: 90, height: 20 },
            { x: 350, y: 250, width: 90, height: 20 },
            { x: 550, y: 200, width: 90, height: 20 },
            { x: 750, y: 150, width: 90, height: 20 },
            { x: 950, y: 100, width: 90, height: 20 },
            { x: 1150, y: 150, width: 90, height: 20 },
            { x: 1350, y: 100, width: 90, height: 20 }
        ],
        spikes: [
            { x: 250, y: 330, width: 30, height: 20 },
            { x: 450, y: 330, width: 30, height: 20 },
            { x: 650, y: 330, width: 30, height: 20 },
            { x: 850, y: 330, width: 30, height: 20 },
            { x: 1050, y: 330, width: 30, height: 20 },
            { x: 1250, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 195, y: 280, width: 20, height: 20 },
            { x: 395, y: 230, width: 20, height: 20 },
            { x: 595, y: 180, width: 20, height: 20 },
            { x: 795, y: 130, width: 20, height: 20 },
            { x: 995, y: 80, width: 20, height: 20 },
            { x: 1195, y: 130, width: 20, height: 20 },
            { x: 1395, y: 80, width: 20, height: 20 }
        ],
        goal: { x: 1400, y: 60, width: 40, height: 40 }
    },
    {
        width: 1800, // 关卡5宽度
        platforms: [
            { x: 0, y: 350, width: 1800, height: 50 },
            { x: 100, y: 320, width: 85, height: 20 },
            { x: 250, y: 280, width: 85, height: 20 },
            { x: 400, y: 240, width: 85, height: 20 },
            { x: 550, y: 200, width: 85, height: 20 },
            { x: 700, y: 160, width: 85, height: 20 },
            { x: 850, y: 120, width: 85, height: 20 },
            { x: 1000, y: 80, width: 85, height: 20 },
            { x: 1150, y: 120, width: 85, height: 20 },
            { x: 1300, y: 80, width: 85, height: 20 },
            { x: 1450, y: 40, width: 85, height: 20 }
        ],
        spikes: [
            { x: 175, y: 330, width: 30, height: 20 },
            { x: 325, y: 330, width: 30, height: 20 },
            { x: 475, y: 330, width: 30, height: 20 },
            { x: 625, y: 330, width: 30, height: 20 },
            { x: 775, y: 330, width: 30, height: 20 },
            { x: 925, y: 330, width: 30, height: 20 },
            { x: 1075, y: 330, width: 30, height: 20 },
            { x: 1225, y: 330, width: 30, height: 20 },
            { x: 1375, y: 330, width: 30, height: 20 },
            { x: 1525, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 142, y: 300, width: 20, height: 20 },
            { x: 292, y: 260, width: 20, height: 20 },
            { x: 442, y: 220, width: 20, height: 20 },
            { x: 592, y: 180, width: 20, height: 20 },
            { x: 742, y: 140, width: 20, height: 20 },
            { x: 892, y: 100, width: 20, height: 20 },
            { x: 1042, y: 60, width: 20, height: 20 },
            { x: 1192, y: 100, width: 20, height: 20 },
            { x: 1342, y: 60, width: 20, height: 20 },
            { x: 1492, y: 20, width: 20, height: 20 }
        ],
        goal: { x: 1600, y: 0, width: 40, height: 40 }
    },
    {
        width: 2000, // 关卡6宽度
        platforms: [
            { x: 0, y: 350, width: 2000, height: 50 },
            { x: 50, y: 310, width: 80, height: 20 },
            { x: 180, y: 270, width: 80, height: 20 },
            { x: 310, y: 230, width: 80, height: 20 },
            { x: 440, y: 190, width: 80, height: 20 },
            { x: 570, y: 150, width: 80, height: 20 },
            { x: 700, y: 190, width: 80, height: 20 },
            { x: 830, y: 150, width: 80, height: 20 },
            { x: 960, y: 110, width: 80, height: 20 },
            { x: 1090, y: 70, width: 80, height: 20 },
            { x: 1220, y: 110, width: 80, height: 20 },
            { x: 1350, y: 70, width: 80, height: 20 },
            { x: 1480, y: 30, width: 80, height: 20 }
        ],
        spikes: [
            { x: 115, y: 330, width: 30, height: 20 },
            { x: 245, y: 330, width: 30, height: 20 },
            { x: 375, y: 330, width: 30, height: 20 },
            { x: 505, y: 330, width: 30, height: 20 },
            { x: 635, y: 330, width: 30, height: 20 },
            { x: 765, y: 330, width: 30, height: 20 },
            { x: 895, y: 330, width: 30, height: 20 },
            { x: 1025, y: 330, width: 30, height: 20 },
            { x: 1155, y: 330, width: 30, height: 20 },
            { x: 1285, y: 330, width: 30, height: 20 },
            { x: 1415, y: 330, width: 30, height: 20 },
            { x: 1545, y: 330, width: 30, height: 20 },
            { x: 1675, y: 330, width: 30, height: 20 },
            { x: 1805, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 90, y: 290, width: 20, height: 20 },
            { x: 220, y: 250, width: 20, height: 20 },
            { x: 350, y: 210, width: 20, height: 20 },
            { x: 480, y: 170, width: 20, height: 20 },
            { x: 610, y: 130, width: 20, height: 20 },
            { x: 740, y: 170, width: 20, height: 20 },
            { x: 870, y: 130, width: 20, height: 20 },
            { x: 1000, y: 90, width: 20, height: 20 },
            { x: 1130, y: 50, width: 20, height: 20 },
            { x: 1260, y: 90, width: 20, height: 20 },
            { x: 1390, y: 50, width: 20, height: 20 },
            { x: 1520, y: 10, width: 20, height: 20 }
        ],
        goal: { x: 1700, y: -10, width: 40, height: 40 }
    },
    {
        width: 2200, // 关卡7宽度
        platforms: [
            { x: 0, y: 350, width: 2200, height: 50 },
            { x: 120, y: 320, width: 90, height: 20 },
            { x: 300, y: 290, width: 90, height: 20 },
            { x: 480, y: 260, width: 90, height: 20 },
            { x: 660, y: 230, width: 90, height: 20 },
            { x: 840, y: 200, width: 90, height: 20 },
            { x: 1020, y: 170, width: 90, height: 20 },
            { x: 1200, y: 140, width: 90, height: 20 },
            { x: 1380, y: 110, width: 90, height: 20 },
            { x: 1560, y: 80, width: 90, height: 20 },
            { x: 1740, y: 50, width: 90, height: 20 }
        ],
        spikes: [
            { x: 185, y: 330, width: 30, height: 20 },
            { x: 365, y: 330, width: 30, height: 20 },
            { x: 545, y: 330, width: 30, height: 20 },
            { x: 725, y: 330, width: 30, height: 20 },
            { x: 905, y: 330, width: 30, height: 20 },
            { x: 1085, y: 330, width: 30, height: 20 },
            { x: 1265, y: 330, width: 30, height: 20 },
            { x: 1445, y: 330, width: 30, height: 20 },
            { x: 1625, y: 330, width: 30, height: 20 },
            { x: 1805, y: 330, width: 30, height: 20 },
            { x: 1985, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 165, y: 300, width: 20, height: 20 },
            { x: 345, y: 270, width: 20, height: 20 },
            { x: 525, y: 240, width: 20, height: 20 },
            { x: 705, y: 210, width: 20, height: 20 },
            { x: 885, y: 180, width: 20, height: 20 },
            { x: 1065, y: 150, width: 20, height: 20 },
            { x: 1245, y: 120, width: 20, height: 20 },
            { x: 1425, y: 90, width: 20, height: 20 },
            { x: 1605, y: 60, width: 20, height: 20 },
            { x: 1785, y: 30, width: 20, height: 20 }
        ],
        goal: { x: 1900, y: 10, width: 40, height: 40 }
    },
    {
        width: 2400, // 关卡8宽度
        platforms: [
            { x: 0, y: 350, width: 2400, height: 50 },
            { x: 80, y: 310, width: 85, height: 20 },
            { x: 220, y: 270, width: 85, height: 20 },
            { x: 360, y: 230, width: 85, height: 20 },
            { x: 500, y: 190, width: 85, height: 20 },
            { x: 640, y: 150, width: 85, height: 20 },
            { x: 780, y: 190, width: 85, height: 20 },
            { x: 920, y: 150, width: 85, height: 20 },
            { x: 1060, y: 110, width: 85, height: 20 },
            { x: 1200, y: 70, width: 85, height: 20 },
            { x: 1340, y: 110, width: 85, height: 20 },
            { x: 1480, y: 70, width: 85, height: 20 },
            { x: 1620, y: 30, width: 85, height: 20 },
            { x: 1760, y: 70, width: 85, height: 20 }
        ],
        spikes: [
            { x: 145, y: 330, width: 30, height: 20 },
            { x: 285, y: 330, width: 30, height: 20 },
            { x: 425, y: 330, width: 30, height: 20 },
            { x: 565, y: 330, width: 30, height: 20 },
            { x: 705, y: 330, width: 30, height: 20 },
            { x: 845, y: 330, width: 30, height: 20 },
            { x: 985, y: 330, width: 30, height: 20 },
            { x: 1125, y: 330, width: 30, height: 20 },
            { x: 1265, y: 330, width: 30, height: 20 },
            { x: 1405, y: 330, width: 30, height: 20 },
            { x: 1545, y: 330, width: 30, height: 20 },
            { x: 1685, y: 330, width: 30, height: 20 },
            { x: 1825, y: 330, width: 30, height: 20 },
            { x: 1965, y: 330, width: 30, height: 20 },
            { x: 2105, y: 330, width: 30, height: 20 },
            { x: 2245, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 122, y: 290, width: 20, height: 20 },
            { x: 262, y: 250, width: 20, height: 20 },
            { x: 402, y: 210, width: 20, height: 20 },
            { x: 542, y: 170, width: 20, height: 20 },
            { x: 682, y: 130, width: 20, height: 20 },
            { x: 822, y: 170, width: 20, height: 20 },
            { x: 962, y: 130, width: 20, height: 20 },
            { x: 1102, y: 90, width: 20, height: 20 },
            { x: 1242, y: 50, width: 20, height: 20 },
            { x: 1382, y: 90, width: 20, height: 20 },
            { x: 1522, y: 50, width: 20, height: 20 },
            { x: 1662, y: 10, width: 20, height: 20 },
            { x: 1802, y: 50, width: 20, height: 20 }
        ],
        goal: { x: 2000, y: 30, width: 40, height: 40 }
    },
    {
        width: 2600, // 关卡9宽度
        platforms: [
            { x: 0, y: 350, width: 2600, height: 50 },
            { x: 100, y: 320, width: 80, height: 20 },
            { x: 250, y: 290, width: 80, height: 20 },
            { x: 400, y: 260, width: 80, height: 20 },
            { x: 550, y: 230, width: 80, height: 20 },
            { x: 700, y: 200, width: 80, height: 20 },
            { x: 850, y: 170, width: 80, height: 20 },
            { x: 1000, y: 140, width: 80, height: 20 },
            { x: 1150, y: 110, width: 80, height: 20 },
            { x: 1300, y: 80, width: 80, height: 20 },
            { x: 1450, y: 110, width: 80, height: 20 },
            { x: 1600, y: 80, width: 80, height: 20 },
            { x: 1750, y: 50, width: 80, height: 20 },
            { x: 1900, y: 80, width: 80, height: 20 },
            { x: 2050, y: 40, width: 80, height: 20 }
        ],
        spikes: [
            { x: 165, y: 330, width: 30, height: 20 },
            { x: 315, y: 330, width: 30, height: 20 },
            { x: 465, y: 330, width: 30, height: 20 },
            { x: 615, y: 330, width: 30, height: 20 },
            { x: 765, y: 330, width: 30, height: 20 },
            { x: 915, y: 330, width: 30, height: 20 },
            { x: 1065, y: 330, width: 30, height: 20 },
            { x: 1215, y: 330, width: 30, height: 20 },
            { x: 1365, y: 330, width: 30, height: 20 },
            { x: 1515, y: 330, width: 30, height: 20 },
            { x: 1665, y: 330, width: 30, height: 20 },
            { x: 1815, y: 330, width: 30, height: 20 },
            { x: 1965, y: 330, width: 30, height: 20 },
            { x: 2115, y: 330, width: 30, height: 20 },
            { x: 2265, y: 330, width: 30, height: 20 },
            { x: 2415, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 140, y: 300, width: 20, height: 20 },
            { x: 290, y: 270, width: 20, height: 20 },
            { x: 440, y: 240, width: 20, height: 20 },
            { x: 590, y: 210, width: 20, height: 20 },
            { x: 740, y: 180, width: 20, height: 20 },
            { x: 890, y: 150, width: 20, height: 20 },
            { x: 1040, y: 120, width: 20, height: 20 },
            { x: 1190, y: 90, width: 20, height: 20 },
            { x: 1340, y: 60, width: 20, height: 20 },
            { x: 1490, y: 90, width: 20, height: 20 },
            { x: 1640, y: 60, width: 20, height: 20 },
            { x: 1790, y: 30, width: 20, height: 20 },
            { x: 1940, y: 60, width: 20, height: 20 },
            { x: 2090, y: 20, width: 20, height: 20 }
        ],
        goal: { x: 2200, y: 0, width: 40, height: 40 }
    },
    {
        width: 2800, // 关卡10宽度
        platforms: [
            { x: 0, y: 350, width: 2800, height: 50 },
            { x: 120, y: 310, width: 90, height: 20 },
            { x: 270, y: 270, width: 90, height: 20 },
            { x: 420, y: 230, width: 90, height: 20 },
            { x: 570, y: 190, width: 90, height: 20 },
            { x: 720, y: 150, width: 90, height: 20 },
            { x: 870, y: 190, width: 90, height: 20 },
            { x: 1020, y: 150, width: 90, height: 20 },
            { x: 1170, y: 110, width: 90, height: 20 },
            { x: 1320, y: 70, width: 90, height: 20 },
            { x: 1470, y: 110, width: 90, height: 20 },
            { x: 1620, y: 70, width: 90, height: 20 },
            { x: 1770, y: 30, width: 90, height: 20 },
            { x: 1920, y: 70, width: 90, height: 20 },
            { x: 2070, y: 30, width: 90, height: 20 },
            { x: 2220, y: 70, width: 90, height: 20 }
        ],
        spikes: [
            { x: 185, y: 330, width: 30, height: 20 },
            { x: 335, y: 330, width: 30, height: 20 },
            { x: 485, y: 330, width: 30, height: 20 },
            { x: 635, y: 330, width: 30, height: 20 },
            { x: 785, y: 330, width: 30, height: 20 },
            { x: 935, y: 330, width: 30, height: 20 },
            { x: 1085, y: 330, width: 30, height: 20 },
            { x: 1235, y: 330, width: 30, height: 20 },
            { x: 1385, y: 330, width: 30, height: 20 },
            { x: 1535, y: 330, width: 30, height: 20 },
            { x: 1685, y: 330, width: 30, height: 20 },
            { x: 1835, y: 330, width: 30, height: 20 },
            { x: 1985, y: 330, width: 30, height: 20 },
            { x: 2135, y: 330, width: 30, height: 20 },
            { x: 2285, y: 330, width: 30, height: 20 },
            { x: 2435, y: 330, width: 30, height: 20 },
            { x: 2585, y: 330, width: 30, height: 20 }
        ],
        coins: [
            { x: 165, y: 290, width: 20, height: 20 },
            { x: 315, y: 250, width: 20, height: 20 },
            { x: 465, y: 210, width: 20, height: 20 },
            { x: 615, y: 170, width: 20, height: 20 },
            { x: 765, y: 130, width: 20, height: 20 },
            { x: 915, y: 170, width: 20, height: 20 },
            { x: 1065, y: 130, width: 20, height: 20 },
            { x: 1215, y: 90, width: 20, height: 20 },
            { x: 1365, y: 50, width: 20, height: 20 },
            { x: 1515, y: 90, width: 20, height: 20 },
            { x: 1665, y: 50, width: 20, height: 20 },
            { x: 1815, y: 10, width: 20, height: 20 },
            { x: 1965, y: 50, width: 20, height: 20 },
            { x: 2115, y: 10, width: 20, height: 20 },
            { x: 2265, y: 50, width: 20, height: 20 }
        ],
        goal: { x: 2400, y: 30, width: 40, height: 40 }
    }
];

// 已解锁的关卡
let unlockedLevels = 1;

let currentLevelData = levels[0];

// 事件监听
// 键位映射
let keybindings = {
    jump: ' ',
    left: 'a',
    down: 's',
    right: 'd',
    attack: 'j',
    switch: 'i'
};

// 从本地存储加载键位设置
function loadKeybindings() {
    const savedKeybindings = localStorage.getItem('keybindings');
    if (savedKeybindings) {
        keybindings = JSON.parse(savedKeybindings);
    }
}

// 保存键位设置到本地存储
function saveKeybindings() {
    localStorage.setItem('keybindings', JSON.stringify(keybindings));
}

// 重置默认键位
function resetKeybindings() {
    keybindings = {
        jump: ' ',
        left: 'a',
        down: 's',
        right: 'd',
        attack: 'j',
        switch: 'i'
    };
    saveKeybindings();
    updateKeybindingButtons();
    alert('已重置默认键位');
}

// 更新键位按钮显示
function updateKeybindingButtons() {
    const keyJump = document.getElementById('keyJump');
    const keyLeft = document.getElementById('keyLeft');
    const keyDown = document.getElementById('keyDown');
    const keyRight = document.getElementById('keyRight');
    const keyAttack = document.getElementById('keyAttack');
    const keySwitch = document.getElementById('keySwitch');
    
    if (keyJump) keyJump.textContent = keybindings.jump === ' ' ? '空格键' : keybindings.jump.toUpperCase();
    if (keyLeft) keyLeft.textContent = keybindings.left.toUpperCase();
    if (keyDown) keyDown.textContent = keybindings.down.toUpperCase();
    if (keyRight) keyRight.textContent = keybindings.right.toUpperCase();
    if (keyAttack) keyAttack.textContent = keybindings.attack.toUpperCase();
    if (keySwitch) keySwitch.textContent = keybindings.switch.toUpperCase();
    
    // 更新控制说明
    updateControlInstructions();
}

// 更新控制说明
function updateControlInstructions() {
    const controlJump = document.getElementById('controlJump');
    const controlLeft = document.getElementById('controlLeft');
    const controlDown = document.getElementById('controlDown');
    const controlRight = document.getElementById('controlRight');
    const controlAttack = document.getElementById('controlAttack');
    const controlSwitch = document.getElementById('controlSwitch');
    
    if (controlJump) controlJump.textContent = (keybindings.jump === ' ' ? '空格键' : keybindings.jump.toUpperCase()) + ' - 跳跃';
    if (controlLeft) controlLeft.textContent = keybindings.left.toUpperCase() + ' - 向左移动';
    if (controlDown) controlDown.textContent = keybindings.down.toUpperCase() + ' - 向下移动';
    if (controlRight) controlRight.textContent = keybindings.right.toUpperCase() + ' - 向右移动';
    if (controlAttack) controlAttack.textContent = keybindings.attack.toUpperCase() + ' - 攻击';
    if (controlSwitch) controlSwitch.textContent = keybindings.switch.toUpperCase() + ' - 切换武器';
}

// 录制键位
function startRecordingKey(keyFunction) {
    const button = document.getElementById(`key${keyFunction.charAt(0).toUpperCase() + keyFunction.slice(1)}`);
    if (!button) return;
    
    button.textContent = '按任意键...';
    button.classList.add('recording');
    
    const handleKeyPress = (e) => {
        const key = e.key.toLowerCase();
        // 防止使用功能键和修饰键
        if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            // 检查是否与其他键位冲突
            let isConflict = false;
            for (const [func, k] of Object.entries(keybindings)) {
                if (func !== keyFunction && k === key) {
                    isConflict = true;
                    break;
                }
            }
            
            if (isConflict) {
                alert('该键位已被使用，请选择其他键位');
            } else {
                keybindings[keyFunction] = key;
                saveKeybindings();
                updateKeybindingButtons();
            }
            
            button.classList.remove('recording');
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    // 3秒后自动取消录制
    setTimeout(() => {
        button.classList.remove('recording');
        updateKeybindingButtons();
        document.removeEventListener('keydown', handleKeyPress);
    }, 3000);
}

// 绑定键位设置事件
function bindKeybindingEvents() {
    const keyJump = document.getElementById('keyJump');
    const keyLeft = document.getElementById('keyLeft');
    const keyDown = document.getElementById('keyDown');
    const keyRight = document.getElementById('keyRight');
    const keyAttack = document.getElementById('keyAttack');
    const keySwitch = document.getElementById('keySwitch');
    const resetKeybindingsBtn = document.getElementById('resetKeybindings');
    
    if (keyJump) keyJump.addEventListener('click', () => startRecordingKey('jump'));
    if (keyLeft) keyLeft.addEventListener('click', () => startRecordingKey('left'));
    if (keyDown) keyDown.addEventListener('click', () => startRecordingKey('down'));
    if (keyRight) keyRight.addEventListener('click', () => startRecordingKey('right'));
    if (keyAttack) keyAttack.addEventListener('click', () => startRecordingKey('attack'));
    if (keySwitch) keySwitch.addEventListener('click', () => startRecordingKey('switch'));
    if (resetKeybindingsBtn) resetKeybindingsBtn.addEventListener('click', resetKeybindings);
}

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === keybindings.jump) keys.space = true;
    if (key === keybindings.left) keys.a = true;
    if (key === keybindings.down) keys.s = true;
    if (key === keybindings.right) keys.d = true;
    if (key === keybindings.attack) {
        keys.j = true;
        attack();
    }
    if (key === keybindings.switch) {
        keys.i = true;
        switchWeapon();
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === keybindings.jump) keys.space = false;
    if (key === keybindings.left) keys.a = false;
    if (key === keybindings.down) keys.s = false;
    if (key === keybindings.right) keys.d = false;
    if (key === keybindings.attack) keys.j = false;
    if (key === keybindings.switch) keys.i = false;
});



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

// 更新换装界面
function updateCustomizeScreen() {
    // 更新预览角色
    if (previewCharacter) {
        // 清空预览区域
        previewCharacter.innerHTML = '';
        
        // 创建canvas元素用于绘制放大的角色
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        previewCharacter.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // 绘制放大的角色（使用预览皮肤）
        drawLargeCharacter(ctx, previewSkin);
        
        // 添加购买按钮
        const buyButton = document.createElement('button');
        buyButton.id = 'buySkinButton';
        buyButton.className = 'buy-btn';
        buyButton.style.display = 'none';
        previewCharacter.appendChild(buyButton);
        
        // 重新设置购买按钮事件
        setupBuyButtonEvent();
    }
    
    // 更新金币显示
    if (customizeCoinCount) {
        customizeCoinCount.textContent = coins;
    }
    
    // 确保所有已拥有的皮肤都在"我的"栏目中
    updateMyCollection();
    
    // 更新皮肤项目状态
    const skinItems = document.querySelectorAll('.skin-item');
    skinItems.forEach(item => {
        const skin = item.dataset.skin;
        const isCustomSkin = item.classList.contains('custom-skin-item');
        const isOwned = isCustomSkin ? !!customSkin : (skin ? ownedSkins.includes(skin) : false);
        const isCurrent = isCustomSkin ? currentSkin === 'custom' : (skin ? skin === currentSkin : false);
        
        // 移除所有状态类
        item.classList.remove('active', 'locked');
        
        // 添加相应状态类
        if (isCurrent) {
            item.classList.add('active');
        } else if (!isOwned && skin && skinData[skin].price > 0) {
            item.classList.add('locked');
        }
        
        // 更新状态文本
        const statusElement = item.querySelector('.skin-status');
        const priceElement = item.querySelector('.skin-price');
        
        if (isCustomSkin) {
            if (isCurrent) {
                if (statusElement) statusElement.textContent = '当前';
            } else if (isOwned) {
                if (statusElement) statusElement.textContent = '已拥有';
            } else {
                if (statusElement) statusElement.textContent = '上传';
            }
            if (priceElement) priceElement.style.display = 'none';
        } else if (isCurrent) {
            if (statusElement) statusElement.textContent = '当前';
            if (priceElement) priceElement.style.display = 'none';
        } else if (isOwned) {
            if (statusElement) statusElement.textContent = '已拥有';
            if (priceElement) priceElement.style.display = 'none';
        } else {
            if (statusElement) statusElement.style.display = 'none';
            if (priceElement) priceElement.style.display = 'block';
        }
    });
    
    // 更新购买按钮状态
    updateBuyButton();
}

// 更新"我的"栏目中的皮肤
function updateMyCollection() {
    const myTab = document.getElementById('my-tab');
    const mySkinGrid = myTab.querySelector('.skin-grid');
    if (!mySkinGrid) return;
    
    // 保存自定义皮肤上传区域
    const customSkinItem = mySkinGrid.querySelector('.custom-skin-item');
    
    // 清除现有的皮肤项（保留小蜜蜂默认皮肤和自定义皮肤上传区域）
    const existingSkinItems = mySkinGrid.querySelectorAll('.skin-item:not([data-skin="bee"]):not(.custom-skin-item)');
    existingSkinItems.forEach(item => item.remove());
    
    // 确保自定义皮肤上传区域存在
    if (!customSkinItem) {
        const newCustomSkinItem = document.createElement('div');
        newCustomSkinItem.className = 'skin-item custom-skin-item';
        
        // 检查是否已有自定义皮肤
        let customSkinHtml = '';
        if (customSkin) {
            // 显示自定义皮肤缩略图
            customSkinHtml = `
                <div class="custom-skin-upload">
                    <input type="file" id="customSkinUpload" accept="image/*" style="display: none;">
                    <label for="customSkinUpload" class="custom-skin-label">
                        <img src="${customSkin.src}" class="custom-skin-thumbnail" alt="${customSkinName}">
                        <span>${customSkinName}</span>
                        <div class="skin-status">已拥有</div>
                    </label>
                </div>
            `;
        } else {
            // 显示上传按钮
            customSkinHtml = `
                <div class="custom-skin-upload">
                    <input type="file" id="customSkinUpload" accept="image/*" style="display: none;">
                    <label for="customSkinUpload" class="custom-skin-label">
                        <div class="custom-skin-icon">
                            <div class="upload-icon">+</div>
                        </div>
                        <span>自定义</span>
                        <div class="skin-status">上传</div>
                    </label>
                </div>
            `;
        }
        
        newCustomSkinItem.innerHTML = customSkinHtml;
        mySkinGrid.appendChild(newCustomSkinItem);
        // 重新绑定自定义皮肤上传事件
        bindCustomSkinUploadEvent();
    } else {
        // 更新自定义皮肤显示
        if (customSkin) {
            const customSkinLabel = customSkinItem.querySelector('.custom-skin-label');
            if (customSkinLabel) {
                customSkinLabel.innerHTML = `
                    <img src="${customSkin.src}" class="custom-skin-thumbnail" alt="${customSkinName}">
                    <span>${customSkinName}</span>
                    <div class="skin-status">已拥有</div>
                `;
            }
        }
    }
    
    // 添加所有已拥有的皮肤
    ownedSkins.forEach(skin => {
        if (skin !== 'bee') { // 小蜜蜂默认皮肤已经存在
            // 检查是否已经存在
            const existingItem = mySkinGrid.querySelector(`.skin-item[data-skin="${skin}"]`);
            if (!existingItem) {
                const newSkinItem = document.createElement('div');
                newSkinItem.className = 'skin-item';
                newSkinItem.dataset.skin = skin;
                newSkinItem.innerHTML = `
                    <div class="skin-icon ${skin}"></div>
                    <span>${skinData[skin].name}</span>
                    <div class="skin-status">已拥有</div>
                `;
                mySkinGrid.appendChild(newSkinItem);
            }
        }
    });
    
    // 更新商城栏目，移除已拥有的皮肤
    const shopTab = document.getElementById('shop-tab');
    const shopSkinGrid = shopTab.querySelector('.skin-grid');
    if (shopSkinGrid) {
        const shopSkinItems = shopSkinGrid.querySelectorAll('.skin-item');
        shopSkinItems.forEach(item => {
            const skin = item.dataset.skin;
            if (ownedSkins.includes(skin)) {
                item.remove();
            }
        });
    }
    
    // 重新绑定事件
    bindSkinItemEvents();
}

// 初始化游戏
function initGame(level) {
    // 确保level参数有效
    if (!level || level < 1 || level > levels.length) {
        console.error('无效的关卡编号:', level);
        return;
    }
    
    // 加载键位设置
    loadKeybindings();
    // 更新控制说明
    updateControlInstructions();
    
    currentLevel = level;
    currentLevelData = levels[level - 1];
    
    // 确保关卡数据存在
    if (!currentLevelData) {
        console.error('关卡数据不存在:', level);
        return;
    }
    
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
    
    // 水平翻转当角色面向左侧
    if (player.direction === 'left') {
        ctx.translate(player.x + player.width, 0);
        ctx.scale(-1, 1);
        ctx.translate(-player.x, 0);
    }
    
    // 根据当前皮肤绘制角色
    drawCharacter(ctx, player.x, player.y, player.width, player.height, currentSkin);
    
    ctx.restore();
}

// 绘制角色的通用函数
function drawCharacter(ctx, x, y, width, height, skin) {
    if (skin === 'custom' && customSkin) {
        // 绘制自定义皮肤
        ctx.drawImage(customSkin, x, y, width, height);
        return;
    }
    
    switch (skin) {
        case 'bee':
            // 绘制蜜蜂身体
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制蜜蜂条纹
            ctx.fillStyle = '#000000';
            ctx.fillRect(x + width/4, y, width/2, height/5);
            ctx.fillRect(x + width/4, y + height*3/5, width/2, height/5);
            
            // 绘制眼睛（始终在右侧，因为翻转后会自动到左侧）
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制瞳孔
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制触角
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width/2 - 5, y - 10);
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width/2 + 5, y - 10);
            ctx.stroke();
            
            // 绘制翅膀
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.ellipse(x + width/4, y + height/2, width/3, height/2, Math.PI/4, 0, Math.PI * 2);
            ctx.ellipse(x + width*3/4, y + height/2, width/3, height/2, -Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            break;
        
        case 'orange':
            // 绘制橙子身体
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制橙子纹理
            ctx.fillStyle = '#FF6347';
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const px = x + width/2 + Math.cos(angle) * width/4;
                const py = y + height/2 + Math.sin(angle) * height/4;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制眼睛
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制瞳孔
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制叶子
            ctx.fillStyle = '#008000';
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width/2 - 10, y - 15);
            ctx.lineTo(x + width/2 + 10, y - 15);
            ctx.closePath();
            ctx.fill();
            break;
        
        case 'apple':
            // 绘制苹果身体
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制苹果纹理
            ctx.fillStyle = '#CC0000';
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 / 6) * i;
                const px = x + width/2 + Math.cos(angle) * width/4;
                const py = y + height/2 + Math.sin(angle) * height/4;
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制眼睛
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制瞳孔
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制叶子
            ctx.fillStyle = '#008000';
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width/2 - 8, y - 12);
            ctx.lineTo(x + width/2 + 8, y - 12);
            ctx.closePath();
            ctx.fill();
            
            // 绘制茎
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width/2, y - 8);
            ctx.stroke();
            break;
        
        case 'butterfly':
            // 绘制蝴蝶身体
            ctx.fillStyle = '#000000';
            ctx.fillRect(x + width*2/5, y + height/3, width/5, height/3);
            
            // 绘制蝴蝶头部
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + width*2/5, y + height/2, width/10, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制蝴蝶触角
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + width*2/5, y + height/2);
            ctx.lineTo(x + width*1/5, y + height/4);
            ctx.moveTo(x + width*2/5, y + height/2);
            ctx.lineTo(x + width*3/5, y + height/4);
            ctx.stroke();
            
            // 绘制蝴蝶翅膀
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.ellipse(x + width/4, y + height/2, width/3, height/2, Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FF1493';
            ctx.beginPath();
            ctx.ellipse(x + width*3/4, y + height/2, width/3, height/2, -Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制眼睛
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + width*2/5, y + height*3/7, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制瞳孔
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + width*2/5, y + height*4/7, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
        
        case 'pineapple':
            // 绘制菠萝身体
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制菠萝纹理
            ctx.fillStyle = '#FFA500';
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const px = x + width/2 + Math.cos(angle) * width/4;
                const py = y + height/2 + Math.sin(angle) * height/4;
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制眼睛
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制瞳孔
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + width*3/4, y + height/3, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制菠萝叶子
            ctx.fillStyle = '#008000';
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width/2 - 15, y - 20);
            ctx.lineTo(x + width/2 + 15, y - 20);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.moveTo(x + width/2, y - 10);
            ctx.lineTo(x + width/2 - 10, y - 25);
            ctx.lineTo(x + width/2 + 10, y - 25);
            ctx.closePath();
            ctx.fill();
            break;
    }
}

// 绘制放大的角色用于预览
function drawLargeCharacter(ctx, skin) {
    // 绘制放大的角色
    const x = 50;
    const y = 50;
    const width = 200;
    const height = 200;
    
    // 绘制圣光保护效果（模拟无敌状态）
    const alpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, width/2 + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 水平翻转当角色面向左侧（默认右侧）
    ctx.save();
    
    // 根据当前皮肤绘制角色
    drawCharacter(ctx, x, y, width, height, skin);
    
    // 绘制武器
    ctx.save();
    
    // 应用水平翻转当角色面向左侧
    ctx.translate(x + width, 0);
    ctx.scale(-1, 1);
    ctx.translate(-x, 0);
    
    // 绘制长刀
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(x + width - 5, y + height/2 - 4, 30, 8);
    ctx.beginPath();
    ctx.moveTo(x + width - 5 + 30, y + height/2 - 4);
    ctx.lineTo(x + width - 5 + 40, y + height/2);
    ctx.lineTo(x + width - 5 + 30, y + height/2 + 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
    
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
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const distance = Math.sqrt(
                Math.pow(enemy.x - (player.x + player.width/2), 2) +
                Math.pow(enemy.y - (player.y + player.height/2), 2)
            );
            
            if (distance < weapons.sword.range) {
                // 直接从数组中移除敌人
                enemies.splice(i, 1);
            }
        }
    } else if (currentWeapon === 'staff') {
        // 法杖攻击（远程）
        projectiles.push({
            x: player.x + player.width/2,
            y: player.y + player.height/2,
            velocityX: player.direction === 'right' ? 8 : -8,
            velocityY: 0,
            width: 15,
            height: 15,
            damage: weapons.staff.damage,
            lifetime: 200
        });
    }
}

// 绘制武器
function drawWeapon() {
    ctx.save();
    
    if (currentWeapon === 'sword') {
        // 攻击动画（挥砍效果）
        let swordX, swordY, rotation = 0;
        if (player.direction === 'right') {
            if (attackAnimation > 0) {
                // 攻击时的位置和旋转
                const attackProgress = 1 - attackAnimation;
                if (attackProgress < 0.5) {
                    // 挥砍动作
                    swordX = player.x + player.width - 5;
                    swordY = player.y + player.height/2 - 5;
                    rotation = 0 + attackProgress * Math.PI * 0.8; // 从0度开始挥砍
                } else {
                    // 收刀动作
                    swordX = player.x + player.width - 5;
                    swordY = player.y + player.height/2 - 5;
                    rotation = 0 + (1 - attackProgress) * Math.PI * 0.8; // 回到0度
                }
            } else {
                // 正常位置 - 水平向右，刀尖在外
                swordX = player.x + player.width - 5;
                swordY = player.y + player.height/2 - 4;
                rotation = 0; // 0度（水平向右）
            }
        } else {
            // 左侧方向：使用与右侧相同的位置计算，但通过翻转实现镜像效果
            if (attackAnimation > 0) {
                // 攻击时的位置和旋转
                const attackProgress = 1 - attackAnimation;
                if (attackProgress < 0.5) {
                    // 挥砍动作
                    swordX = player.x + player.width - 5;
                    swordY = player.y + player.height/2 - 5;
                    rotation = 0 + attackProgress * Math.PI * 0.8; // 与右侧相同的旋转
                } else {
                    // 收刀动作
                    swordX = player.x + player.width - 5;
                    swordY = player.y + player.height/2 - 5;
                    rotation = 0 + (1 - attackProgress) * Math.PI * 0.8; // 与右侧相同的旋转
                }
            } else {
                // 正常位置
                swordX = player.x + player.width - 5;
                swordY = player.y + player.height/2 - 4;
                rotation = 0; // 与右侧相同的旋转
            }
        }
        
        // 绘制长刀
        ctx.save();
        
        // 应用水平翻转当角色面向左侧
        if (player.direction === 'left') {
            ctx.translate(player.x + player.width, 0);
            ctx.scale(-1, 1);
            ctx.translate(-player.x, 0);
        }
        
        // 以靠近人物主体的长刀边缘为旋转轴
        ctx.translate(swordX, swordY + 4);
        ctx.rotate(rotation);
        ctx.fillStyle = '#C0C0C0';
        
        // 统一绘制方式，通过翻转实现镜像
        ctx.fillRect(0, -4, 30, 8);
        ctx.beginPath();
        ctx.moveTo(30, -4);
        ctx.lineTo(40, 0);
        ctx.lineTo(30, 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    } else if (currentWeapon === 'staff') {
        // 应用水平翻转当角色面向左侧
        if (player.direction === 'left') {
            ctx.save();
            ctx.translate(player.x + player.width, 0);
            ctx.scale(-1, 1);
            ctx.translate(-player.x, 0);
        }
        
        // 统一绘制方式，通过翻转实现镜像
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(player.x + player.width - 10, player.y + player.height/2 - 15, 5, 30);
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(player.x + player.width - 7, player.y + player.height/2 - 20, 8, 0, Math.PI * 2);
        ctx.fill();
        
        if (player.direction === 'left') {
            ctx.restore();
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
        // 确保currentLevelData存在并且有width属性
        const maxX = currentLevelData && currentLevelData.width ? currentLevelData.width - 100 : 700;
        enemies.push({
            x: Math.min(300 + i * 120, maxX), // 确保在关卡范围内
            y: 250, // 调整位置，确保在平台上
            width: 30,
            height: 30,
            velocityX: Math.random() > 0.5 ? 1 : -1,
            health: 50 + currentLevel * 10
        });
    }
}

// 绘制尖刺
function drawSpikes() {
    if (currentLevelData && currentLevelData.spikes && Array.isArray(currentLevelData.spikes)) {
        currentLevelData.spikes.forEach(spike => {
            if (spike && typeof spike === 'object') {
                ctx.fillStyle = '#808080';
                ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
                
                // 绘制尖刺的尖顶
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.moveTo(spike.x, spike.y);
                ctx.lineTo(spike.x + spike.width/2, spike.y - 10);
                ctx.lineTo(spike.x + spike.width, spike.y);
                ctx.closePath();
                ctx.fill();
            }
        });
    }
}

// 绘制金币
function drawCoins() {
    if (currentLevelData && currentLevelData.coins && Array.isArray(currentLevelData.coins)) {
        currentLevelData.coins.forEach(coin => {
            if (coin && typeof coin === 'object') {
                // 绘制金币主体
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制金币的高光
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(coin.x + coin.width/3, coin.y + coin.height/3, coin.width/6, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制金币的边缘
                ctx.strokeStyle = '#FFA500';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }
}

// 绘制目标
function drawGoal() {
    if (!currentLevelData || !currentLevelData.goal) return;
    
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

// 更新相机位置
function updateCamera() {
    // 相机跟随玩家，保持玩家在屏幕中央
    camera.x = player.x - camera.width / 2 + player.width / 2;
    
    // 限制相机边界，确保不会超出关卡范围
    if (camera.x < 0) {
        camera.x = 0;
    }
    if (currentLevelData && currentLevelData.width) {
        if (camera.x > currentLevelData.width - camera.width) {
            camera.x = currentLevelData.width - camera.width;
        }
    }
}

// 更新游戏状态
function update() {
    // 检查是否在游戏界面，不在游戏界面时不执行游戏逻辑
    if (!gameScreen.classList.contains('active')) return;
    
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
    if (keys.space && player.isGrounded) {
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
    if (player.x > currentLevelData.width - player.width) player.x = currentLevelData.width - player.width;
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.isGrounded = true;
        player.isJumping = false;
    }
    
    // 更新相机位置
    updateCamera();
    
    // 更新投射物
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        if (!projectile) continue;
        
        projectile.x += projectile.velocityX;
        projectile.y += projectile.velocityY;
        projectile.lifetime--;
        
        // 检查投射物是否碰到敌人（只击中第一个目标）
        let hitEnemy = false;
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (enemy && checkCollision(projectile, enemy)) {
                // 直接从数组中移除敌人
                enemies.splice(j, 1);
                hitEnemy = true;
                projectiles.splice(i, 1);
                break;
            }
        }
        
        // 检查投射物是否超出边界或生命周期结束
        if (!hitEnemy && (projectile.x < 0 || (currentLevelData && currentLevelData.width && projectile.x > currentLevelData.width) || projectile.lifetime <= 0)) {
            projectiles.splice(i, 1);
        }
    }
    
    // 更新敌人
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        // 敌人移动
        enemy.x += enemy.velocityX;
        
        // 敌人边界检测
        if (enemy.x < 0) {
            enemy.x = 0;
            enemy.velocityX *= -1;
        } else if (enemy.x > currentLevelData.width - enemy.width) {
            enemy.x = currentLevelData.width - enemy.width;
            enemy.velocityX *= -1;
        }
        
        // 敌人重力
        enemy.y += 2;
        
        // 敌人碰撞检测
        let onPlatform = false;
        currentLevelData.platforms.forEach(platform => {
            if (checkCollision(enemy, platform)) {
                if (enemy.y + enemy.height > platform.y && enemy.y < platform.y) {
                    enemy.y = platform.y - enemy.height;
                    onPlatform = true;
                }
            }
        });
        
        // 检查敌人是否掉出画布底部
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
        }
        
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
    }
    
    // 检查尖刺碰撞
    if (currentLevelData && currentLevelData.spikes && Array.isArray(currentLevelData.spikes)) {
        currentLevelData.spikes.forEach(spike => {
            if (spike && checkCollision(player, spike) && !isInvincible) {
                // 玩家受伤
                if (playerHealth > 0) {
                    playerHealth--;
                    // 进入无敌状态
                    isInvincible = true;
                    invincibilityTimer = Date.now();
                }
            }
        });
    }
    
    // 检查金币收集
    if (currentLevelData && currentLevelData.coins && Array.isArray(currentLevelData.coins)) {
        for (let i = currentLevelData.coins.length - 1; i >= 0; i--) {
            const coin = currentLevelData.coins[i];
            if (coin && checkCollision(player, coin)) {
                // 收集金币
                coins++;
                // 从关卡中移除金币
                currentLevelData.coins.splice(i, 1);
            }
        }
    }
    
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
        
        // 三星：需要满血，杀掉所有怪物，到达终点
        if (playerHealth === maxHealth && killedEnemies === initialEnemyCount) {
            starsCount = 3;
        }
        // 两星：要么满血，并且击杀起码一个怪物通关；要么少血（大于1滴）杀完怪物通关
        else if ((playerHealth === maxHealth && killedEnemies > 0) || (playerHealth > 1 && killedEnemies === initialEnemyCount)) {
            starsCount = 2;
        }
        // 一星：满血直接通关不击杀怪物；或者只剩一滴血杀完怪物通关
        else {
            starsCount = 1;
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
        if (currentLevel >= unlockedLevels && currentLevel < levels.length) {
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
    
    // 应用相机变换
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    // 绘制平台
    drawPlatforms();
    
    // 绘制尖刺
    drawSpikes();
    
    // 绘制金币
    drawCoins();
    
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
    
    // 恢复相机变换
    ctx.restore();
    
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
    
    // 绘制金币数量
    ctx.fillStyle = '#FFD700';
    ctx.font = '16px Arial';
    ctx.fillText(`金币: ${coins}`, 10, 90);
    
    // 绘制提示信息
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('要消灭所有怪兽才能获得最高评价哦！', canvas.width/2, canvas.height - 10);
    ctx.textAlign = 'left';
}

// 游戏循环
function gameLoop() {
    try {
        if (!isPaused) {
            update();
        }
        render();
    } catch (error) {
        console.error('游戏出错:', error);
    }
    requestAnimationFrame(gameLoop);
}

// 事件绑定
startButton.addEventListener('click', () => {
    showScreen(levelSelect);
});

// 商城按钮点击事件
shopButton.addEventListener('click', () => {
    showScreen(shopScreen);
});

backToStartFromShop.addEventListener('click', () => {
    showScreen(startScreen);
});

// 换装按钮点击事件
customizeButton.addEventListener('click', () => {
    showScreen(customizeScreen);
});

// 从换装界面返回主界面
backToStartFromCustomize.addEventListener('click', () => {
    showScreen(startScreen);
});

// 关卡选择界面返回主界面
backToStart.addEventListener('click', () => {
    showScreen(startScreen);
});

// 标签页切换事件
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // 移除所有标签页的活动状态
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // 添加当前标签页的活动状态
        btn.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
});

// 显示金币不足提示
function showCoinNotification() {
    const notification = document.getElementById('coinNotification');
    if (notification) {
        notification.textContent = '金币不足，无法购买';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// 全局变量，用于存储当前预览的皮肤
let previewSkin = currentSkin;

// 皮肤项目点击事件
function bindSkinItemEvents() {
    const skinItems = document.querySelectorAll('.skin-item');
    skinItems.forEach(item => {
        item.addEventListener('click', () => {
            const skin = item.dataset.skin;
            const isCustomSkin = item.classList.contains('custom-skin-item');
            
            // 预览皮肤
            if (isCustomSkin) {
                previewSkin = 'custom';
            } else {
                previewSkin = skin;
            }
            updateCustomizeScreen();
            
            // 更新购买按钮状态
            updateBuyButton();
        });
    });
}

// 更新购买按钮状态
function updateBuyButton() {
    const buyButton = document.getElementById('buySkinButton');
    if (!buyButton) return;
    
    const isCustomSkin = previewSkin === 'custom';
    const isOwned = isCustomSkin ? !!customSkin : ownedSkins.includes(previewSkin);
    const skin = previewSkin;
    
    // 设置按钮样式
    buyButton.style.position = 'absolute';
    buyButton.style.bottom = '20px';
    buyButton.style.left = '50%';
    buyButton.style.transform = 'translateX(-50%)';
    buyButton.style.padding = '12px 30px';
    buyButton.style.fontSize = '16px';
    buyButton.style.fontWeight = 'bold';
    buyButton.style.color = 'white';
    buyButton.style.border = 'none';
    buyButton.style.borderRadius = '25px';
    buyButton.style.cursor = 'pointer';
    buyButton.style.transition = 'all 0.3s ease';
    buyButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    if (isCustomSkin) {
        if (isOwned) {
            // 已拥有的自定义皮肤，显示装备按钮
            buyButton.textContent = '装备';
            buyButton.style.display = 'block';
            buyButton.style.backgroundColor = '#4CAF50';
            buyButton.disabled = false;
        } else {
            // 未拥有的自定义皮肤，显示上传按钮
            buyButton.textContent = '上传';
            buyButton.style.display = 'block';
            buyButton.style.backgroundColor = '#2196F3';
            buyButton.disabled = false;
        }
    } else if (isOwned) {
        // 已拥有的皮肤，显示装备按钮
        buyButton.textContent = '装备';
        buyButton.style.display = 'block';
        buyButton.style.backgroundColor = '#4CAF50';
        buyButton.disabled = false;
    } else if (skinData[skin].price > 0 && coins >= skinData[skin].price) {
        // 未拥有的皮肤，金币足够，显示购买按钮
        buyButton.textContent = `购买 (${skinData[skin].price}金币)`;
        buyButton.style.display = 'block';
        buyButton.style.backgroundColor = '#2196F3';
        buyButton.disabled = false;
    } else if (skinData[skin].price > 0 && coins < skinData[skin].price) {
        // 金币不足，显示金币不足按钮
        buyButton.textContent = '金币不足';
        buyButton.style.display = 'block';
        buyButton.style.backgroundColor = '#cccccc';
        buyButton.disabled = true;
    } else {
        // 其他情况，隐藏按钮
        buyButton.style.display = 'none';
        buyButton.disabled = false;
    }
}

// 购买按钮点击事件
function setupBuyButtonEvent() {
    const buyButton = document.getElementById('buySkinButton');
    if (buyButton) {
        // 移除之前的事件监听器，避免重复绑定
        buyButton.removeEventListener('click', handleBuyButtonClick);
        
        // 绑定新的事件监听器
        buyButton.addEventListener('click', handleBuyButtonClick);
    }
}

// 购买按钮点击处理函数
function handleBuyButtonClick() {
    const skin = previewSkin;
    const isCustomSkin = skin === 'custom';
    const isOwned = isCustomSkin ? !!customSkin : ownedSkins.includes(skin);
    
    if (isCustomSkin) {
        if (isOwned) {
            // 已拥有的自定义皮肤，直接装备
            currentSkin = skin;
            updateCustomizeScreen();
            alert('已改变角色外观');
        } else {
            // 未拥有的自定义皮肤，打开上传弹窗
            const customSkinInfoModal = document.getElementById('customSkinInfoModal');
            if (customSkinInfoModal) {
                customSkinInfoModal.style.display = 'flex';
            }
        }
    } else if (isOwned) {
        // 已拥有的皮肤，直接装备
        currentSkin = skin;
        updateCustomizeScreen();
        alert('已改变角色外观');
    } else if (skinData[skin].price > 0 && coins >= skinData[skin].price) {
        // 未拥有的皮肤，购买前确认
        if (confirm(`是否购买皮肤：${skinData[skin].name}`)) {
            coins -= skinData[skin].price;
            ownedSkins.push(skin);
            currentSkin = skin;
            
            // 从商城中移除该皮肤并添加到"我的"栏目
            moveSkinToMyCollection(skin);
            
            updateCustomizeScreen();
            alert('已购买并装备新外观');
        }
    }
}

// 将皮肤从商城移到"我的"栏目
function moveSkinToMyCollection(skin) {
    // 找到商城中的皮肤项
    const shopSkinItem = document.querySelector(`#shop-tab .skin-item[data-skin="${skin}"]`);
    if (shopSkinItem) {
        // 创建新的皮肤项
        const newSkinItem = document.createElement('div');
        newSkinItem.className = 'skin-item';
        newSkinItem.dataset.skin = skin;
        newSkinItem.innerHTML = `
            <div class="skin-icon ${skin}"></div>
            <span>${skinData[skin].name}</span>
            <div class="skin-status">已拥有</div>
        `;
        
        // 添加到"我的"栏目
        const myTab = document.getElementById('my-tab');
        const mySkinGrid = myTab.querySelector('.skin-grid');
        if (mySkinGrid) {
            mySkinGrid.appendChild(newSkinItem);
        }
        
        // 从商城中移除
        shopSkinItem.remove();
        
        // 重新绑定事件
        bindSkinItemEvents();
    }
}

// 初始绑定事件
bindSkinItemEvents();
// 初始化购买按钮事件
setupBuyButtonEvent();
// 初始化背包系统
initBackpack();
// 绑定背包相关事件
bindBackpackEvents();
// 绑定商城商品事件
bindShopItemEvents();
// 绑定自定义皮肤上传事件
bindCustomSkinUploadEvent();



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

const backToLevelSelectFromGameOver = document.getElementById('backToLevelSelectFromGameOver');
backToLevelSelectFromGameOver.addEventListener('click', () => {
    gameOverPopup.classList.remove('active');
    showScreen(levelSelect);
});

// 初始化背包系统
function initBackpack() {
    // 添加初始金币到背包
    addItemToBackpack('coin', coins);
}

// 添加物品到背包
function addItemToBackpack(itemId, quantity = 1) {
    // 检查物品是否已在背包中
    const existingItem = backpack.find(item => item.id === itemId);
    
    if (existingItem) {
        // 如果已存在，增加数量
        existingItem.quantity += quantity;
    } else {
        // 如果不存在，添加新物品
        backpack.push({
            id: itemId,
            quantity: quantity
        });
    }
    
    // 如果是金币，同时更新全局金币数量
    if (itemId === 'coin') {
        coins = existingItem ? existingItem.quantity : quantity;
        // 更新金币显示
        if (coinCount) coinCount.textContent = coins;
        if (customizeCoinCount) customizeCoinCount.textContent = coins;
    }
}

// 更新背包界面
function updateBackpackScreen() {
    const backpackGrid = document.querySelector('.backpack-grid');
    if (!backpackGrid) return;
    
    // 清空背包格子
    backpackGrid.innerHTML = '';
    
    // 添加金币物品
    const coinItem = document.createElement('div');
    coinItem.className = 'backpack-item';
    coinItem.innerHTML = `
        <div class="backpack-item-icon" style="background-image: url('${itemData.coin.icon}');"></div>
        <div class="backpack-item-name">${itemData.coin.name}</div>
        <div class="backpack-item-count">${coins}</div>
    `;
    backpackGrid.appendChild(coinItem);
    
    // 添加其他物品
    backpack.forEach(item => {
        if (item.id !== 'coin') {
            const itemElement = document.createElement('div');
            itemElement.className = 'backpack-item';
            itemElement.innerHTML = `
                <div class="backpack-item-icon" style="background-image: url('${itemData[item.id].icon}');"></div>
                <div class="backpack-item-name">${itemData[item.id].name}</div>
                <div class="backpack-item-count">${item.quantity}</div>
            `;
            
            // 添加点击事件
            itemElement.addEventListener('click', () => {
                if (item.id === 'letter') {
                    // 显示信纸弹窗
                    document.getElementById('letterPopup').classList.add('active');
                }
            });
            
            backpackGrid.appendChild(itemElement);
        }
    });
}

// 绑定背包相关事件
function bindBackpackEvents() {
    // 背包按钮点击事件
    const backpackButton = document.getElementById('backpackButton');
    if (backpackButton) {
        backpackButton.addEventListener('click', () => {
            showScreen(document.getElementById('backpackScreen'));
            updateBackpackScreen();
        });
    }
    
    // 从背包返回主界面
    const backToStartFromBackpack = document.getElementById('backToStartFromBackpack');
    if (backToStartFromBackpack) {
        backToStartFromBackpack.addEventListener('click', () => {
            showScreen(startScreen);
        });
    }
    
    // 关闭信纸弹窗
    const closeLetter = document.getElementById('closeLetter');
    if (closeLetter) {
        closeLetter.addEventListener('click', () => {
            document.getElementById('letterPopup').classList.remove('active');
        });
    }
}

// 绑定商城商品事件
function bindShopItemEvents() {
    const shopItems = document.querySelectorAll('.shop-item');
    shopItems.forEach(item => {
        const buyButton = item.querySelector('.shop-item-buy');
        if (buyButton) {
            buyButton.addEventListener('click', () => {
                const itemId = item.dataset.item;
                
                if (itemId === 'letter') {
                    // 购买作者给你的信
                    addItemToBackpack('letter', 1);
                    alert('已购买并添加到背包');
                }
            });
        }
    });
}

// 绑定自定义皮肤上传事件
function bindCustomSkinUploadEvent() {
    const customSkinUpload = document.getElementById('customSkinUpload');
    if (customSkinUpload) {
        customSkinUpload.addEventListener('click', function(e) {
            e.preventDefault();
            // 打开自定义皮肤信息设置弹窗
            const customSkinInfoModal = document.getElementById('customSkinInfoModal');
            if (customSkinInfoModal) {
                customSkinInfoModal.style.display = 'flex';
            }
        });
    }
    
    // 绑定自定义皮肤信息设置弹窗事件
    const customSkinUploadBtn = document.getElementById('customSkinUploadBtn');
    const startCropBtn = document.getElementById('startCropBtn');
    const saveCustomSkinBtn = document.getElementById('saveCustomSkinBtn');
    const cancelCustomSkinBtn = document.getElementById('cancelCustomSkinBtn');
    
    if (customSkinUploadBtn) {
        customSkinUploadBtn.addEventListener('change', handleCustomSkinFileSelect);
    }
    
    if (startCropBtn) {
        startCropBtn.addEventListener('click', handleStartCrop);
    }
    
    if (saveCustomSkinBtn) {
        saveCustomSkinBtn.addEventListener('click', handleSaveCustomSkin);
    }
    
    if (cancelCustomSkinBtn) {
        cancelCustomSkinBtn.addEventListener('click', handleCancelCustomSkin);
    }
    
    // 绑定裁剪弹窗事件
    const confirmCrop = document.getElementById('confirmCrop');
    const cancelCrop = document.getElementById('cancelCrop');
    
    if (confirmCrop) {
        confirmCrop.addEventListener('click', handleConfirmCrop);
    }
    
    if (cancelCrop) {
        cancelCrop.addEventListener('click', handleCancelCrop);
    }
}

// 处理自定义皮肤文件选择
function handleCustomSkinFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const customSkinPreview = document.getElementById('customSkinPreview');
        if (customSkinPreview) {
            customSkinPreview.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// 裁剪相关变量
let cropBox = null;
let cropImage = null;
let isDragging = false;
let isResizing = false;
let dragStart = { x: 0, y: 0 };
let resizeHandle = null;

// 初始化裁剪功能
function initCrop() {
    cropImage = document.getElementById('cropImage');
    cropBox = document.getElementById('cropBox');
    
    if (!cropImage || !cropBox) return;
    
    // 重置裁剪框位置和大小
    resetCropBox();
    
    // 绑定事件
    bindCropEvents();
}

// 重置裁剪框
function resetCropBox() {
    if (!cropImage || !cropBox) return;
    
    // 等待图片加载完成
    cropImage.onload = function() {
        const container = document.querySelector('.crop-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const imageWidth = cropImage.width;
        const imageHeight = cropImage.height;
        
        // 计算图片缩放比例，使图片适应容器
        const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
        cropImage.style.width = (imageWidth * scale) + 'px';
        cropImage.style.height = (imageHeight * scale) + 'px';
        
        // 居中图片
        cropImage.style.left = ((containerWidth - imageWidth * scale) / 2) + 'px';
        cropImage.style.top = ((containerHeight - imageHeight * scale) / 2) + 'px';
        
        // 设置裁剪框大小为图片的80%
        const boxSize = Math.min(imageWidth * scale, imageHeight * scale) * 0.8;
        cropBox.style.width = boxSize + 'px';
        cropBox.style.height = boxSize + 'px';
        
        // 居中裁剪框
        cropBox.style.left = ((containerWidth - boxSize) / 2) + 'px';
        cropBox.style.top = ((containerHeight - boxSize) / 2) + 'px';
    };
}

// 绑定裁剪事件
function bindCropEvents() {
    if (!cropImage || !cropBox) return;
    
    // 裁剪框拖动
    cropBox.addEventListener('mousedown', startDrag);
    
    // 裁剪框调整大小
    const handles = cropBox.querySelectorAll('.crop-handle');
    handles.forEach(handle => {
        handle.addEventListener('mousedown', startResize);
    });
    
    // 图片拖动
    cropImage.addEventListener('mousedown', startImageDrag);
    
    // 鼠标移动
    document.addEventListener('mousemove', handleMouseMove);
    
    // 鼠标释放
    document.addEventListener('mouseup', stopDrag);
}

// 开始拖动
function startDrag(e) {
    if (e.target.classList.contains('crop-handle')) return;
    isDragging = true;
    dragStart.x = e.clientX - cropBox.getBoundingClientRect().left;
    dragStart.y = e.clientY - cropBox.getBoundingClientRect().top;
}

// 开始调整大小
function startResize(e) {
    isResizing = true;
    resizeHandle = e.target;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    e.stopPropagation();
}

// 开始拖动图片
function startImageDrag(e) {
    isDragging = true;
    dragStart.x = e.clientX - cropImage.getBoundingClientRect().left;
    dragStart.y = e.clientY - cropImage.getBoundingClientRect().top;
    e.stopPropagation();
}

// 处理鼠标移动
function handleMouseMove(e) {
    if (!isDragging && !isResizing) return;
    
    const container = document.querySelector('.crop-container');
    const containerRect = container.getBoundingClientRect();
    
    if (isDragging) {
        if (e.target === cropImage) {
            // 拖动图片
            let newLeft = e.clientX - containerRect.left - dragStart.x;
            let newTop = e.clientY - containerRect.top - dragStart.y;
            
            // 限制图片在容器内
            newLeft = Math.max(0, Math.min(newLeft, containerRect.width - cropImage.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, containerRect.height - cropImage.offsetHeight));
            
            cropImage.style.left = newLeft + 'px';
            cropImage.style.top = newTop + 'px';
        } else {
            // 拖动裁剪框
            let newLeft = e.clientX - containerRect.left - dragStart.x;
            let newTop = e.clientY - containerRect.top - dragStart.y;
            
            // 限制裁剪框在容器内
            newLeft = Math.max(0, Math.min(newLeft, containerRect.width - cropBox.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, containerRect.height - cropBox.offsetHeight));
            
            cropBox.style.left = newLeft + 'px';
            cropBox.style.top = newTop + 'px';
        }
    } else if (isResizing) {
        // 调整裁剪框大小
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const currentLeft = parseInt(cropBox.style.left) || 0;
        const currentTop = parseInt(cropBox.style.top) || 0;
        const currentWidth = cropBox.offsetWidth;
        const currentHeight = cropBox.offsetHeight;
        
        let newWidth = currentWidth;
        let newHeight = currentHeight;
        let newLeft = currentLeft;
        let newTop = currentTop;
        
        if (resizeHandle.classList.contains('crop-handle-br')) {
            // 右下角调整
            newWidth = Math.max(50, e.clientX - containerRect.left - currentLeft);
            newHeight = Math.max(50, e.clientY - containerRect.top - currentTop);
        } else if (resizeHandle.classList.contains('crop-handle-tl')) {
            // 左上角调整
            newWidth = Math.max(50, currentWidth + currentLeft - (e.clientX - containerRect.left));
            newHeight = Math.max(50, currentHeight + currentTop - (e.clientY - containerRect.top));
            newLeft = Math.min(currentLeft, e.clientX - containerRect.left);
            newTop = Math.min(currentTop, e.clientY - containerRect.top);
        } else if (resizeHandle.classList.contains('crop-handle-tr')) {
            // 右上角调整
            newWidth = Math.max(50, e.clientX - containerRect.left - currentLeft);
            newHeight = Math.max(50, currentHeight + currentTop - (e.clientY - containerRect.top));
            newTop = Math.min(currentTop, e.clientY - containerRect.top);
        } else if (resizeHandle.classList.contains('crop-handle-bl')) {
            // 左下角调整
            newWidth = Math.max(50, currentWidth + currentLeft - (e.clientX - containerRect.left));
            newHeight = Math.max(50, e.clientY - containerRect.top - currentTop);
            newLeft = Math.min(currentLeft, e.clientX - containerRect.left);
        }
        
        // 保持正方形
        newWidth = Math.min(newWidth, containerWidth - newLeft);
        newHeight = Math.min(newHeight, containerHeight - newTop);
        const size = Math.min(newWidth, newHeight);
        
        cropBox.style.width = size + 'px';
        cropBox.style.height = size + 'px';
        cropBox.style.left = newLeft + 'px';
        cropBox.style.top = newTop + 'px';
    }
}

// 停止拖动
function stopDrag() {
    isDragging = false;
    isResizing = false;
    resizeHandle = null;
}

// 处理开始裁剪
function handleStartCrop() {
    const customSkinPreview = document.getElementById('customSkinPreview');
    if (!customSkinPreview || !customSkinPreview.src) {
        alert('请先选择一张图片');
        return;
    }
    
    const cropModal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');
    
    if (cropModal && cropImage) {
        cropImage.src = customSkinPreview.src;
        cropModal.style.display = 'flex';
        
        // 初始化裁剪功能
        setTimeout(initCrop, 100);
    }
}

// 存储自定义皮肤名称
let customSkinName = '自定义皮肤';

// 处理保存自定义皮肤
function handleSaveCustomSkin() {
    const skinName = document.getElementById('customSkinName').value;
    if (!skinName) {
        alert('请输入皮肤名称');
        return;
    }
    
    if (!customSkin) {
        alert('请先上传并裁剪图片');
        return;
    }
    
    // 保存自定义皮肤信息
    customSkinName = skinName;
    
    // 添加自定义皮肤到拥有的皮肤列表
    if (!ownedSkins.includes('custom')) {
        ownedSkins.push('custom');
    }
    
    // 设置为当前皮肤
    currentSkin = 'custom';
    
    // 关闭自定义皮肤信息设置弹窗
    document.getElementById('customSkinInfoModal').style.display = 'none';
    
    // 更新换装界面
    updateCustomizeScreen();
    
    // 显示成功提示
    alert('自定义皮肤已保存并装备');
}

// 处理取消自定义皮肤
function handleCancelCustomSkin() {
    document.getElementById('customSkinInfoModal').style.display = 'none';
}

// 处理裁剪确认
function handleConfirmCrop() {
    const cropImage = document.getElementById('cropImage');
    const cropBox = document.getElementById('cropBox');
    if (!cropImage || !cropBox) return;
    
    // 获取裁剪框和图片的位置和大小
    const container = document.querySelector('.crop-container');
    const containerRect = container.getBoundingClientRect();
    const cropBoxRect = cropBox.getBoundingClientRect();
    const cropImageRect = cropImage.getBoundingClientRect();
    
    // 计算裁剪区域相对于图片的位置和大小
    const scaleX = cropImage.width / parseFloat(cropImage.style.width);
    const scaleY = cropImage.height / parseFloat(cropImage.style.height);
    
    const cropX = (cropBoxRect.left - cropImageRect.left) * scaleX;
    const cropY = (cropBoxRect.top - cropImageRect.top) * scaleY;
    const cropWidth = cropBoxRect.width * scaleX;
    const cropHeight = cropBoxRect.height * scaleY;
    
    // 创建canvas用于裁剪
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // 绘制并裁剪图片
    ctx.drawImage(cropImage, cropX, cropY, cropWidth, cropHeight, 0, 0, 200, 200);
    
    // 转换为图片对象
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    img.onload = function() {
        customSkin = img;
        
        // 关闭裁剪弹窗
        document.getElementById('cropModal').style.display = 'none';
        
        // 更新预览
        const customSkinPreview = document.getElementById('customSkinPreview');
        if (customSkinPreview) {
            customSkinPreview.src = img.src;
        }
    };
}

// 处理裁剪取消
function handleCancelCrop() {
    document.getElementById('cropModal').style.display = 'none';
}

// 更新showScreen函数，添加对背包界面和记忆回溯界面的支持
function showScreen(screen) {
    // 隐藏所有屏幕和弹窗
    startScreen.classList.remove('active');
    levelSelect.classList.remove('active');
    gameScreen.classList.remove('active');
    winPopup.classList.remove('active');
    allLevelsCompletePopup.classList.remove('active');
    gameOverPopup.classList.remove('active');
    shopScreen.classList.remove('active');
    customizeScreen.classList.remove('active');
    document.getElementById('backpackScreen').classList.remove('active');
    document.getElementById('letterPopup').classList.remove('active');
    memoryScreen.classList.remove('active');
    
    // 显示目标屏幕
    screen.classList.add('active');
    
    // 如果显示的是关卡选择界面，更新关卡状态
    if (screen === levelSelect) {
        updateLevelSelect();
    }
    
    // 如果显示的是商城界面，更新金币显示
    if (screen === shopScreen && coinCount) {
        coinCount.textContent = coins;
    }
    
    // 如果显示的是换装界面，更新预览和皮肤状态
    if (screen === customizeScreen) {
        updateCustomizeScreen();
    }
    
    // 如果显示的是背包界面，更新背包内容
    if (screen.id === 'backpackScreen') {
        updateBackpackScreen();
    }
}

// 存档功能
function saveGame() {
    // 收集游戏数据
    const gameData = {
        coins: coins,
        currentSkin: currentSkin,
        ownedSkins: ownedSkins,
        customSkin: customSkin ? customSkin.src : null,
        customSkinName: customSkinName,
        backpack: backpack,
        keybindings: keybindings,
        unlockedLevels: unlockedLevels,
        levelStars: levelStars
    };
    
    // 转换为JSON字符串
    const jsonData = JSON.stringify(gameData, null, 2);
    
    // 创建Blob对象
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bee_game_save_${new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('游戏已存档');
}

// 读档功能
function loadGame() {
    const file = loadFile.files[0];
    if (!file) {
        alert('请选择存档文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const gameData = JSON.parse(e.target.result);
            
            // 加载游戏数据
            coins = gameData.coins || 0;
            currentSkin = gameData.currentSkin || 'bee';
            ownedSkins = gameData.ownedSkins || ['bee'];
            customSkinName = gameData.customSkinName || '自定义皮肤';
            backpack = gameData.backpack || [];
            keybindings = gameData.keybindings || {
                jump: ' ',
                left: 'a',
                down: 's',
                right: 'd',
                attack: 'j',
                switch: 'i'
            };
            unlockedLevels = gameData.unlockedLevels || 1;
            levelStars = gameData.levelStars || {};
            
            // 加载自定义皮肤
            if (gameData.customSkin) {
                const img = new Image();
                img.src = gameData.customSkin;
                img.onload = function() {
                    customSkin = img;
                };
            }
            
            // 保存键位设置
            saveKeybindings();
            
            // 更新界面
            updateCustomizeScreen();
            updateControlInstructions();
            updateBackpackScreen();
            updateLevelSelect();
            
            alert('游戏已读档');
        } catch (error) {
            alert('存档文件格式错误');
        }
    };
    reader.readAsText(file);
}

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
    isPaused = true; // 暂停游戏
});

// 记忆回溯按钮点击事件
memoryButton.addEventListener('click', () => {
    showScreen(memoryScreen);
});

// 返回主界面按钮点击事件
backToStartFromMemory.addEventListener('click', () => {
    showScreen(startScreen);
});

// 存档按钮点击事件
saveButton.addEventListener('click', saveGame);

// 读档按钮点击事件
loadButton.addEventListener('click', () => {
    const loadSection = document.querySelector('.load-section');
    if (loadSection) {
        loadSection.style.display = 'block';
    }
});

// 确认读档按钮点击事件
confirmLoad.addEventListener('click', loadGame);

// 设置界面按钮事件
restartFromSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    isPaused = false; // 恢复游戏
    initGame(currentLevel);
});

backToLevelSelectFromSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    isPaused = false; // 恢复游戏
    showScreen(levelSelect);
});

backToMainFromSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    isPaused = false; // 恢复游戏
    showScreen(startScreen);
});

closeSettings.addEventListener('click', () => {
    settingsPopup.classList.remove('active');
    isPaused = false; // 恢复游戏
});

// 键位设置按钮点击事件
keybindingsButton.addEventListener('click', () => {
    // 加载键位设置
    loadKeybindings();
    // 绑定键位设置事件
    bindKeybindingEvents();
    // 更新键位按钮显示
    updateKeybindingButtons();
    
    settingsPopup.classList.remove('active');
    keybindingsPopup.classList.add('active');
});

// 关闭键位设置弹窗
closeKeybindings.addEventListener('click', () => {
    keybindingsPopup.classList.remove('active');
    settingsPopup.classList.add('active');
});

// 虚拟按键事件监听器
if (btnUp) {
    // 上键 (W)
    btnUp.addEventListener('touchstart', () => keys.space = true);
    btnUp.addEventListener('touchend', () => keys.space = false);
    btnUp.addEventListener('mousedown', () => keys.space = true);
    btnUp.addEventListener('mouseup', () => keys.space = false);
    btnUp.addEventListener('mouseleave', () => keys.space = false);
}

if (btnLeft) {
    // 左键 (A)
    btnLeft.addEventListener('touchstart', () => keys.a = true);
    btnLeft.addEventListener('touchend', () => keys.a = false);
    btnLeft.addEventListener('mousedown', () => keys.a = true);
    btnLeft.addEventListener('mouseup', () => keys.a = false);
    btnLeft.addEventListener('mouseleave', () => keys.a = false);
}

if (btnDown) {
    // 下键 (S)
    btnDown.addEventListener('touchstart', () => keys.s = true);
    btnDown.addEventListener('touchend', () => keys.s = false);
    btnDown.addEventListener('mousedown', () => keys.s = true);
    btnDown.addEventListener('mouseup', () => keys.s = false);
    btnDown.addEventListener('mouseleave', () => keys.s = false);
}

if (btnRight) {
    // 右键 (D)
    btnRight.addEventListener('touchstart', () => keys.d = true);
    btnRight.addEventListener('touchend', () => keys.d = false);
    btnRight.addEventListener('mousedown', () => keys.d = true);
    btnRight.addEventListener('mouseup', () => keys.d = false);
    btnRight.addEventListener('mouseleave', () => keys.d = false);
}

if (btnAttack) {
    // 攻击键 (J)
    btnAttack.addEventListener('touchstart', () => {
        keys.j = true;
        attack();
    });
    btnAttack.addEventListener('touchend', () => keys.j = false);
    btnAttack.addEventListener('mousedown', () => {
        keys.j = true;
        attack();
    });
    btnAttack.addEventListener('mouseup', () => keys.j = false);
    btnAttack.addEventListener('mouseleave', () => keys.j = false);
}

if (btnSwitch) {
    // 切换武器键 (I)
    btnSwitch.addEventListener('touchstart', () => {
        keys.i = true;
        switchWeapon();
    });
    btnSwitch.addEventListener('touchend', () => keys.i = false);
    btnSwitch.addEventListener('mousedown', () => {
        keys.i = true;
        switchWeapon();
    });
    btnSwitch.addEventListener('mouseup', () => keys.i = false);
    btnSwitch.addEventListener('mouseleave', () => keys.i = false);
}

// 开始游戏
gameLoop();