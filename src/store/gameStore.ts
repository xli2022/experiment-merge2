import { create } from 'zustand';
import { type GameState, type GridCell, type ItemType, type Order, type Upgrade, type SpawnAnimation, type Notification, type CoinAnimation, MERGE_CHAINS } from '../types/game';



interface GameStore extends GameState {
    initGrid: (rows: number, cols: number) => void;
    moveItem: (fromId: string, toId: string) => void;
    deleteItem: (itemId: string) => void;
    spawnItem: (cellId: string, type: ItemType) => void;
    consumeEnergy: (amount: number) => boolean;
    addCurrency: (type: 'coins' | 'gems', amount: number) => void;
    setSelectedItem: (id: string | null) => void;
    generateOrder: () => void;
    completeOrder: (orderId: string) => void;
    restoreEnergy: (amount: number) => void;
    purchaseUpgrade: (upgradeId: string) => void;
    addSpawnAnimation: (animation: SpawnAnimation) => void;
    removeSpawnAnimation: (id: string) => void;
    showNotification: (message: string, type: Notification['type']) => void;
    clearNotification: () => void;
    addCoinAnimation: (fromX: number, fromY: number, amount: number, toX?: number, toY?: number) => void;
    removeCoinAnimation: (id: string) => void;
}

const INITIAL_UPGRADES: Upgrade[] = [
    { id: 'u1', name: 'Clean Floor', cost: 50, description: 'Sweep away the dust.', purchased: false },
    { id: 'u2', name: 'Fix Counter', cost: 150, description: 'A sturdy place to work.', purchased: false },
    { id: 'u3', name: 'New Sign', cost: 300, description: 'Attract more customers.', purchased: false },
    { id: 'u4', name: 'Espresso Machine', cost: 500, description: 'Shiny and chrome.', purchased: false },
    { id: 'u5', name: 'Display Case', cost: 800, description: 'Show off your pastries.', purchased: false },
];

const createGrid = (rows: number, cols: number): GridCell[] => {
    const grid: GridCell[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid.push({
                id: `${r} -${c} `,
                row: r,
                col: c,
                item: null,
            });
        }
    }
    return grid;
};

export const useGameStore = create<GameStore>((set, get) => ({
    grid: [],
    energy: 100,
    maxEnergy: 100,
    coins: 0,
    gems: 0,
    level: 1,
    xp: 0,
    selectedItemId: null,
    orders: [],
    upgrades: INITIAL_UPGRADES,
    spawnAnimations: [],
    notification: null,
    coinAnimations: [],

    initGrid: (rows, cols) => {
        // Initialize with some starter items
        const grid = createGrid(rows, cols);

        // Add generators
        const centerIndex = Math.floor(grid.length / 2);
        grid[centerIndex - 1].item = {
            id: 'gen-1',
            type: 'generator_coffee',
            level: 1,
            maxLevel: 1,
        };
        grid[centerIndex + 1].item = {
            id: 'gen-2',
            type: 'generator_bread',
            level: 1,
            maxLevel: 1,
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

    spawnItem: (cellId, type) => {
        const { grid, energy, consumeEnergy, addSpawnAnimation, spawnAnimations, showNotification } = get();

        if (energy <= 0) {
            showNotification('⚡ Out of energy! Wait for it to recharge.', 'warning');
            return;
        }

        const generatorCell = grid.find(c => c.id === cellId);
        if (!generatorCell) return;

        // Get cells that have pending spawns
        const pendingSpawnCellIds = new Set(spawnAnimations.map(a => a.toCellId));

        // Find empty cells that don't have pending spawns
        const emptyCells = grid.filter(c => c.item === null && !pendingSpawnCellIds.has(c.id));
        if (emptyCells.length === 0) return;

        if (consumeEnergy(1)) {
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
                level: 1,
                maxLevel: MERGE_CHAINS[type].maxLevel,
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
            set({ energy: energy - amount });
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
        const { orders } = get();
        if (orders.length >= 3) return; // Max 3 orders

        // Generate 1 to 3 items for the order
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let totalRewardCoins = 0;
        let totalRewardXp = 0;

        for (let i = 0; i < numItems; i++) {
            const types: ItemType[] = ['coffee', 'bread'];
            const type = types[Math.floor(Math.random() * types.length)];
            const level = Math.floor(Math.random() * 3) + 1; // Level 1-3
            items.push({ type, level });
            totalRewardCoins += level * 10;
            totalRewardXp += level * 5;
        }

        const newOrder: Order = {
            id: crypto.randomUUID(),
            items,
            reward: { coins: totalRewardCoins, xp: totalRewardXp },
        };

        set({ orders: [...orders, newOrder] });
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

        // Auto-refill
        get().generateOrder();
    },

    restoreEnergy: (amount) => {
        const { energy, maxEnergy } = get();
        if (energy < maxEnergy) {
            set({ energy: Math.min(energy + amount, maxEnergy) });
        }
    },

    purchaseUpgrade: (upgradeId) => {
        const { coins, upgrades } = get();
        const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
        if (upgradeIndex === -1) return;

        const upgrade = upgrades[upgradeIndex];
        if (coins >= upgrade.cost && !upgrade.purchased) {
            const newUpgrades = [...upgrades];
            newUpgrades[upgradeIndex] = { ...upgrade, purchased: true };

            set({
                coins: coins - upgrade.cost,
                upgrades: newUpgrades
            });
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
}));
