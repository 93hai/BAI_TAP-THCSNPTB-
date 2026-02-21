const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const armorManager = require('mineflayer-armor-manager');

const bot = mineflayer.createBot({
    host: '192.168.6.12',
    port: 25565,
    username: 'putin',
    version: false,
    checkTimeoutInterval: 60000
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(armorManager);

const PASSWORD = '18022012hd';
let isEating = false;


// --- BIẾN TỐI ƯU ---
let tickCounter = 0;
let lastTargetPos = null;
let currentGoalDistance = null;

// --- BIẾN TOÀN CỤC CHO S-TAP ---
let isStepping = false;
let lastDamageTime = 0;
let lastHealth = 20;

// --- BIẾN TOÀN CỤC CHO SHIELD SPLITTER ---
let shieldBreakCooldown = 0;
let targetWasShielding = false;
let lastWeaponSwitch = 0; // MỚI: Tránh spam equip

// --- BIẾN TOÀN CỤC CHO INVENTORY ---
let lastInventoryClean = 0;

// --- HÀM TÌM ITEM ---
function getBestItem(namePart) {
    if (!bot.inventory) return null;
    return bot.inventory.items()
        .filter(item => item.name.includes(namePart))
        .sort((a, b) => (b.attackDamage || 0) - (a.attackDamage || 0))[0];
}

// --- BIẾN TOÀN CỤC CHO CIRCLE STRAFE ---
let strafeDirection = Math.random() > 0.5 ? 'left' : 'right';
let lastStrafeSwitch = 0;
let strafeInterval = 2000 + Math.random() * 2000;

// --- HÀM CIRCLE STRAFE (ĐÃ FIX + ANTI-AIR AIM) ---
function circleStrafe(target) {
    // **FIX 1: KHÔNG STRAFE KHI ĐANG S-TAP**
    if (!target || !bot.entity || isStepping) return;

    const distance = bot.entity.position.distanceTo(target.position);

    if (distance < 2 || distance > 5) {
        bot.setControlState('left', false);
        bot.setControlState('right', false);
        bot.setControlState('forward', false);
        return;
    }

    // **ANTI-AIR AIM: Nhìn lên cao nếu đối thủ đang bay/nhảy Mace**
    if (tickCounter % 5 === 0) {
        const targetY = target.position.y > bot.entity.position.y + 1.5 ?
            target.position.y + target.height // Nhìn thẳng lên đầu
            :
            target.position.y + target.height * 0.8; // Nhìn thân người

        bot.lookAt(target.position.offset(0, targetY - target.position.y, 0));
    }

    const now = Date.now();
    if (now - lastStrafeSwitch > strafeInterval) {
        strafeDirection = Math.random() > 0.5 ? 'left' : 'right';
        lastStrafeSwitch = now;
        strafeInterval = 2000 + Math.random() * 2000;
    }

    if (strafeDirection === 'left') {
        bot.setControlState('left', true);
        bot.setControlState('right', false);
    } else {
        bot.setControlState('right', true);
        bot.setControlState('left', false);
    }

    bot.setControlState('forward', true);
}

// --- HÀM TẮT STRAFE ---
function stopStrafe() {
    bot.setControlState('left', false);
    bot.setControlState('right', false);
    bot.setControlState('forward', false);
}

// --- HÀM S-TAP COMBO BREAKER (ĐÃ FIX) ---
function sTapComboBreaker() {
    if (!bot.entity || isStepping) return;

    const now = Date.now();
    const tookDamage = bot.health < lastHealth;

    if (tookDamage && now - lastDamageTime < 500) {
        isStepping = true;

        // **TẮT TẤT CẢ DI CHUYỂN KHÁC**
        stopStrafe();

        // LÙI LẠI NHANH
        bot.setControlState('back', true);
        bot.setControlState('forward', false);

        setTimeout(() => {
            bot.setControlState('back', false);
            bot.setControlState('sprint', true);
            isStepping = false;
        }, 100);
    }

    if (tookDamage) {
        lastDamageTime = now;
    }

    lastHealth = bot.health;
}

// --- HÀM SHIELD SPLITTER (ĐÃ FIX) ---
async function shieldSplitter(target) {
    if (isEating || !target) return;

    const now = Date.now();
    const isTargetShielding = target.metadata && target.metadata[8] === 3;
    const sword = getBestItem('sword');
    const axe = getBestItem('axe');

    if (isTargetShielding && !targetWasShielding && axe) {
        // MỤC TIÊU VỪA GIƠ KHIÊN → CHUYỂN RÌU
        if (now - shieldBreakCooldown > 3000) {
            await bot.equip(axe, 'hand').catch(() => {});
            shieldBreakCooldown = now;
            lastWeaponSwitch = now;

            // SAU 500MS ĐỔI LẠI KIẾM
            setTimeout(async() => {
                if (sword) {
                    await bot.equip(sword, 'hand').catch(() => {});
                    lastWeaponSwitch = Date.now();
                }
            }, 500);
        }
    } else if (!isTargetShielding && sword) {
        // **FIX 2: CHỈ ĐỔI KIẾM KHI CẦN VÀ TRÁNH SPAM**
        const currentWeapon = bot.inventory.slots[bot.getEquipmentDestSlot('hand')];

        // Chỉ đổi nếu: không cầm kiếm VÀ đã qua 1 giây kể từ lần đổi trước
        if ((!currentWeapon || !currentWeapon.name.includes('sword')) &&
            now - lastWeaponSwitch > 1000) {
            await bot.equip(sword, 'hand').catch(() => {});
            lastWeaponSwitch = now;
        }
    }

    targetWasShielding = isTargetShielding;
}

// --- DANH SÁCH VẬT PHẨM RÁC ---
const JUNK_ITEMS = [
    'dirt', 'cobblestone', 'stone', 'gravel', 'sand',
    'wheat_seeds', 'beetroot_seeds', 'melon_seeds',
    'rotten_flesh', 'bone', 'string', 'spider_eye',
    'poisonous_potato', 'stick', 'feather'
];

// --- HÀM DỌN DẸP KHO ĐỒ ---
async function cleanInventory() {
    if (!bot.inventory) return;

    const now = Date.now();
    if (now - lastInventoryClean < 5000) return;

    lastInventoryClean = now;

    try {
        for (const item of bot.inventory.items()) {
            // Vứt rác
            if (JUNK_ITEMS.some(junk => item.name.includes(junk))) {
                await bot.toss(item.type, null, item.count);
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            // Vứt giáp hỏng
            if (item.name.includes('helmet') || item.name.includes('chestplate') ||
                item.name.includes('leggings') || item.name.includes('boots')) {
                const maxDurability = item.maxDurability || 100;
                const durability = maxDurability - (item.durabilityUsed || 0);
                const durabilityPercent = (durability / maxDurability) * 100;

                if (durabilityPercent < 20) {
                    await bot.toss(item.type, null, item.count);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        // Đưa táo vàng vào hotbar
        const gapple = bot.inventory.items().find(item => item.name.includes('golden_apple'));
        if (gapple && gapple.slot > 8) {
            for (let slot = 0; slot <= 8; slot++) {
                if (!bot.inventory.slots[slot]) {
                    await bot.moveSlotItem(gapple.slot, slot);
                    break;
                }
            }
        }

    } catch (e) {
        console.log('Lỗi khi dọn kho:', e.message);
    }
}

// --- LOGIC TAY TRÁI ---
async function handleOffhand() {
    if (!bot.inventory) return;
    const offhandItem = bot.inventory.slots[bot.getEquipmentDestSlot('off-hand')];
    const totem = bot.inventory.items().find(item => item.name === 'totem_of_undying');
    const shield = bot.inventory.items().find(item => item.name === 'shield');

    if (totem) {
        if (!offhandItem || offhandItem.name !== 'totem_of_undying') {
            await bot.equip(totem, 'off-hand').catch(() => {});
        }
    } else if (shield) {
        if (!offhandItem || offhandItem.name !== 'shield') {
            await bot.equip(shield, 'off-hand').catch(() => {});
        }
    }
}

// --- LOGIC HỒI MÁU ---
async function eatApple() {
    try {
        const gapple = bot.inventory.items().find(item => item.name.includes('golden_apple'));
        if (bot.health < 12 && gapple && !isEating) {
            isEating = true;
            const currentTarget = bot.pvp && bot.pvp.target;
            if (bot.pvp && bot.pvp.stop) bot.pvp.stop();
            await bot.equip(gapple, 'hand');
            if (bot.activateItem) bot.activateItem();
            await new Promise(resolve => setTimeout(resolve, 1800));
            if (bot.deactivateItem) bot.deactivateItem();
            isEating = false;
            if (currentTarget && bot.pvp && bot.pvp.attack) bot.pvp.attack(currentTarget);
        }
    } catch (e) {}
}

// --- PHYSICS TICK ---
bot.on('physicsTick', () => {
    if (!bot.entity) return;

    tickCounter++;

    if (tickCounter % 20 === 0) {
        handleOffhand().catch(() => {});
    }

    if (tickCounter % 10 === 0) {
        eatApple().catch(() => {});
    }

    if (bot.pvp.target && !isEating) {
        const target = bot.pvp.target;
        const dist = bot.entity.position.distanceTo(target.position);

        // **S-TAP COMBO BREAKER**
        sTapComboBreaker();

        // **SHIELD SPLITTER**
        if (tickCounter % 10 === 0) {
            shieldSplitter(target).catch(() => {});
        }

        // **LOGIC DI CHUYỂN (chỉ khi KHÔNG đang S-Tap)**
        if (!isStepping) {
            if (dist < 4) {
                if (currentGoalDistance !== 'strafe') {
                    bot.pathfinder.setGoal(null);
                    currentGoalDistance = 'strafe';
                }
                circleStrafe(target);
            } else {
                stopStrafe();

                const targetMoved = !lastTargetPos ||
                    target.position.distanceTo(lastTargetPos) > 2;

                const goalDistanceChanged = currentGoalDistance !== dist;

                if (targetMoved || goalDistanceChanged || tickCounter % 20 === 0) {
                    const followDist = (target.metadata[8] === 3) ? 1 : 2.5;
                    bot.pathfinder.setGoal(new goals.GoalFollow(target, followDist), true);
                    lastTargetPos = target.position.clone();
                    currentGoalDistance = dist;
                }
            }
        }

        const shouldJump = bot.entity.onGround && dist < 3.2;
        bot.setControlState('jump', shouldJump);

    } else {
        stopStrafe();
        lastTargetPos = null;
        currentGoalDistance = null;

        // DỌN DẸP KHO
        if (tickCounter % 100 === 0) {
            cleanInventory().catch(() => {});
        }
    }
});

bot.once('spawn', () => {
    console.log('Putin đã trở lại, lợi hại hơn xưa!');
    setTimeout(() => bot.chat(`/login ${PASSWORD}`), 2000);
    bot.pathfinder.setMovements(new Movements(bot));
});

bot.on('playerCollect', () => {
    setTimeout(() => {
        if (bot.armorManager) bot.armorManager.equipAll();
    }, 200);
});

bot.on('chat', async(username, message) => {
    if (username === bot.username) return;
    const args = message.split(' ').filter(arg => arg.length > 0);

    if (args[0] === 'attack') {
        if (!args[1]) {
            bot.chat('Cú pháp: attack <player_name>');
            return;
        }
        const player = bot.players[args[1]];
        if (!player || !player.entity) {
            bot.chat(`Không tìm thấy: ${args[1]}`);
            return;
        }
        bot.chat(`Đang bắt combo: ${args[1]}!`);
        bot.pathfinder.setGoal(new goals.GoalFollow(player.entity, 2.5), true);
        bot.pvp.attack(player.entity);
    }

    if (message === 'stop') {
        bot.pvp.stop();
        bot.pathfinder.setGoal(null);
        stopStrafe();
    }
});

bot.on('error', (err) => {
    if (err.name === 'PartialReadError') return;
    console.log('Lỗi:', err.message);
});
