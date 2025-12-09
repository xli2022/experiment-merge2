import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ITEM_CONFIG } from '../config';
import { Trash2, Merge } from 'lucide-react';

export const ItemPanel: React.FC = () => {
    const { grid, selectedItemId, deleteItem, mergeAllItems } = useGameStore();

    // Find the selected item
    const selectedCell = grid.find(c => c.item?.id === selectedItemId);
    const selectedItem = selectedCell?.item;

    if (!selectedItem) {
        return (
            <div style={{
                background: 'white',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                margin: '5px auto 0',
                minHeight: '48px',
            }}>
                <div style={{ fontSize: '14px', color: '#6c757d', fontStyle: 'italic' }}>
                    Select an item to see details
                </div>
            </div>
        );
    }

    const itemConfig = ITEM_CONFIG[selectedItem.type];
    const itemName = itemConfig?.levels?.[selectedItem.level] || 'Unknown Item';
    const maxLevel = itemConfig?.levels ? Object.keys(itemConfig.levels).length : 0;
    const isGenerator = selectedItem.type.startsWith('generator');

    return (
        <div style={{
            background: 'white',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            width: '90%',
            margin: '5px auto 0',
            minHeight: '48px',
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#212529' }}>
                    {itemName}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    Level {selectedItem.level}/{maxLevel}
                    {isGenerator && <span style={{ marginLeft: '8px', color: '#28a745', fontWeight: '500' }}>• Tap to spawn</span>}
                </div>
            </div>

            {
                !isGenerator && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {(() => {
                            const matchingItems = grid.filter(c =>
                                c.item?.type === selectedItem.type &&
                                c.item?.level === selectedItem.level &&
                                selectedItem.level < (selectedItem.maxLevel || 0)
                            );

                            if (matchingItems.length >= 2) {
                                return (
                                    <button
                                        onClick={() => mergeAllItems(selectedItem.id)}
                                        style={{
                                            background: '#0d6efd',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        <Merge size={16} />
                                        Merge All
                                    </button>
                                );
                            }
                            return null;
                        })()}

                        <button
                            onClick={() => {
                                deleteItem(selectedItem.id);
                            }}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                )
            }
        </div >
    );
};
