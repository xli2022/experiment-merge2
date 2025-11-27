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
    id: string; // e.g., "0-0", "0-1"
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
    description: string;
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

    // UI state (non-persistent)
    spawnAnimations: SpawnAnimation[];
    notification: Notification | null;
    coinAnimations: CoinAnimation[];

    // System
    lastEnergyUpdateTime: number;
}

// ============================================================================
// Player Progression Configuration
// ============================================================================

// XP thresholds for each level (cumulative)
// Each level requires 500 XP (5 tasks at 100 XP each)
export const LEVEL_XP_THRESHOLDS = [
    0,     // Level 1
    500,   // Level 2
    1000,  // Level 3
    1500,  // Level 4
    2000,  // Level 5
    2500,  // Level 6
    3000,  // Level 7
    3500,  // Level 8
    4000,  // Level 9
    4500,  // Level 10 (max)
];

// Task list - 45 tasks total (5 per level, 9 levels to max)
// Total XP: 4500 (45 tasks × 100 XP each)
export const TASK_LIST: Omit<Task, 'completed'>[] = [
    // Level 1 -> 2 (0-500 XP)
    { id: 't1', name: 'Clean Floor', cost: 50, xp: 100, description: 'Sweep away the dust.' },
    { id: 't2', name: 'Wipe Tables', cost: 60, xp: 100, description: 'Make the tables shine.' },
    { id: 't3', name: 'Fix Counter', cost: 70, xp: 100, description: 'Repair the work surface.' },
    { id: 't4', name: 'Replace Lightbulb', cost: 80, xp: 100, description: 'Brighten up the place.' },
    { id: 't5', name: 'Paint Walls', cost: 90, xp: 100, description: 'Fresh coat of paint.' },

    // Level 2 -> 3 (500-1000 XP)
    { id: 't6', name: 'New Sign', cost: 100, xp: 100, description: 'Attract more customers.' },
    { id: 't7', name: 'Repair Door', cost: 100, xp: 100, description: 'Fix the entrance.' },
    { id: 't8', name: 'Install Shelf', cost: 110, xp: 100, description: 'More storage space.' },
    { id: 't9', name: 'Buy Chairs', cost: 110, xp: 100, description: 'Comfortable seating.' },
    { id: 't10', name: 'New Floor Mat', cost: 120, xp: 100, description: 'Keep floors clean.' },

    // Level 3 -> 4 (1000-1500 XP)
    { id: 't11', name: 'Coffee Machine', cost: 120, xp: 100, description: 'Better coffee brewing.' },
    { id: 't12', name: 'Display Case', cost: 130, xp: 100, description: 'Show off pastries.' },
    { id: 't13', name: 'Menu Board', cost: 130, xp: 100, description: 'List your offerings.' },
    { id: 't14', name: 'Cash Register', cost: 140, xp: 100, description: 'Modern payment system.' },
    { id: 't15', name: 'Warming Oven', cost: 140, xp: 100, description: 'Keep food hot.' },

    // Level 4 -> 5 (1500-2000 XP)
    { id: 't16', name: 'Espresso Machine', cost: 150, xp: 100, description: 'Professional coffee.' },
    { id: 't17', name: 'Mixer', cost: 150, xp: 100, description: 'Mix ingredients faster.' },
    { id: 't18', name: 'Refrigerator', cost: 160, xp: 100, description: 'Store ingredients.' },
    { id: 't19', name: 'New Tables', cost: 160, xp: 100, description: 'Expand seating area.' },
    { id: 't20', name: 'Outdoor Sign', cost: 170, xp: 100, description: 'Visible from street.' },

    // Level 5 -> 6 (2000-2500 XP)
    { id: 't21', name: 'Sound System', cost: 170, xp: 100, description: 'Background music.' },
    { id: 't22', name: 'Ventilation', cost: 180, xp: 100, description: 'Better air flow.' },
    { id: 't23', name: 'Napkin Holders', cost: 180, xp: 100, description: 'Table accessories.' },
    { id: 't24', name: 'Window Blinds', cost: 190, xp: 100, description: 'Control sunlight.' },
    { id: 't25', name: 'Wall Art', cost: 190, xp: 100, description: 'Decorate the space.' },

    // Level 6 -> 7 (2500-3000 XP)
    { id: 't26', name: 'Industrial Oven', cost: 200, xp: 100, description: 'Bake more at once.' },
    { id: 't27', name: 'Freezer', cost: 200, xp: 100, description: 'Long-term storage.' },
    { id: 't28', name: 'Grinder', cost: 200, xp: 100, description: 'Fresh ground coffee.' },
    { id: 't29', name: 'Bar Stools', cost: 200, xp: 100, description: 'Counter seating.' },
    { id: 't30', name: 'WiFi Setup', cost: 200, xp: 100, description: 'Free internet.' },

    // Level 7 -> 8 (3000-3500 XP)
    { id: 't31', name: 'Outdoor Seating', cost: 200, xp: 100, description: 'Patio tables.' },
    { id: 't32', name: 'Premium Cups', cost: 200, xp: 100, description: 'Better quality.' },
    { id: 't33', name: 'Deep Fryer', cost: 200, xp: 100, description: 'Fried pastries.' },
    { id: 't34', name: 'Blender', cost: 200, xp: 100, description: 'Smoothies and shakes.' },
    { id: 't35', name: 'Ice Machine', cost: 200, xp: 100, description: 'Always have ice.' },

    // Level 8 -> 9 (3500-4000 XP)
    { id: 't36', name: 'Neon Sign', cost: 200, xp: 100, description: 'Eye-catching display.' },
    { id: 't37', name: 'Pastry Warmer', cost: 200, xp: 100, description: 'Keep treats warm.' },
    { id: 't38', name: 'Premium Chairs', cost: 200, xp: 100, description: 'Comfortable seating.' },
    { id: 't39', name: 'Point of Sale', cost: 200, xp: 100, description: 'Modern POS system.' },
    { id: 't40', name: 'Security Camera', cost: 200, xp: 100, description: 'Keep business safe.' },

    // Level 9 -> 10 (4000-4500 XP)
    { id: 't41', name: 'Commercial Roaster', cost: 200, xp: 100, description: 'Roast your own beans.' },
    { id: 't42', name: 'Delivery Van', cost: 200, xp: 100, description: 'Offer delivery service.' },
    { id: 't43', name: 'Loyalty Program', cost: 200, xp: 100, description: 'Reward regulars.' },
    { id: 't44', name: 'Premium Decor', cost: 200, xp: 100, description: 'Luxurious atmosphere.' },
    { id: 't45', name: 'Grand Opening', cost: 200, xp: 100, description: 'Celebrate success!' },
];

