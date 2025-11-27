import React from 'react';

interface SettingsPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPopup: React.FC<SettingsPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleDeleteData = () => {
        if (window.confirm('Are you sure you want to delete all save data? This cannot be undone.')) {
            localStorage.removeItem('merge2-storage');
            window.location.reload();
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                width: '80%',
                maxWidth: '300px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#212529' }}>Settings</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#6c757d'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                    <button
                        onClick={handleDeleteData}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        🗑️ Delete Save Data
                    </button>
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#6c757d', textAlign: 'center' }}>
                        This will reset your progress.
                    </p>
                </div>
            </div>
        </div>
    );
};
