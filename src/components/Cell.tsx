import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { GridCell } from '../types/game';
import { Item } from './Item';

import { useGameStore } from '../store/gameStore';

interface CellProps {
    cell: GridCell;
}

export const Cell: React.FC<CellProps> = ({ cell }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: cell.id,
        data: cell,
    });
    const { spawnItem, selectedItemId, setSelectedItem, orders } = useGameStore();

    const isRequired = React.useMemo(() => {
        if (!cell.item) return false;
        return orders.some(order =>
            order.items.some(req =>
                req.type === cell.item?.type && req.level === cell.item?.level
            )
        );
    }, [cell.item, orders]);

    const handleItemClick = () => {
        if (!cell.item) return;

        // If this item is already selected, "use" it
        if (selectedItemId === cell.item.id) {
            if (cell.item.type.startsWith('generator')) {
                // Determine what to spawn based on generator type
                const spawnType = cell.item.type === 'generator_coffee' ? 'coffee' : 'croissant';
                spawnItem(cell.id, spawnType);
            }
            // Keep selected after use
        } else {
            // Select this item
            setSelectedItem(cell.item.id);
        }
    };

    const style = {
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : undefined,
    };

    return (
        <div ref={setNodeRef} className="cell" style={style}>
            {cell.item && (
                <Item
                    item={cell.item}
                    onClick={handleItemClick}
                    isSelected={selectedItemId === cell.item.id}
                    isRequired={isRequired}
                />
            )}
        </div>
    );
};
