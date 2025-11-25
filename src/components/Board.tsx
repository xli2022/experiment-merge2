import React, { useEffect } from 'react';
import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { Cell } from './Cell';
import { OrderBoard } from './OrderBoard';


export const Board: React.FC = () => {
    const { grid, initGrid, moveItem, energy, coins, restoreEnergy } = useGameStore();

    useEffect(() => {
        initGrid(9, 7);

        // Restore 1 energy every minute
        const interval = setInterval(() => {
            restoreEnergy(1);
        }, 60000);

        return () => clearInterval(interval);
    }, [initGrid, restoreEnergy]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // active.id is the item ID
            // over.id is the cell ID (because we drop on cells)

            // We need to find which cell the active item came from
            const fromCell = grid.find(c => c.item?.id === active.id);
            if (fromCell) {
                moveItem(fromCell.id, over.id as string);
            }
        }
    };

    return (
        <div>
            <div className="stats-bar">
                <div>Energy: {energy}</div>
                <div>Coins: {coins}</div>
            </div>
            <OrderBoard />
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="game-board">
                    {grid.map((cell) => (
                        <Cell key={cell.id} cell={cell} />
                    ))}
                </div>
            </DndContext>
        </div>
    );
};
