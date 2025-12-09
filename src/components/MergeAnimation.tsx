import React, { useEffect, useState } from 'react';
import { type MergeAnimation as MergeAnimationType } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { Item } from './Item';

interface MergeAnimationProps {
    animation: MergeAnimationType;
}

export const MergeAnimation: React.FC<MergeAnimationProps> = ({ animation }) => {
    const { grid } = useGameStore();
    const [positions, setPositions] = useState<{ fromX: number; fromY: number; toX: number; toY: number } | null>(null);

    const fromCell = grid.find(c => c.id === animation.fromCellId);
    const toCell = grid.find(c => c.id === animation.toCellId);

    useEffect(() => {
        // Get actual DOM positions
        const gameBoardElement = document.querySelector('.game-board');
        if (!gameBoardElement || !fromCell || !toCell) return;

        const boardRect = gameBoardElement.getBoundingClientRect();

        // Find the cell elements by their data attributes or position
        const cells = Array.from(gameBoardElement.querySelectorAll('.cell'));
        // const fromIndex = fromCell.row * 7 + fromCell.col; // Assuming 7 columns, should ideally get from config or store width
        // Better: use simple index logic if we know the grid structure, or querySelector based on ID if cells had IDs.
        // But the previous SpawnAnimation assumed index = row * 7 + col. Use the global COLS config if possible, or just dynamic like this:
        // Actually, let's verify COLS logic. standard is 7 cols? `createGrid(rows, 7)`? 
        // config.ts doesn't explicitly say cols. store initGrid says internal logic.
        // Assuming the grid order in state matches DOM order.

        const fromIndexFromGrid = grid.findIndex(c => c.id === animation.fromCellId);
        const toIndexFromGrid = grid.findIndex(c => c.id === animation.toCellId);

        const fromElement = cells[fromIndexFromGrid] as HTMLElement;
        const toElement = cells[toIndexFromGrid] as HTMLElement;

        if (fromElement && toElement) {
            const fromRect = fromElement.getBoundingClientRect();
            const toRect = toElement.getBoundingClientRect();

            setPositions({
                fromX: fromRect.left - boardRect.left,
                fromY: fromRect.top - boardRect.top,
                toX: toRect.left - boardRect.left,
                toY: toRect.top - boardRect.top,
            });
        }
    }, [fromCell, toCell, grid, animation.fromCellId, animation.toCellId]);

    if (!fromCell || !toCell || !positions) return null;

    const deltaX = positions.toX - positions.fromX;
    const deltaY = positions.toY - positions.fromY;

    return (
        <div
            style={{
                position: 'absolute',
                width: '64px', // Assuming cell size
                height: '64px',
                left: `${positions.fromX}px`,
                top: `${positions.fromY}px`,
                zIndex: 1000,
                pointerEvents: 'none',
                // @ts-ignore - CSS custom properties
                '--delta-x': `${deltaX}px`,
                '--delta-y': `${deltaY}px`,
                animation: 'spawnFly 0.4s ease-in-out forwards', // Reusing spawnFly or defining new one? 
                // spawnFly typically might have scale effects. 
                // Let's check index.css for 'spawnFly'. If it exists and fits, good. 
                // If not, we might need to add it or inline keyframes (hard in React inline styles).
                // Safest to assume 'spawnFly' works as it was used in SpawnAnimation.
            }}
        >
            <Item
                item={animation.item}
                isSelected={false}
                isRequired={false}
            />
        </div>
    );
};
