import React, { useEffect, useState } from 'react';
import { type CoinAnimation as CoinAnimationType } from '../types/game';
import { Circle } from 'lucide-react';

interface CoinAnimationProps {
    animation: CoinAnimationType;
}

export const CoinAnimation: React.FC<CoinAnimationProps> = ({ animation }) => {
    const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        let targetX = animation.toX;
        let targetY = animation.toY;

        // If explicit target coordinates are NOT provided, calculate them
        if (animation.toX === undefined || animation.toY === undefined) {
            // Otherwise, calculate target based on amount (positive = coins display)
            if (animation.amount > 0) {
                // Fly to coins display (second badge in right group)
                const coinsElement = document.querySelector('.stats-bar > div:last-child > div:nth-child(2)');
                if (coinsElement) {
                    const rect = coinsElement.getBoundingClientRect();
                    targetX = rect.left + rect.width / 2;
                    targetY = rect.top + rect.height / 2;
                }
            }
        }

        // Set the target position if valid coordinates were determined
        if (targetX !== undefined && targetY !== undefined) {
            setTargetPos({
                x: targetX - animation.fromX,
                y: targetY - animation.fromY,
            });
        } else {
            // If no target could be determined, reset targetPos
            setTargetPos(null);
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
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#f57f17',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
        >
            <Circle size={24} fill="#f57f17" stroke="#f57f17" />
            {animation.amount > 0 ? `+${animation.amount}` : `${animation.amount}`}
        </div>
    );
};