// ============================================================================
// Item Configuration
// ============================================================================

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
    tea: {
        maxLevel: 6,
        name: 'Tea',
        levelNames: {
            1: 'Tea Leaf',
            2: 'Tea Bag',
            3: 'Hot Water',
            4: 'Green Tea',
            5: 'Milk Tea',
            6: 'Bubble Tea'
        }
    },
    generator_coffee: {
        maxLevel: 6,
        name: 'Coffee Machine',
        levelNames: {
            1: 'Old Pot',
            2: 'Drip Machine',
            3: 'French Press',
            4: 'Espresso Machine',
            5: 'Commercial Brewer',
            6: 'Industrial Roaster'
        }
    },
    generator_bread: {
        maxLevel: 4,
        name: 'Bread Basket',
        levelNames: {
            1: 'Flour Sack',
            2: 'Mixing Bowl',
            3: 'Small Oven',
            4: 'Brick Oven'
        }
    }
};

// ============================================================================
// Generator Configuration
// ============================================================================

export const GENERATOR_CONFIG: Record<string, Record<number, { items: { type: ItemType; probability: number; level?: number }[] }>> = {
    generator_coffee: {
        1: {
            items: [
                { type: 'coffee', probability: 1.0, level: 1 }
            ]
        },
        2: {
            items: [
                { type: 'coffee', probability: 0.8, level: 1 },
                { type: 'tea', probability: 0.2, level: 1 }
            ]
        },
        3: {
            items: [
                { type: 'coffee', probability: 0.7, level: 1 },
                { type: 'coffee', probability: 0.1, level: 2 },
                { type: 'tea', probability: 0.2, level: 1 }
            ]
        },
        4: {
            items: [
                { type: 'coffee', probability: 0.6, level: 1 },
                { type: 'coffee', probability: 0.2, level: 2 },
                { type: 'tea', probability: 0.2, level: 1 }
            ]
        },
        5: {
            items: [
                { type: 'coffee', probability: 0.6, level: 1 },
                { type: 'coffee', probability: 0.2, level: 2 },
                { type: 'tea', probability: 0.18, level: 1 },
                { type: 'tea', probability: 0.02, level: 2 }
            ]
        },
        6: {
            items: [
                { type: 'coffee', probability: 0.6, level: 1 },
                { type: 'coffee', probability: 0.2, level: 2 },
                { type: 'tea', probability: 0.15, level: 1 },
                { type: 'tea', probability: 0.05, level: 2 }
            ]
        }
    },
    generator_bread: {
        1: {
            items: [
                { type: 'bread', probability: 1.0, level: 1 }
            ]
        },
        2: {
            items: [
                { type: 'bread', probability: 0.9, level: 1 },
                { type: 'bread', probability: 0.1, level: 2 }
            ]
        },
        3: {
            items: [
                { type: 'bread', probability: 0.8, level: 1 },
                { type: 'bread', probability: 0.2, level: 2 }
            ]
        },
        4: {
            items: [
                { type: 'bread', probability: 0.7, level: 1 },
                { type: 'bread', probability: 0.3, level: 2 }
            ]
        }
    }
};
