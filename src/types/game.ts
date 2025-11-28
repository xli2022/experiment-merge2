// ============================================================================
// Re-exports from other type files
// ============================================================================

import type { SpawnAnimation, Notification, CoinAnimation } from './animations';

export type { SpawnAnimation, Notification, CoinAnimation };

// ============================================================================
// Core Game Types
// ============================================================================

export type ItemType = 'coffee' | 'bread' | 'tea' | 'generator_coffee' | 'generator_bread';

export interface Item {
    id: string;
    type: ItemType;
    level: number;
    maxLevel: number;
}

export interface Cell {
    id: string;
    row: number;
    col: number;
    item: Item | null;
}

// ============================================================================
// Game Progression Types
// ============================================================================

export interface Order {
    id: string;
    items: { type: ItemType; level: number }[];
    reward: { coins: number };
}

export interface Task {
    id: string;
    name: string;
    cost: number;
    xp: number;
    completed: boolean;
}

// ============================================================================
// Game State
// ============================================================================

export interface GameState {
    // Grid
    grid: Cell[];
    selectedItemId: string | null;

    // Player resources
    energy: number;
    maxEnergy: number;
    coins: number;
    gems: number;

    // Player progression
    level: number;
    xp: number;

    // Game content
    orders: Order[];
    tasks: Task[];

    // System
    lastEnergyUpdateTime: number;

    // UI state (non-persistent)
    spawnAnimations: SpawnAnimation[];
    notification: Notification | null;
    coinAnimations: CoinAnimation[];
}
