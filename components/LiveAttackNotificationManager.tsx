'use client';

import { useState, useEffect, useCallback } from 'react';
import LiveAttackNotification, { AttackNotification } from './LiveAttackNotification';

interface Props {
  maxNotifications?: number;
}

export default function LiveAttackNotificationManager({ maxNotifications = 3 }: Props) {
  const [notifications, setNotifications] = useState<AttackNotification[]>([]);

  // Listen for attack events
  useEffect(() => {
    const handleAttackDetected = (event: CustomEvent<AttackNotification>) => {
      const notification = event.detail;
      
      setNotifications(prev => {
        // Add new notification at the beginning
        const updated = [notification, ...prev];
        // Keep only the most recent maxNotifications
        return updated.slice(0, maxNotifications);
      });
    };

    window.addEventListener('pluto:attack-detected' as any, handleAttackDetected);
    
    return () => {
      window.removeEventListener('pluto:attack-detected' as any, handleAttackDetected);
    };
  }, [maxNotifications]);

  const handleDismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      zIndex: 10000,
      pointerEvents: 'none',
    }}>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            pointerEvents: 'auto',
            marginTop: index === 0 ? 0 : 10,
            transform: `translateY(${index * 10}px)`,
            opacity: 1 - (index * 0.15),
            transition: 'all 0.3s ease',
          }}
        >
          <LiveAttackNotification
            notification={notification}
            onDismiss={() => handleDismiss(notification.id)}
            autoCloseDelay={8000}
          />
        </div>
      ))}
    </div>
  );
}

// Helper function to trigger notifications
export function triggerAttackNotification(notification: Omit<AttackNotification, 'id' | 'timestamp'>) {
  const event = new CustomEvent('pluto:attack-detected', {
    detail: {
      ...notification,
      id: `attack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }
  });
  window.dispatchEvent(event);
}
