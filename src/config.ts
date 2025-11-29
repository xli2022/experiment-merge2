import type { ItemType, Task } from './types/game';

// ============================================================================
// Player Progression Configuration
// ============================================================================

// Level 1-10 configurations.
// xpThreshold: The XP required to reach this level (cumulative from start)
// reward: The reward received when reaching this level
export const LEVEL_CONFIG: Record<
    number,
    {
        xpThreshold: number;
        maxItemLevel: number;
        maxOrders: number;
        reward?: { type: ItemType; level: number; energy: number };
    }
> = {
    1: { xpThreshold: 0, maxItemLevel: 2, maxOrders: 2 },
    2: { xpThreshold: 300, maxItemLevel: 2, maxOrders: 2, reward: { type: 'generator_coffee', level: 1, energy: 30 } },
    3: { xpThreshold: 700, maxItemLevel: 3, maxOrders: 3, reward: { type: 'generator_bread', level: 1, energy: 30 } },
    4: { xpThreshold: 1200, maxItemLevel: 3, maxOrders: 3, reward: { type: 'generator_coffee', level: 1, energy: 40 } },
    5: { xpThreshold: 1700, maxItemLevel: 4, maxOrders: 4, reward: { type: 'generator_bread', level: 1, energy: 40 } },
    6: { xpThreshold: 2200, maxItemLevel: 4, maxOrders: 4, reward: { type: 'generator_coffee', level: 1, energy: 50 } },
    7: { xpThreshold: 2700, maxItemLevel: 5, maxOrders: 4, reward: { type: 'generator_bread', level: 1, energy: 50 } },
    8: { xpThreshold: 3300, maxItemLevel: 5, maxOrders: 5, reward: { type: 'generator_coffee', level: 1, energy: 60 } },
    9: { xpThreshold: 3900, maxItemLevel: 6, maxOrders: 5, reward: { type: 'generator_bread', level: 1, energy: 60 } },
    10: { xpThreshold: 4500, maxItemLevel: 6, maxOrders: 5, reward: { type: 'generator_coffee', level: 1, energy: 100 } },
};

// Total XP: 4500 (45 tasks × 100 XP each)
export const TASK_LIST: Omit<Task, 'completed'>[] = [
    { id: 't1', name: 'Clean Floor', cost: 50, xp: 100 },
    { id: 't2', name: 'Wipe Tables', cost: 60, xp: 100 },
    { id: 't3', name: 'Fix Counter', cost: 70, xp: 100 },

    { id: 't4', name: 'Replace Lightbulb', cost: 80, xp: 100 },
    { id: 't5', name: 'Paint Walls', cost: 90, xp: 100 },
    { id: 't6', name: 'New Sign', cost: 100, xp: 100 },
    { id: 't7', name: 'Repair Door', cost: 100, xp: 100 },

    { id: 't8', name: 'Install Shelf', cost: 110, xp: 100 },
    { id: 't9', name: 'Buy Chairs', cost: 110, xp: 100 },
    { id: 't10', name: 'New Floor Mat', cost: 120, xp: 100 },
    { id: 't11', name: 'Coffee Machine', cost: 120, xp: 100 },
    { id: 't12', name: 'Display Case', cost: 130, xp: 100 },

    { id: 't13', name: 'Menu Board', cost: 130, xp: 100 },
    { id: 't14', name: 'Cash Register', cost: 140, xp: 100 },
    { id: 't15', name: 'Warming Oven', cost: 140, xp: 100 },
    { id: 't16', name: 'Espresso Machine', cost: 150, xp: 100 },
    { id: 't17', name: 'Mixer', cost: 150, xp: 100 },

    { id: 't18', name: 'Refrigerator', cost: 160, xp: 100 },
    { id: 't19', name: 'New Tables', cost: 160, xp: 100 },
    { id: 't20', name: 'Outdoor Sign', cost: 170, xp: 100 },
    { id: 't21', name: 'Sound System', cost: 170, xp: 100 },
    { id: 't22', name: 'Ventilation', cost: 180, xp: 100 },

    { id: 't23', name: 'Napkin Holders', cost: 180, xp: 100 },
    { id: 't24', name: 'Window Blinds', cost: 190, xp: 100 },
    { id: 't25', name: 'Wall Art', cost: 190, xp: 100 },
    { id: 't26', name: 'Industrial Oven', cost: 200, xp: 100 },
    { id: 't27', name: 'Freezer', cost: 200, xp: 100 },

    { id: 't28', name: 'Grinder', cost: 200, xp: 100 },
    { id: 't29', name: 'Bar Stools', cost: 200, xp: 100 },
    { id: 't30', name: 'WiFi Setup', cost: 200, xp: 100 },
    { id: 't31', name: 'Outdoor Seating', cost: 200, xp: 100 },
    { id: 't32', name: 'Premium Cups', cost: 200, xp: 100 },
    { id: 't33', name: 'Deep Fryer', cost: 200, xp: 100 },

    { id: 't34', name: 'Blender', cost: 200, xp: 100 },
    { id: 't35', name: 'Ice Machine', cost: 200, xp: 100 },
    { id: 't36', name: 'Neon Sign', cost: 200, xp: 100 },
    { id: 't37', name: 'Pastry Warmer', cost: 200, xp: 100 },
    { id: 't38', name: 'Premium Chairs', cost: 200, xp: 100 },
    { id: 't39', name: 'Point of Sale', cost: 200, xp: 100 },

    { id: 't40', name: 'Security Camera', cost: 200, xp: 100 },
    { id: 't41', name: 'Commercial Roaster', cost: 200, xp: 100 },
    { id: 't42', name: 'Delivery Van', cost: 200, xp: 100 },
    { id: 't43', name: 'Loyalty Program', cost: 200, xp: 100 },
    { id: 't44', name: 'Premium Decor', cost: 200, xp: 100 },
    { id: 't45', name: 'Grand Opening', cost: 200, xp: 100 },
];

