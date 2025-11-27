export type ItemType = 'coffee' | 'bread' | 'generator_coffee' | 'generator_bread';

export interface Item {
    id: string;
    type: ItemType;
    level: number;
    maxLevel: number;
}

export interface GridCell {
    id: string; // e.g., "0-0", "0-1"
    row: number;
    col: number;
    item: Item | null;
}

export interface Order {
    id: string;
    items: { type: ItemType; level: number }[];
    reward: { coins: number; xp: number };
}

export interface Upgrade {
    id: string;
    name: string;
    cost: number;
    description: string;
    purchased: boolean;
}

export interface SpawnAnimation {
    id: string;
    item: Item;
    fromCellId: string;
    toCellId: string;
    startTime: number;
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
}

export interface CoinAnimation {
    id: string;
    amount: number;
    fromX: number;
    fromY: number;
    toX?: number;  // Optional explicit target position
    toY?: number;
    startTime: number;
}

export interface GameState {
    grid: GridCell[];
    energy: number;
    maxEnergy: number;
    coins: number;
    gems: number;
    level: number;
    xp: number;
    selectedItemId: string | null;
    orders: Order[];
    upgrades: Upgrade[];
    spawnAnimations: SpawnAnimation[];
    notification: Notification | null;
    coinAnimations: CoinAnimation[];
    lastEnergyUpdateTime: number;
}

export const MERGE_CHAINS: Record<ItemType, { maxLevel: number; name: string; levelNames?: Record<number, string> }> = {
    coffee: {
        maxLevel: 6,
        name: 'Coffee',
        levelNames: {
            1: 'Coffee Bean',
            2: 'Ground Coffee',
            3: 'Paper Cup',
            4: 'Hot Coffee',
            5: 'Latte',
            6: 'Espresso Flight'
        }
    },
    bread: {
        maxLevel: 6,
        name: 'Bread',
        levelNames: {
            1: 'Flour',
            2: 'Dough',
            3: 'Croissant',
            4: 'Bagel',
            5: 'Loaf',
            6: 'Sandwich Platter'
        }
    },
    generator_coffee: { maxLevel: 1, name: 'Coffee Machine' },
    generator_bread: { maxLevel: 1, name: 'Bread Basket' },
};
