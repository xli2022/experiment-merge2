import React from 'react';
import { useGameStore } from '../store/gameStore';
import { MERGE_CHAINS } from '../types/game';
import { Trash2 } from 'lucide-react';

export const ItemPanel: React.FC = () => {
    const { grid, selectedItemId, deleteItem } = useGameStore();

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

    const itemConfig = MERGE_CHAINS[selectedItem.type];
    const itemName = itemConfig.levelNames?.[selectedItem.level] || itemConfig.name;
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
                    Level {selectedItem.level}/{itemConfig.maxLevel}
                    {isGenerator && <span style={{ marginLeft: '8px', color: '#28a745', fontWeight: '500' }}>• Tap to spawn</span>}
                </div>
            </div>
            {!isGenerator && (
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
            )}
        </div>
    );
};
