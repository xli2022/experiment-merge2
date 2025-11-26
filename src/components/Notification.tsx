import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Notification: React.FC = () => {
    const { notification, clearNotification } = useGameStore();

    if (!notification) return null;

    const colors = {
        info: { bg: '#e3f2fd', text: '#1565c0', border: '#2196f3' },
        warning: { bg: '#fff8e1', text: '#f57f17', border: '#ffc107' },
        error: { bg: '#ffebee', text: '#c62828', border: '#f44336' },
        success: { bg: '#e8f5e9', text: '#2e7d32', border: '#4caf50' },
    };

    const colorScheme = colors[notification.type];

    return (
        <div
            onClick={clearNotification}
            style={{
                position: 'fixed',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: colorScheme.bg,
                color: colorScheme.text,
                padding: '12px 20px',
                borderRadius: '8px',
                border: `2px solid ${colorScheme.border}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                fontSize: '14px',
                fontWeight: '600',
                zIndex: 10000,
                cursor: 'pointer',
                animation: 'slideDown 0.3s ease-out',
                maxWidth: '300px',
                textAlign: 'center',
            }}
        >
            {notification.message}
        </div>
    );
};
