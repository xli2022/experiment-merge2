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

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't start drag if clicking on a button or interactive element
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
        if ((e.target as HTMLElement).closest('button')) return;

        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const distance = Math.abs(x - startX);

        // Only scroll if moved more than 5px (threshold for click vs drag)
        if (distance > 5) {
            const walk = (x - startX) * 2; // Scroll speed multiplier
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '5px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#212529', textAlign: 'center' }}>Orders</h3>
            <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '10px',
                    background: '#fff',
                    borderRadius: '8px',
                    justifyContent: 'flex-start',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    flex: 1,
                    boxSizing: 'border-box',
                    alignItems: 'center',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                    cursor: isDragging ? 'grabbing' : 'grab',
                } as React.CSSProperties}>
                <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
                {[...orders]
                    .map((order) => ({
                        order,
                        itemStatus: checkAvailability(order.items),
                    }))
                    .sort((a, b) => {
                        const aCompleted = a.itemStatus.filter(s => s).length;
                        const bCompleted = b.itemStatus.filter(s => s).length;
                        const aTotal = a.order.items.length;
                        const bTotal = b.order.items.length;
                        const aPercent = aCompleted / aTotal;
                        const bPercent = bCompleted / bTotal;
                        // Sort descending by completion percentage
                        return bPercent - aPercent;
                    })
                    .map(({ order, itemStatus }) => {
                        const isComplete = itemStatus.every(s => s);

                        return (
                            <div key={order.id} style={{
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: '120px'
                            }}>
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
        </div>
    );
};