// ============================================================================
// Item Configuration
// ============================================================================

export const ITEM_CONFIG: Record<
    ItemType,
    { rarity: number; levels: Record<number, string> }
> = {
    coffee: {
        rarity: 0.8,
        levels: {
            1: 'Coffee Bean',
            2: 'Ground Coffee',
            3: 'Paper Cup',
            4: 'Hot Coffee',
            5: 'Latte',
            6: 'Espresso Flight'
        }
    },
    tea: {
        rarity: 0.2,
        levels: {
            1: 'Tea Leaf',
            2: 'Tea Bag',
            3: 'Hot Water',
            4: 'Green Tea',
            5: 'Milk Tea',
            6: 'Bubble Tea'
        }
    },
    bread: {
        rarity: 1.0,
        levels: {
            1: 'Flour',
            2: 'Dough',
            3: 'Croissant',
            4: 'Bagel',
            5: 'Loaf',
            6: 'Sandwich Platter'
        }
    },
    generator_coffee: {
        rarity: 0, // Never in orders
        levels: {
            1: 'Old Pot',
            2: 'Drip Machine',
            3: 'French Press',
            4: 'Espresso Machine',
            5: 'Commercial Brewer',
            6: 'Industrial Roaster'
        }
    },
    generator_bread: {
        rarity: 0, // Never in orders
        levels: {
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

export const GENERATOR_CONFIG: Partial<Record<
    ItemType,
    Record<number, { type: ItemType; level: number; probability: number }[]>
>> = {
    generator_coffee: {
        1: [
            { type: 'coffee', level: 1, probability: 1.0 }
        ],
        2: [
            { type: 'coffee', level: 1, probability: 0.8 },
            { type: 'tea', level: 1, probability: 0.2 }
        ],
        3: [
            { type: 'coffee', level: 1, probability: 0.7 },
            { type: 'coffee', level: 2, probability: 0.1 },
            { type: 'tea', level: 1, probability: 0.2 }
        ],
        4: [
            { type: 'coffee', level: 1, probability: 0.6 },
            { type: 'coffee', level: 2, probability: 0.2 },
            { type: 'tea', level: 1, probability: 0.2 }
        ],
        5: [
            { type: 'coffee', level: 1, probability: 0.6 },
            { type: 'coffee', level: 2, probability: 0.2 },
            { type: 'tea', level: 1, probability: 0.18 },
            { type: 'tea', level: 2, probability: 0.02 }
        ],
        6: [
            { type: 'coffee', level: 1, probability: 0.6 },
            { type: 'coffee', level: 2, probability: 0.2 },
            { type: 'tea', level: 1, probability: 0.15 },
            { type: 'tea', level: 2, probability: 0.05 }
        ]
    },
    generator_bread: {
        1: [
            { type: 'bread', level: 1, probability: 1.0 }
        ],
        2: [
            { type: 'bread', level: 1, probability: 0.9 },
            { type: 'bread', level: 2, probability: 0.1 }
        ],
        3: [
            { type: 'bread', level: 1, probability: 0.8 },
            { type: 'bread', level: 2, probability: 0.2 }
        ],
        4: [
            { type: 'bread', level: 1, probability: 0.7 },
            { type: 'bread', level: 2, probability: 0.3 }
        ]
    }
};
