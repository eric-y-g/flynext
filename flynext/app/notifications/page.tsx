'use client';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNotification } from '@/components/NotificationContext';

interface Notification {
    notificationId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { setUnreadCount } = useNotification();

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/login');
                return;
            }
            
            try {
                const res = await fetch('/api/notification', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            
                const data = await res.json();
                console.log("Actual notification data:", data);
            
                if (!Array.isArray(data)) {
                    console.error('Expected an array, got:', data);
                    setNotifications([]);
                    setUnreadCount(0);
                    return;
                } else {
                    setNotifications(data);
                }
                const unread = data.filter((n) => !n.isRead).length;
                setUnreadCount(unread);

                await fetch('/api/notification/', {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUnreadCount(0);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchNotifications();
    }, []);

    const deleteNotification = async (id: string) => {
        await fetch(`/api/notification?notificationId=${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            method: 'DELETE',
        });
        setNotifications(notifications.filter((n) => n.notificationId !== id));
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
                <h1 className="text-2xl font-bold mb-4">Your Notifications</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : notifications.length === 0 ? (
                    <p>No notifications.</p>
                ) : (
                    <ul className="space-y-4">
                        {notifications.map((notification) => (
                            <li
                                key={notification.notificationId}
                                className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
                            >
                                <div>
                                    <p>{notification.message}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteNotification(notification.notificationId)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
