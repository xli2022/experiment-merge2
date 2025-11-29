import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type GameState, type Cell, type ItemType, type Order, type SpawnAnimation, type Notification } from '../types/game';
import { ITEM_CONFIG, GENERATOR_CONFIG, TASK_LIST, LEVEL_CONFIG } from '../config';

interface GameStore extends GameState {
    initGrid: (rows: number, cols: number) => void;
    moveItem: (fromId: string, toId: string) => void;
    deleteItem: (itemId: string) => void;
    spawnItem: (cellId: string) => void;
    consumeEnergy: (amount: number) => boolean;
    addCurrency: (type: 'coins' | 'gems', amount: number) => void;
    setSelectedItem: (id: string | null) => void;
    generateOrder: () => boolean;
    completeOrder: (orderId: string) => void;
    restoreEnergy: (amount: number) => void;
    completeTask: (taskId: string) => void;
    purchaseEnergy: () => void;
    setShowEnergyPurchase: (show: boolean) => void;
    addSpawnAnimation: (animation: SpawnAnimation) => void;
    removeSpawnAnimation: (id: string) => void;
    showNotification: (message: string, type: Notification['type']) => void;
    clearNotification: () => void;
    addCoinAnimation: (fromX: number, fromY: number, amount: number, toX?: number, toY?: number) => void;
    removeCoinAnimation: (id: string) => void;
    processOfflineProgress: () => void;
}

