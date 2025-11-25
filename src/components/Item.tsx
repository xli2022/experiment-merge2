import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { type Item as ItemType } from '../types/game';
import { CSS } from '@dnd-kit/utilities';
import {
    Coffee, Croissant, Zap, Check,
    Circle, CupSoda, Milk, ShoppingBag, Package,
    Wheat, Egg, Cookie, Sandwich, Cake,
    Factory, CookingPot
} from 'lucide-react';

interface ItemProps {
    item: ItemType;
    onClick?: () => void;
    isSelected?: boolean;
    isRequired?: boolean;
}

export const Item: React.FC<ItemProps> = ({ item, onClick, isSelected, isRequired }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: item,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.8 : 1,
        border: isSelected ? '3px solid #646cff' : undefined,
        boxShadow: isSelected ? '0 0 10px rgba(100, 108, 255, 0.5)' : undefined,

        backgroundColor: (item.type === 'generator_coffee' || item.type === 'coffee') ? '#3e2723' :
            (item.type === 'generator_bakery' || item.type === 'croissant') ? '#ffecb3' : undefined,
        color: (item.type === 'generator_coffee' || item.type === 'coffee') ? '#d7ccc8' :
            (item.type === 'generator_bakery' || item.type === 'croissant') ? '#5d4037' : undefined,
    };

    const getClassName = () => {
        if (item.type.startsWith('generator')) return 'item item-generator';
        return `item item-${item.type}`;
    };

    const renderIcon = () => {
        const size = 32;

        if (item.type === 'coffee') {
            switch (item.level) {
                case 1: return <Circle size={size} color="#6F4E37" fill="#6F4E37" />; // Coffee Bean
                case 2: return <Coffee size={size} />; // Espresso
                case 3: return <CupSoda size={size} />; // Iced Coffee
                case 4: return <Milk size={size} />; // Milk/Latte
                case 5: return <ShoppingBag size={size} />; // Bag of Beans
                case 6: return <Package size={size} />; // Box
                default: return <Coffee size={size} />;
            }
        }

        if (item.type === 'croissant') {
            switch (item.level) {
                case 1: return <Wheat size={size} />; // Wheat
                case 2: return <Egg size={size} />; // Egg
                case 3: return <Cookie size={size} />; // Dough/Cookie
                case 4: return <Croissant size={size} />; // Croissant
                case 5: return <Sandwich size={size} />; // Sandwich
                case 6: return <Cake size={size} />; // Cake
                default: return <Croissant size={size} />;
            }
        }

        if (item.type === 'generator_coffee') {
            return (
                <div style={{ position: 'relative' }}>
                    <Factory size={size} />
                    <Zap size={16} style={{ position: 'absolute', top: -5, right: -10, fill: 'gold', color: 'gold' }} />
                </div>
            );
        }

        if (item.type === 'generator_bakery') {
            return (
                <div style={{ position: 'relative' }}>
                    <CookingPot size={size} />
                    <Zap size={16} style={{ position: 'absolute', top: -5, right: -10, fill: 'gold', color: 'gold' }} />
                </div>
            );
        }

        return null;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={getClassName()}
            onClick={onClick}
        >
            {renderIcon()}
            <span style={{ position: 'absolute', bottom: 2, right: 4, fontSize: '10px' }}>{item.level}</span>
            {isRequired && (
                <div style={{
                    position: 'absolute',
                    top: -5,
                    left: -5,
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid white'
                }}>
                    <Check size={10} color="white" strokeWidth={3} />
                </div>
            )}
        </div>
    );
};
