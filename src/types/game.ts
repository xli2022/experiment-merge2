export type ItemType = 'coffee' | 'croissant' | 'generator_coffee' | 'generator_bakery';

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
}

export const MERGE_CHAINS: Record<ItemType, { maxLevel: number; name: string }> = {
    coffee: { maxLevel: 6, name: 'Coffee' },
    croissant: { maxLevel: 6, name: 'Croissant' },
    generator_coffee: { maxLevel: 1, name: 'Coffee Machine' },
    generator_bakery: { maxLevel: 1, name: 'Oven' },
};
