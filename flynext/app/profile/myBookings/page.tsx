'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import api from '@/utils/api';

export default function OrderPage() {
    const router = useRouter();
    const [hotelData, setHotelData] = useState<any[]|null>(null);
    const [flightData, setFlightData] = useState<any[]|null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const { setUnreadCount } = useNotification();

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            if (response.status === 200) {
                setFlightData(response.data.flightBookings);
                setHotelData(response.data.hotelBooking);
            }
        } catch (err) {
            console.error("Error fetching bookings data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const cancelFlightBooking = async (flightBookingId: string) => {
        try {
            await api.put('/bookings/flight', { flightBookingId });
            setUnreadCount((prev: number) => prev + 1);
            fetchBookings(); // Refresh bookings after cancel
        } catch (err) {
            console.error("Failed to cancel flight booking:", err);
        }
    };

    const cancelHotelBooking = async (userId: string, roomId: string, checkInDate: string, checkOutDate: string) => {
        try {
            await api.put('/bookings/hotel', {
                userId,
                roomId,
                checkInDate,
                checkOutDate
            });
            setUnreadCount((prev: number) => prev + 1);
            fetchBookings(); // Refresh bookings after cancel
        } catch (err) {
            console.error("Failed to cancel hotel booking:", err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
                    <button 
                        onClick={() => router.push('/profile')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Back to Profile
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">Failed to load your bookings. Please try again later.</span>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Hotel Bookings</h2>
                            {hotelData && hotelData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Type</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Price</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Check-in Date</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Check-out Date</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Cancel</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hotelData.map((booking, index) => (
                                                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{booking.typeName}</td>
                                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">${booking.price}</td>
                                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{booking.checkInDate}</td>
                                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{booking.checkOutDate}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            booking.status.toLowerCase() === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                            booking.status.toLowerCase() === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {booking.status.toLowerCase() !== 'cancelled' && (
                                                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                            onClick={() => cancelHotelBooking(booking.userId, booking.roomId, booking.checkInDate, booking.checkOutDate)}>
                                                            Cancel
                                                        </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">No hotel bookings found.</p>
                            )}
                        </section>
                        
                        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Flight Bookings</h2>
                            {flightData && flightData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Booking Reference</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Last Name</th>
                                                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">Cancel</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {flightData.map((booking, index) => (
                                                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            booking.status.toLowerCase() === 'booked' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                            booking.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{booking.bookingReference}</td>
                                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{booking.lastName}</td>
                                                    <td className="py-3 px-4">
                                                        {booking.status.toLowerCase() !== 'cancelled' && (
                                                            <button
                                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                                onClick={() => cancelFlightBooking(booking.flightBookingId)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">No flight bookings found.</p>
                            )}
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}