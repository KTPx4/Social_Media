// NotificationsPage.tsx
import React, { useEffect, useState } from 'react';
import Notification from "../../components/notification/Notification.tsx";
import apiClient from "../../utils/apiClient.tsx";

interface NotificationData {
  id: string;
  userId: string;
  type: number;
  targetId: string;
  createdAt: string;
  isSeen: boolean;
  imageUrl: string;
  interactProfile: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get("/user/notifies")
        var code = response.status
        if(code === 200)
        {
          setNotifications(response.data.data);
        }
        else{
          console.log("Error when load data: ", response.data?.message)
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
      <div style={{ padding: '10px 20px', width: 320 }}>
        <h2>Notifications</h2>
        {notifications.map(notification => (
            // @ts-ignore
            <Notification key={notification.id} {...notification} />
        ))}
      </div>
  );
};

export default NotificationPage;