import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type Notification } from '../types';
import { MOCK_ORDERS } from '../constants';

// Other notifications that are not related to new orders
const OTHER_NOTIFICATIONS: Notification[] = [
  { id: 2, icon: 'forum', message: 'Joko Anwar membalas diskusi Anda "Aplikasi Kasir Gratis".', timestamp: '3 jam lalu', read: false },
  { id: 3, icon: 'school', message: 'Sertifikat untuk kursus "Manajemen Keuangan" telah terbit.', timestamp: '1 hari lalu', read: true },
  { id: 4, icon: 'campaign', message: 'Jangan lewatkan! Bazaar UMKM akan diadakan akhir pekan ini.', timestamp: '2 hari lalu', read: true },
];


const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(OTHER_NOTIFICATIONS);
    const notificationRef = useRef<HTMLDivElement>(null);

    const hasInitializedRef = useRef(false);

    // Effect to generate and add new order notifications on component mount
    useEffect(() => {
        if (hasInitializedRef.current) {
            return;
        }

        // Find new orders with 'Diproses' status
        const newOrderNotifications = MOCK_ORDERS
            .filter(order => order.status === 'Diproses')
            .map((order, index) => ({
                id: 100 + index + Date.now(), // Ensure unique IDs per mount
                icon: 'receipt_long',
                message: `Anda memiliki pesanan baru #${order.id} dari ${order.customerName}.`,
                timestamp: `${index + 1} jam lalu`, // Mock timestamp
                read: false,
            }));

        // Combine new order notifications with others, and sort by read status then by a proxy for time
        setNotifications(prev => 
            [...newOrderNotifications, ...prev].sort((a, b) => {
                // Unread notifications first
                if (a.read !== b.read) {
                    return a.read ? 1 : -1;
                }
                // A simple sort to keep recent (higher ID in this mock) items first
                return b.id - a.id;
            })
        );
        hasInitializedRef.current = true;
    }, []); // Empty dependency array means this runs once on mount

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={notificationRef} className="fixed top-24 right-6 z-50">
            <button
                onClick={handleToggle}
                className="relative bg-white text-gray-600 rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-blue-500"
                aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
            >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            <div
                className={`absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border origin-top-right transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="notification-panel-title"
            >
                <div className="flex justify-between items-center p-3 border-b">
                    <h2 id="notification-panel-title" className="font-bold text-gray-800">Notifikasi</h2>
                    {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                            Tandai semua telah dibaca
                        </button>
                    )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <button 
                                key={notification.id}
                                onClick={() => handleMarkAsRead(notification.id)}
                                className={`w-full text-left p-3 flex items-start space-x-3 transition-colors ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
                            >
                                <span className="material-symbols-outlined text-gray-500 mt-1">{notification.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" title="Belum dibaca"></div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl">notifications_off</span>
                            <p className="mt-2 text-sm">Tidak ada notifikasi baru.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationBell;