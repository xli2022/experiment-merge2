import type { Item } from './game';

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

export interface MergeAnimation {
    id: string;
    item: Item;
    fromCellId: string;
    toCellId: string;
    startTime: number;
}
