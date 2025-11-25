import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Item } from './Item';

export const OrderBoard: React.FC = () => {
    const { orders, generateOrder, completeOrder, grid } = useGameStore();

    useEffect(() => {
        // Generate initial orders if empty
        if (orders.length === 0) {
            generateOrder();
            generateOrder();
            generateOrder();
        }
    }, [orders.length, generateOrder]);

    // Helper to check if an item is available in the grid
    const checkAvailability = (orderItems: { type: any; level: number }[]) => {
        const availableItems = [...grid].filter(c => c.item !== null).map(c => c.item!);
        const status = orderItems.map(() => false);

        orderItems.forEach((reqItem, idx) => {
            const matchIndex = availableItems.findIndex(item =>
                item.type === reqItem.type && item.level === reqItem.level
            );
            if (matchIndex !== -1) {
                status[idx] = true;
                availableItems.splice(matchIndex, 1); // Use up this item
            }
        });
        return status;
    };

    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            padding: '10px',
            background: '#fff',
            borderRadius: '8px',
            marginBottom: '20px',
            justifyContent: 'center'
        }}>
            {orders.map((order) => {
                const itemStatus = checkAvailability(order.items);
                const isComplete = itemStatus.every(s => s);

                return (
                    <div key={order.id} style={{
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '100px'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Order</div>
                        <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ width: '40px', height: '40px', position: 'relative' }}>
                                    <Item
                                        item={{ ...item, id: `order-${order.id}-${idx}`, maxLevel: 0 }}
                                        isRequired={itemStatus[idx]} // Reuse isRequired to show checkmark
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            Reward: {order.reward.coins} Coins
                        </div>
                        <button
                            onClick={() => completeOrder(order.id)}
                            disabled={!isComplete}
                            style={{
                                marginTop: '5px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: isComplete ? 'pointer' : 'not-allowed',
                                background: isComplete ? '#4CAF50' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Deliver
                        </button>
                    </div>
                );
            })}
            {orders.length < 3 && (
                <button onClick={generateOrder} style={{ padding: '10px' }}>
                    + New Order
                </button>
            )}
        </div>
    );
};
