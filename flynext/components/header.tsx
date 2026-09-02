"use client";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';
import useTheme from '@/hooks/useTheme';

export default function Header() {
    const { unreadCount } = useNotification();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => pathname === path;
    const navigate = (path: string) => {
        router.push(path);
        setIsMenuOpen(false);
    };

    const navClass = (path: string) =>
        `hover:text-blue-700 dark:hover:text-blue-300 ${isActive(path) ? 'text-blue-700 dark:text-blue-300' : ''}`;

    return (
        <div>
            <nav id="navbar" className="bg-slate-400 text-black dark:bg-slate-800 dark:text-white p-4 flex justify-between items-center transition-colors duration-300">
                {/* Logo */}
                <button onClick={() => navigate('/')} className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                        TA
                    </div>
                    <span className="ml-2 text-xl font-semibold">TravelApp</span>
                </button>

                {/* Desktop Nav */}
                <div id="nav-links" className="hidden md:flex space-x-6 items-center">
                    <button onClick={() => navigate('/')} className={navClass('/')}>
                        Home
                    </button>
                    <button onClick={() => navigate('/hotelPage')} className={navClass('/hotelPage')}>
                        Hotel
                    </button>
                    <button onClick={() => navigate('/planePage')} className={navClass('/planePage')}>
                        Flights
                    </button>
                    <button onClick={() => navigate('/checkBooking')} className={navClass('/checkBooking')}>
                        Check Flight Booking
                    </button>
                    <button onClick={() => navigate('/profile')} className={navClass('/profile')}>
                        Account
                    </button>
                    <button onClick={() => navigate('/notifications')} className={navClass('/notifications') + ' relative'}>
                        Notifications
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => navigate('/cart')} className={navClass('/cart')}>
                        Cart
                    </button>
                    <button onClick={() => navigate('/invoice')} className={navClass('/invoice')}>
                        Invoices
                    </button>
                    <button onClick={() => navigate('/login')} className={navClass('/login')}>
                        Login
                    </button>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>

                {/* Hamburger */}
                <button
                    id="hamburger-menu"
                    className="md:hidden flex flex-col space-y-1"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
                    <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
                    <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
                </button>
            </nav>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div id="nav-links-sm" className="md:hidden bg-white text-black dark:bg-slate-800 dark:text-white py-2 transition-colors duration-300">
                    <div className="flex flex-col items-center space-y-3 pb-3">
                        <button onClick={() => navigate('/')} className={navClass('/')}>
                            Home
                        </button>
                        <button onClick={() => navigate('/hotelPage')} className={navClass('/hotelPage')}>
                            Hotel
                        </button>
                        <button onClick={() => navigate('/planePage')} className={navClass('/planePage')}>
                            Plane
                        </button>
                        <button onClick={() => navigate('/login')} className={navClass('/login')}>
                            Account
                        </button>
                        <button onClick={() => navigate('/notifications')} className={navClass('/notifications')}>
                            Notifications
                        </button>
                        <button onClick={() => navigate('/cart')} className={navClass('/cart')}>
                            Cart
                        </button>
                        <button onClick={() => navigate('/invoice')} className={navClass('/invoice')}>
                            Invoices
                        </button>
                        <button onClick={() => navigate('/login')} className={navClass('/login')}>
                            Login
                        </button>
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsMenuOpen(false);
                            }}
                            className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 mt-2 transition"
                        >
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
