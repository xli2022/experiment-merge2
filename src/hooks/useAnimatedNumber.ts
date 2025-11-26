import { useEffect, useState } from 'react';

export function useAnimatedNumber(value: number, duration: number = 500): number {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        if (value === displayValue) return;

        const startValue = displayValue;
        const diff = value - startValue;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + diff * easeOutQuad);

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]); // Note: displayValue intentionally not in deps

    return displayValue;
}
