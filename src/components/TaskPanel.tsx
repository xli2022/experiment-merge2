import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Circle } from 'lucide-react';
import { LEVEL_CONFIG } from '../config';


export const TaskPanel: React.FC = () => {
    const { tasks, completeTask, coins, xp, level } = useGameStore();

    // Find the next incomplete task
    const nextTask = tasks.find(task => !task.completed);

    if (!nextTask) {
        return (
            <div style={{
                padding: '10px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e9ecef',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                boxSizing: 'border-box',
                fontSize: '14px',
                color: '#6c757d'
            }}>
                All tasks completed!
            </div>
        );
    }

    // Calculate progress based on XP towards the next level
    // LEVEL_CONFIG[N] contains the XP threshold to reach level N
    const currentLevelConfig = LEVEL_CONFIG[level];
    const nextLevelConfig = LEVEL_CONFIG[level + 1];

    const currentLevelThreshold = currentLevelConfig?.xpThreshold || 0;
    const nextLevelThreshold = nextLevelConfig?.xpThreshold || Infinity;

    let progress = 0;
    if (nextLevelThreshold === Infinity) {
        progress = 100; // Max level
    } else {
        const xpInCurrentLevel = Math.max(0, xp - currentLevelThreshold);
        const xpNeededForLevel = nextLevelThreshold - currentLevelThreshold;
        progress = Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '2px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#212529' }}>Task</h3>
                    <span style={{ fontSize: '10px', color: '#6c757d' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#4CAF50',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
                <div style={{
                    fontSize: '12px',
                    color: '#495057',
                    marginTop: '6px',
                    textAlign: 'center',
                    lineHeight: '1.4',
                    minHeight: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {nextTask.name}
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
                        padding: '8px 16px',
                        background: coins >= nextTask.cost ? '#4CAF50' : '#e9ecef',
                        color: coins >= nextTask.cost ? 'white' : '#adb5bd',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: coins >= nextTask.cost ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    {nextTask.cost} <Circle size={14} fill="currentColor" stroke="currentColor" />
                </button>
            </div>
        </div>
    );
};
