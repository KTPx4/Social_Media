// NotificationsPage.tsx
import React, { useEffect, useState } from 'react';
import Notification from "../../components/notification/Notification.tsx";
import apiClient from "../../utils/apiClient.tsx";
import "../../../public/css/NotificationPage.css"
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
interface NotificationPageProps{
    CallBackCloseNotification: any;
}
const NotificationPage: React.FC<NotificationPageProps> = ({CallBackCloseNotification}) => {
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
      <div style={{ padding: '10px 20px', width: 320, height: "92%" }}>
        <h2>Notifications</h2>
        <div style={{height: "95%", overflow: "auto"}}>
          {notifications.map(notification => (
              // @ts-ignore
              <Notification key={notification.id}  Notify={notification} CallBackClick={CallBackCloseNotification}/>
          ))}
          {!notifications || notifications.length === 0 && (
              <div style={{display: "flex", justifyContent:  "center", marginTop: 15}}>
                <p style={{fontSize: 12, fontStyle: "italic"}}>Nothing here</p>
              </div>
          )}
        </div>

      </div>
  );
};

export default NotificationPage;