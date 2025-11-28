import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Zap, X } from 'lucide-react';

export const EnergyPurchasePopup: React.FC = () => {
    const { showEnergyPurchase, gems, purchaseEnergy, setShowEnergyPurchase } = useGameStore();

    if (!showEnergyPurchase) return null;

    const canAfford = gems >= 10;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '320px',
                width: '90%',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                position: 'relative'
            }}>
                <button
                    onClick={() => setShowEnergyPurchase(false)}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#6c757d'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '12px'
                    }}>⚡</div>
                    <h2 style={{
                        margin: '0 0 8px 0',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#212529'
                    }}>Out of Energy!</h2>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#6c757d'
                    }}>Purchase energy to continue playing</p>
                </div>

                <div style={{
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#6c757d',
                        marginBottom: '8px'
                    }}>Get 100 Energy</div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#212529',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#9c27b0' }}>💎</span>
                        <span>10 Gems</span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px'
                }}>
                    <button
                        onClick={() => setShowEnergyPurchase(false)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: '#e9ecef',
                            color: '#495057',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        No Thanks
                    </button>
                    <button
                        onClick={purchaseEnergy}
                        disabled={!canAfford}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: canAfford ? '#4CAF50' : '#e9ecef',
                            color: canAfford ? 'white' : '#adb5bd',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: canAfford ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Zap size={16} fill={canAfford ? 'white' : '#adb5bd'} />
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};
