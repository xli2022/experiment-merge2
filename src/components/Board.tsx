import React, { useEffect } from 'react';
import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { Cell } from './Cell';
import { OrderBoard } from './OrderBoard';
import { BakeryRenovation } from './BakeryRenovation';
import { SpawnAnimation } from './SpawnAnimation';
import { Notification } from './Notification';
import { CoinAnimation } from './CoinAnimation';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { ItemInfoPanel } from './ItemInfoPanel';


export const Board: React.FC = () => {
    const { grid, initGrid, moveItem, energy, coins, restoreEnergy, spawnAnimations, coinAnimations } = useGameStore();
    const animatedCoins = useAnimatedNumber(coins, 800); // Match coin flying animation duration

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxWidth: '500px', // Simulate mobile width on desktop
            margin: '0 auto',
            padding: '10px',
            boxSizing: 'border-box',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <div className="stats-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
                <div style={{ background: '#fff8e1', padding: '5px 10px', borderRadius: '15px', color: '#f57f17' }}>💰 {animatedCoins}</div>
                <div style={{ fontSize: '16px', color: '#212529', fontWeight: 'bold' }}>Bakery Merge</div>
                <div style={{ background: '#e3f2fd', padding: '5px 10px', borderRadius: '15px', color: '#1565c0' }}>⚡ {energy}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'stretch', height: '160px' }}>
                <div style={{ flex: '0 0 140px' }}>
                    <BakeryRenovation />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <OrderBoard />
                </div>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="game-board" style={{ marginBottom: '10px', position: 'relative' }}>
                    {grid.map((cell) => (
                        <Cell key={cell.id} cell={cell} />
                    ))}
                    {/* Render spawn animations */}
                    {spawnAnimations.map((animation) => (
                        <SpawnAnimation key={animation.id} animation={animation} />
                    ))}
                </div>
            </DndContext>
            <Notification />
            {/* Render coin animations */}
            {coinAnimations.map((animation) => (
                <CoinAnimation key={animation.id} animation={animation} />
            ))}
            <ItemInfoPanel />
        </div>
    );
};
