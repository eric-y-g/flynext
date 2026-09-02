'use client';
import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface NotificationContextType {
    unreadCount: number;
    setUnreadCount: Dispatch<SetStateAction<number>>;
}
  

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
