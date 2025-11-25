import { create } from 'zustand';
import { type GameState, type GridCell, type ItemType, type Order, MERGE_CHAINS } from '../types/game';



interface GameStore extends GameState {
    initGrid: (rows: number, cols: number) => void;
    moveItem: (fromId: string, toId: string) => void;
    spawnItem: (cellId: string, type: ItemType) => void;
    consumeEnergy: (amount: number) => boolean;
    addCurrency: (type: 'coins' | 'gems', amount: number) => void;
    setSelectedItem: (id: string | null) => void;
    generateOrder: () => void;
    completeOrder: (orderId: string) => void;
    restoreEnergy: (amount: number) => void;
}

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
            type: 'generator_bakery',
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

    spawnItem: (_cellId, type) => {
        const { grid, energy, consumeEnergy } = get();
        if (energy <= 0) return;

        // Find empty neighbor or just spawn in empty spot?
        // Usually generators spawn in adjacent empty cells.
        // For simplicity MVP: spawn in first empty cell.

        const emptyCells = grid.filter(c => c.item === null);
        if (emptyCells.length === 0) return;

        if (consumeEnergy(1)) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newGrid = [...grid];
            const cellIndex = newGrid.findIndex(c => c.id === randomCell.id);

            newGrid[cellIndex].item = {
                id: crypto.randomUUID(),
                type,
                level: 1,
                maxLevel: MERGE_CHAINS[type].maxLevel,
            };

            set({ grid: newGrid });
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

    setSelectedItem: (id) => {
        set({ selectedItemId: id });
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
            const types: ItemType[] = ['coffee', 'croissant'];
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
}));
