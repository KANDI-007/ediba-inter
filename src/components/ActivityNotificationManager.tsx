import React, { useEffect, useState } from 'react';
import { useActivity } from '../contexts/ActivityContext';
import { ActivityLog } from '../contexts/ActivityContext';
import ActivityNotification from './ActivityNotification';

const ActivityNotificationManager: React.FC = () => {
  const { activities } = useActivity();
  const [notifications, setNotifications] = useState<ActivityLog[]>([]);
  const [lastActivityCount, setLastActivityCount] = useState(0);

  useEffect(() => {
    // Détecter les nouvelles activités
    if (activities.length > lastActivityCount) {
      const newActivities = activities.slice(0, activities.length - lastActivityCount);
      
      // Filtrer les activités récentes (dernières 30 secondes)
      const recentActivities = newActivities.filter(activity => {
        const activityTime = new Date(activity.timestamp);
        const now = new Date();
        const diffInSeconds = (now.getTime() - activityTime.getTime()) / 1000;
        return diffInSeconds <= 30; // Seulement les activités des 30 dernières secondes
      });

      // Ajouter les nouvelles activités aux notifications
      recentActivities.forEach(activity => {
        setNotifications(prev => [...prev, activity]);
      });
    }
    
    setLastActivityCount(activities.length);
  }, [activities, lastActivityCount]);

  const removeNotification = (activityId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== activityId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <ActivityNotification
          key={notification.id}
          activity={notification}
          onClose={() => removeNotification(notification.id)}
          autoClose={true}
          duration={5000}
        />
      ))}
    </div>
  );
};

export default ActivityNotificationManager;
