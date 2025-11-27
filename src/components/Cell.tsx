import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Cell as CellType } from '../types/game';
import { Item } from './Item';

import { useGameStore } from '../store/gameStore';

interface CellProps {
    cell: CellType;
}

export const Cell: React.FC<CellProps> = ({ cell }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: cell.id,
        data: cell,
    });
    const { selectedItemId, setSelectedItem, spawnItem, orders } = useGameStore();
    const isSelected = selectedItemId === cell.item?.id;
    const wasSelectedRef = React.useRef(false);

    const isRequired = React.useMemo(() => {
        if (!cell.item) return false;
        return orders.some(order =>
            order.items.some(req =>
                req.type === cell.item?.type && req.level === cell.item?.level
            )
        );
    }, [cell.item, orders]);

    const handlePointerDown = () => {
        if (!cell.item) return;
        wasSelectedRef.current = isSelected;

        if (!isSelected) {
            setSelectedItem(cell.item.id);
        }
    };

    const handleItemClick = () => {
        if (!cell.item) return;

        // Only spawn if it was ALREADY selected when we pressed down
        if (wasSelectedRef.current && isSelected) {
            if (cell.item.type.startsWith('generator')) {
                // Determine what to spawn based on generator type
                spawnItem(cell.id);
            }
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`cell ${isSelected ? 'selected' : ''}`}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                boxShadow: isSelected ? 'inset 0 0 0 2px #2196f3' : 'none',
            }}
        >
            {cell.item && (
                <Item
                    item={cell.item}
                    isSelected={isSelected}
                    isRequired={isRequired}
                    onClick={handleItemClick}
                    onPointerDown={handlePointerDown}
                />
            )}
        </div>
    );
};
