import React from 'react';
import { useGameStore } from '../store/gameStore';


export const TaskPanel: React.FC = () => {
    const { tasks, coins, level, xp, completeTask } = useGameStore();

    const nextTaskIndex = tasks.findIndex(u => !u.completed);
    const nextTask = tasks[nextTaskIndex];

    // Calculate XP progress within current level
    const currentLevelThreshold = level > 1 ? (level - 1) * 500 : 0;
    const nextLevelThreshold = level * 500;
    const xpInCurrentLevel = xp - currentLevelThreshold;
    const xpNeededForLevel = nextLevelThreshold - currentLevelThreshold;
    const progress = Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);

    if (!nextTask) {
        return (
            <div style={{
                padding: '15px',
                background: '#fff',
                borderRadius: '12px',
                marginTop: 'auto', // Push to bottom
                border: '1px solid #e9ecef',
                textAlign: 'center',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ margin: 0, color: '#4CAF50' }}>Bakery Fully Renovated! 🎉</h3>
            </div>
        );
    }

    return (
        <div style={{
            padding: '10px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100%',
            boxSizing: 'border-box',
            justifyContent: 'center'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#212529', textAlign: 'center' }}>Task</h3>
                <span style={{ fontSize: '10px', color: '#6c757d', background: '#e9ecef', padding: '1px 6px', borderRadius: '8px' }}>
                    {Math.round(progress)}% Done
                </span>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                gap: '5px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: '#212529', fontSize: '12px' }}>{nextTask.name}</div>
                </div>

                <button
                    ref={(el) => {
                        if (el && coins >= nextTask.cost) {
                            el.onclick = () => {
                                // Get button position (target for animation)
                                const buttonRect = el.getBoundingClientRect();
                                const toX = buttonRect.left + buttonRect.width / 2;
                                const toY = buttonRect.top + buttonRect.height / 2;

                                // Get coins display position (source for animation)
                                const coinsElement = document.querySelector('.stats-bar > div:first-child');
                                if (coinsElement) {
                                    const coinsRect = coinsElement.getBoundingClientRect();
                                    const fromX = coinsRect.left + coinsRect.width / 2;
                                    const fromY = coinsRect.top + coinsRect.height / 2;

                                    // Fly FROM coins TO button for spending
                                    useGameStore.getState().addCoinAnimation(fromX, fromY, -nextTask.cost, toX, toY);
                                }
                                completeTask(nextTask.id);
                            };
                        }
                    }}
                    disabled={coins < nextTask.cost}
                    style={{
                        padding: '4px 10px',
                        border: 'none',
                        borderRadius: '15px',
                        background: coins >= nextTask.cost ? '#646cff' : '#adb5bd',
                        color: 'white',
                        cursor: coins >= nextTask.cost ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        width: '100%'
                    }}
                >
                    {nextTask.cost} 💰
                </button>
            </div>
        </div>
    );
};
