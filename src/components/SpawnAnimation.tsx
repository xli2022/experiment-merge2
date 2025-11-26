import React, { useEffect, useState } from 'react';
import { type SpawnAnimation as SpawnAnimationType } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { Item } from './Item';

interface SpawnAnimationProps {
    animation: SpawnAnimationType;
}

export const SpawnAnimation: React.FC<SpawnAnimationProps> = ({ animation }) => {
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
        const fromIndex = fromCell.row * 7 + fromCell.col;
        const toIndex = toCell.row * 7 + toCell.col;

        const fromElement = cells[fromIndex] as HTMLElement;
        const toElement = cells[toIndex] as HTMLElement;

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
    }, [fromCell, toCell]);

    if (!fromCell || !toCell || !positions) return null;

    const deltaX = positions.toX - positions.fromX;
    const deltaY = positions.toY - positions.fromY;

    return (
        <div
            style={{
                position: 'absolute',
                width: '64px',
                height: '64px',
                left: `${positions.fromX}px`,
                top: `${positions.fromY}px`,
                zIndex: 1000,
                pointerEvents: 'none',
                // @ts-ignore - CSS custom properties
                '--delta-x': `${deltaX}px`,
                '--delta-y': `${deltaY}px`,
                animation: 'spawnFly 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
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
