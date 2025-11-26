import React, { useEffect, useState } from 'react';
import { type CoinAnimation as CoinAnimationType } from '../types/game';

interface CoinAnimationProps {
    animation: CoinAnimationType;
}

export const CoinAnimation: React.FC<CoinAnimationProps> = ({ animation }) => {
    const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        // If explicit target coordinates are provided, use them
        if (animation.toX !== undefined && animation.toY !== undefined) {
            setTargetPos({
                x: animation.toX - animation.fromX,
                y: animation.toY - animation.fromY,
            });
        } else {
            // Otherwise, calculate target based on amount (positive = coins display)
            const coinsElement = document.querySelector('.stats-bar > div:first-child');
            if (coinsElement) {
                const rect = coinsElement.getBoundingClientRect();
                setTargetPos({
                    x: rect.left + rect.width / 2 - animation.fromX,
                    y: rect.top + rect.height / 2 - animation.fromY,
                });
            }
        }
    }, [animation.fromX, animation.fromY, animation.amount, animation.toX, animation.toY]);

    if (!targetPos) return null;

    return (
        <div
            style={{
                position: 'fixed',
                left: `${animation.fromX}px`,
                top: `${animation.fromY}px`,
                fontSize: '24px',
                fontWeight: 'bold',
                zIndex: 10000,
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)', // Center the element on the start position
                // @ts-ignore - CSS custom properties
                '--target-x': `${targetPos.x}px`,
                '--target-y': `${targetPos.y}px`,
                animation: 'coinFly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            }}
        >
            {animation.amount > 0 ? `💰 +${animation.amount}` : `💰 ${animation.amount}`}
        </div>
    );
};