const createGrid = (rows: number, cols: number): Cell[] => {
    const grid: Cell[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid.push({
                id: `${r}-${c}`,
                row: r,
                col: c,
                item: null,
            });
        }
    }

    // Initial state: One Level 1 Bread Generator
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const centerIndex = centerRow * cols + centerCol;

    grid[centerIndex].item = {
        id: crypto.randomUUID(),
        type: 'generator_bread',
        level: 1,
        maxLevel: Object.keys(ITEM_CONFIG['generator_bread'].levels).length
    };

    return grid;
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            grid: [],
            energy: 100,
            maxEnergy: 100,
            coins: 0,
            gems: 100,
            level: 1,
            xp: 0,
            selectedItemId: null,
            orders: [],
            tasks: TASK_LIST.map(task => ({ ...task, completed: false })),
            // UI state (non-persistent)
            spawnAnimations: [],
            notification: null,
            coinAnimations: [],
            showEnergyPurchase: false,
            lastEnergyUpdateTime: Date.now(),

            initGrid: (rows, cols) => {
                // Initialize with empty grid
                const grid = createGrid(rows, cols);

                // Initial state: One Level 1 Bread Generator
                const centerRow = Math.floor(rows / 2);
                const centerCol = Math.floor(cols / 2);
                const centerIndex = centerRow * cols + centerCol;

                grid[centerIndex].item = {
                    id: crypto.randomUUID(),
                    type: 'generator_bread',
                    level: 1,
                    maxLevel: Object.keys(ITEM_CONFIG['generator_bread'].levels).length
                };

                set({ grid });
            },

            moveItem: (fromId, toId) => {
                const { grid } = get();
                const newGrid = [...grid];
                const fromCellIndex = newGrid.findIndex((c) => c.id === fromId);
                const toCellIndex = newGrid.findIndex((c) => c.id === toId);

                if (fromCellIndex === -1 || toCellIndex === -1 || fromId === toId) return;

                const fromCell = newGrid[fromCellIndex];
                const toCell = newGrid[toCellIndex];

                if (!fromCell.item) return;

                // Case 1: Move to empty cell
                if (!toCell.item) {
                    toCell.item = fromCell.item;
                    fromCell.item = null;
                }
                // Case 2: Merge
                else if (
                    toCell.item.type === fromCell.item.type &&
                    toCell.item.level === fromCell.item.level &&
                    toCell.item.level < toCell.item.maxLevel
                ) {
                    toCell.item = {
                        ...toCell.item,
                        level: toCell.item.level + 1,
                        id: crypto.randomUUID(), // New ID for merged item
                    };
                    fromCell.item = null;
                    // Select the newly merged item
                    set({ selectedItemId: toCell.item.id });
                    // TODO: Add XP or other merge effects
                }
                // Case 3: Swap (if not merging and not empty) - Optional, usually games just swap or bounce back
                // For now, let's just swap if types are different or max level reached
                else {
                    const temp = toCell.item;
                    toCell.item = fromCell.item;
                    fromCell.item = temp;
                }

                set({ grid: newGrid });
            },

            spawnItem: (cellId) => {
                const { grid, energy, consumeEnergy, addSpawnAnimation, spawnAnimations, showNotification } = get();

                if (energy <= 0) {
                    // Show purchase popup if player has enough gems
                    if (get().gems >= 10) {
                        set({ showEnergyPurchase: true });
                    }
                    return;
                }

                const generatorCell = grid.find(c => c.id === cellId);
                if (!generatorCell || !generatorCell.item) return;

                // Get cells that have pending spawns
                const pendingSpawnCellIds = new Set(spawnAnimations.map(a => a.toCellId));

                // Find empty cells that don't have pending spawns
                const emptyCells = grid.filter(c => c.item === null && !pendingSpawnCellIds.has(c.id));
                if (emptyCells.length === 0) {
                    showNotification('🚫 No space! Merge items to make room.', 'warning');
                    return;
                }

                if (consumeEnergy(1)) {
                    // Determine spawn type and level
                    const generatorConfig = GENERATOR_CONFIG[generatorCell.item.type]?.[generatorCell.item.level];

                    let type: ItemType = 'coffee'; // Default fallback
                    let level = 1;

                    if (generatorConfig) {
                        const rand = Math.random();
                        let cumulativeProb = 0;
                        for (const itemConfig of generatorConfig) {
                            cumulativeProb += itemConfig.probability;
                            if (rand < cumulativeProb) {
                                type = itemConfig.type;
                                level = itemConfig.level || 1;
                                break;
                            }
                        }
                    }

                    // Find closest empty cell
                    const sortedCells = emptyCells.sort((a, b) => {
                        const distA = Math.abs(a.row - generatorCell.row) + Math.abs(a.col - generatorCell.col);
                        const distB = Math.abs(b.row - generatorCell.row) + Math.abs(b.col - generatorCell.col);
                        return distA - distB;
                    });

                    const targetCell = sortedCells[0];
                    const newItem = {
                        id: crypto.randomUUID(),
                        type,
                        level,
                        maxLevel: Object.keys(ITEM_CONFIG[type].levels).length,
                    };

                    // Create animation
                    const animation = {
                        id: crypto.randomUUID(),
                        item: newItem,
                        fromCellId: cellId,
                        toCellId: targetCell.id,
                        startTime: Date.now(),
                    };

                    addSpawnAnimation(animation);

                    // Add item to grid after animation completes (400ms)
                    setTimeout(() => {
                        const currentGrid = get().grid;
                        const newGrid = [...currentGrid];
                        const cellIndex = newGrid.findIndex(c => c.id === targetCell.id);

                        if (cellIndex !== -1 && !newGrid[cellIndex].item) {
                            newGrid[cellIndex].item = newItem;
                            set({ grid: newGrid });
                        }

                        // Remove animation
                        get().removeSpawnAnimation(animation.id);
                    }, 400);
                }
            },

            consumeEnergy: (amount) => {
                const { energy } = get();
                if (energy >= amount) {
                    const newEnergy = energy - amount;
                    set({ energy: newEnergy, lastEnergyUpdateTime: Date.now() });
                    return true;
                }
                return false;
            },

            addCurrency: (type, amount) => {
                set((state) => ({ [type]: state[type] + amount }));
            },

            setSelectedItem: (itemId) => {
                set({ selectedItemId: itemId });
            },

            deleteItem: (itemId) => {
                const { grid, selectedItemId } = get();
                const cell = grid.find(c => c.item?.id === itemId);

                if (cell) {
                    const newGrid = [...grid];
                    const cellIndex = newGrid.findIndex(c => c.id === cell.id);
                    newGrid[cellIndex] = { ...newGrid[cellIndex], item: null };
                    set({
                        grid: newGrid,
                        selectedItemId: selectedItemId === itemId ? null : selectedItemId
                    });
                }
            },

            generateOrder: () => {
                const { orders, grid, level } = get();
                const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG[10]; // Fallback to max level config
                const maxOrdersForLevel = levelConfig.maxOrders;
                if (orders.length >= maxOrdersForLevel) return false; // Max orders based on player level

                // 1. Identify active generators
                const activeGenerators = new Set<string>();
                grid.forEach(cell => {
                    if (cell.item) {
                        if (cell.item.type === 'generator_coffee') activeGenerators.add('coffee');
                        if (cell.item.type === 'generator_bread') activeGenerators.add('bread');
                        // Tea is produced by high-level coffee generators (level 2+)
                        if (cell.item.type === 'generator_coffee' && cell.item.level >= 2) activeGenerators.add('tea');
                    }
                });

                // 2. Filter items by rarity > 0 and prepare weighted selection
                const viableItems = Array.from(activeGenerators)
                    .filter(type => ITEM_CONFIG[type as ItemType].rarity > 0)
                    .map(type => ({
                        type: type as ItemType,
                        rarity: ITEM_CONFIG[type as ItemType].rarity
                    }));

                if (viableItems.length === 0) return false; // No viable items to order

                // Helper function for weighted random selection
                const weightedRandom = (items: { type: ItemType; rarity: number }[]) => {
                    const totalWeight = items.reduce((sum, item) => sum + item.rarity, 0);
                    let random = Math.random() * totalWeight;
                    for (const item of items) {
                        random -= item.rarity;
                        if (random <= 0) return item.type;
                    }
                    return items[items.length - 1].type; // Fallback
                };

                // 3. Generate items
                const maxItemsPerOrder = 3; // Hardcoded
                const rewardMultiplier = 10; // Hardcoded
                const numItems = Math.floor(Math.random() * maxItemsPerOrder) + 1;
                const items = [];
                let totalRewardCoins = 0;

                // Get level cap for current player level
                const maxItemLevel = levelConfig.maxItemLevel;

                for (let i = 0; i < numItems; i++) {
                    const itemType = weightedRandom(viableItems);

                    // Default max level is 6 if not capped by player level
                    const itemMaxLevel = 6;
                    const effectiveMaxLevel = Math.min(itemMaxLevel, maxItemLevel);
                    // Default min level is 1
                    const effectiveMinLevel = 1;

                    const itemLevel = Math.floor(Math.random() * (effectiveMaxLevel - effectiveMinLevel + 1)) + effectiveMinLevel;

                    items.push({ type: itemType, level: itemLevel });
                    totalRewardCoins += itemLevel * rewardMultiplier;
                }

                const newOrder: Order = {
                    id: crypto.randomUUID(),
                    items,
                    reward: { coins: totalRewardCoins },
                };

                set({ orders: [...orders, newOrder] });
                return true;
            },

            completeOrder: (orderId) => {
                const { grid, orders, addCurrency } = get();
                const orderIndex = orders.findIndex(o => o.id === orderId);
                if (orderIndex === -1) return;

                const order = orders[orderIndex];
                const newGrid = [...grid];

                // Check if we have ALL items
                const itemIndices: number[] = [];

                for (const requiredItem of order.items) {
                    // Find an item that matches and hasn't been used yet for this order
                    const itemIndex = newGrid.findIndex((c, idx) =>
                        c.item?.type === requiredItem.type &&
                        c.item?.level === requiredItem.level &&
                        !itemIndices.includes(idx)
                    );

                    if (itemIndex === -1) return; // Missing an item
                    itemIndices.push(itemIndex);
                }

                // Remove items
                itemIndices.forEach(idx => {
                    newGrid[idx].item = null;
                });

                // Give rewards
                addCurrency('coins', order.reward.coins);
                // TODO: Add XP

                // Remove order
                const newOrders = [...orders];
                newOrders.splice(orderIndex, 1);

                set({ grid: newGrid, orders: newOrders });

                // Auto-generate orders to fill up to maxOrders
                const maxOrdersForLevel = (LEVEL_CONFIG[get().level] || LEVEL_CONFIG[10]).maxOrders;
                while (get().orders.length < maxOrdersForLevel) {
                    get().generateOrder();
                }
            },

            restoreEnergy: (amount) => {
                const { energy } = get();
                // Always bypass maxEnergy (for rewards and manual refills)
                // Do NOT update lastEnergyUpdateTime - that's only for auto-refill tracking
                set({ energy: energy + amount });
            },

            purchaseEnergy: () => {
                const { gems, energy } = get();
                if (gems >= 10) {
                    set({
                        gems: gems - 10,
                        energy: energy + 100,
                        showEnergyPurchase: false
                    });
                    get().showNotification('💎 Purchased 100 energy!', 'success');
                }
            },

            setShowEnergyPurchase: (show) => {
                set({ showEnergyPurchase: show });
            },

            completeTask: (taskId) => {
                const { coins, tasks, level, xp } = get();
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex === -1) return;

                const task = tasks[taskIndex];
                if (coins >= task.cost && !task.completed) {
                    const newTasks = [...tasks];
                    newTasks[taskIndex] = { ...task, completed: true };
                    const newXp = xp + task.xp;

                    set({
                        coins: coins - task.cost,
                        xp: newXp,
                        tasks: newTasks
                    });

                    // Check for level up
                    // LEVEL_CONFIG[N] contains the threshold and reward FOR reaching level N.
                    // So to check if we can level up FROM current level, check LEVEL_CONFIG[level + 1].
                    const nextLevelConfig = LEVEL_CONFIG[level + 1];
                    if (nextLevelConfig) {
                        const nextLevelThreshold = nextLevelConfig.xpThreshold;
                        if (newXp >= nextLevelThreshold) {
                            const newLevel = level + 1;
                            set({ level: newLevel });

                            // Give reward if configured for reaching this new level
                            const reward = nextLevelConfig.reward;
                            if (reward) {
                                // Find an empty cell
                                const { grid } = get();
                                const emptyCell = grid.find(cell => !cell.item);

                                if (emptyCell) {
                                    const newGrid = [...grid];
                                    const cellIndex = newGrid.findIndex(c => c.id === emptyCell.id);
                                    newGrid[cellIndex] = {
                                        ...emptyCell,
                                        item: {
                                            id: crypto.randomUUID(),
                                            type: reward.type,
                                            level: reward.level,
                                            maxLevel: Object.keys(ITEM_CONFIG[reward.type].levels).length
                                        }
                                    };
                                    set({ grid: newGrid });

                                    // Show notification with level
                                    get().showNotification(`🎉 You are upgraded to level ${newLevel}!`, 'success');
                                } else {
                                    // Show notification for level up but no space for reward
                                    get().showNotification(`🎉 You are upgraded to level ${newLevel}! (No space for reward)`, 'warning');
                                }

                                // Give energy reward silently (no separate notification)
                                if (reward.energy) {
                                    get().restoreEnergy(reward.energy);
                                }
                            } else {
                                // Show notification just for level up
                                get().showNotification(`Level Up! You reached Level ${newLevel}!`, 'success');
                            }
                        }
                    }
                }
            },

            addSpawnAnimation: (animation) => {
                set((state) => ({
                    spawnAnimations: [...state.spawnAnimations, animation]
                }));
            },

            removeSpawnAnimation: (id) => {
                set((state) => ({
                    spawnAnimations: state.spawnAnimations.filter(a => a.id !== id)
                }));
            },

            showNotification: (message, type) => {
                const id = crypto.randomUUID();
                set({ notification: { id, message, type } });

                // Auto-clear after 3 seconds
                setTimeout(() => {
                    set((state) => state.notification?.id === id ? { notification: null } : {});
                }, 3000);
            },

            clearNotification: () => {
                set({ notification: null });
            },

            addCoinAnimation: (fromX, fromY, amount, toX, toY) => {
                const id = crypto.randomUUID();
                set((state) => ({
                    coinAnimations: [...state.coinAnimations, { id, fromX, fromY, amount, toX, toY, startTime: Date.now() }]
                }));

                // Remove animation after it completes (800ms)
                setTimeout(() => {
                    get().removeCoinAnimation(id);
                }, 800);
            },

            removeCoinAnimation: (id) => {
                set((state) => ({
                    coinAnimations: state.coinAnimations.filter(a => a.id !== id)
                }));
            },

            processOfflineProgress: () => {
                const { lastEnergyUpdateTime, energy, maxEnergy } = get();
                const now = Date.now();
                const elapsed = now - lastEnergyUpdateTime;
                const energyToRestore = Math.floor(elapsed / 10000); // 1 energy per 10 seconds

                if (energyToRestore > 0 && energy < maxEnergy) {
                    set({
                        energy: Math.min(energy + energyToRestore, maxEnergy),
                        lastEnergyUpdateTime: now // Reset timer to now (or could be last update + restored * 60000 to keep remainder)
                    });
                } else {
                    // Just update the timestamp to keep it fresh if we didn't restore anything (e.g. full energy)
                    set({ lastEnergyUpdateTime: now });
                }
            },
        }), {
        name: 'merge2-storage',
        partialize: (state) => ({
            grid: state.grid,
            energy: state.energy,
            maxEnergy: state.maxEnergy,
            coins: state.coins,
            gems: state.gems,
            level: state.level,
            xp: state.xp,
            orders: state.orders,
            tasks: state.tasks,
            lastEnergyUpdateTime: state.lastEnergyUpdateTime,
        }),
    }));
