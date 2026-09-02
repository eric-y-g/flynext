'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import api from '@/utils/api'

//the all bookings of the hotel
export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkOutDate, setchecKOut] = useState<string | null>(null);
    const [checkInDate, setCheckIn] = useState<string | null>(null);
    const [roomType, setRoomType] = useState<string | null>(null);
    const [dropdown, setDropDown] = useState<string[]>([]);
    const [typeName, setTypeName] = useState<string | null>(null);
    const [bookingData, setBookingData] = useState<Array<{
        userId: string,
        roomId: string,
        typeName: string;
        status: string;
        price: number;
        checkInDate: string;
        checkOutDate: string;
    }>>([]);
    
    const featchBookingData = async () => {
        try {
            setLoading(true);
            let url = `/hotels/booked?hotelId=${hotelId}`;
            if (checkInDate) url += `&checkInDate=${checkInDate}`;
            if (checkOutDate) url += `&checkOutDate=${checkOutDate}`;
            if (typeName) url += `&roomType=${typeName}`;
            
            const response = await api.get(url);
            setBookingData(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchRoomTypes = async () => {
        try {
                const response = await api.get(`/hotels/type?hotelId=${hotelId}`);
                if (response.status === 200) {
                    setDropDown(response.data);
                }
            } catch (error) {
                console.error("Error fetching room types:", error);
                setError("Failed to load room types");
            }
    };  

    useEffect(() => {
        fetchRoomTypes();
    }, [hotelId]);


    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Hotel Bookings</h1>
                            <button 
                                onClick={() => router.push(`/manage/${hotelId}`)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Back
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label htmlFor="typeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type</label>
                                <select
                                    id="typeName"
                                    value={typeName || ''}
                                    onChange={(e) => setTypeName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                                >
                                    <option value="">All types</option>
                                    {dropdown.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in Date</label>
                                <input 
                                    id="checkInTime" 
                                    type="date" 
                                    value={checkInDate || ""}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out Date</label>
                                <input 
                                    id="checkOutTime" 
                                    type="date" 
                                    value={checkOutDate || ""}
                                    onChange={(e) => setchecKOut(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                                />
                            </div>
                            <div className="flex items-end">
                                <button 
                                    onClick={featchBookingData}
                                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md dark:bg-blue-600 dark:hover:bg-blue-700 transition"
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            {loading ? (
                                <div className="text-center p-8">
                                    <p className="text-gray-600 dark:text-gray-400">Loading booking data...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center p-8">
                                    <p className="text-red-500 dark:text-red-400">{error}</p>
                                </div>
                            ) : bookingData.length > 0 ? (
                                <div>
                                    <h3 className="font-medium text-lg mb-4 dark:text-white">Booking Information</h3>
                                    <div className="space-y-4">
                                        {bookingData.map((booking, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-sm">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Room Type</p>
                                                        <p className="font-semibold">{booking.typeName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Status</p>
                                                        <p className={`font-semibold ${
                                                            booking.status === 'confirmed' ? 'text-green-600 dark:text-green-400' : 
                                                            booking.status === 'cancelled' ? 'text-red-600 dark:text-red-400' : 
                                                            'text-yellow-600 dark:text-yellow-400'
                                                        }`}>{booking.status}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Price</p>
                                                        <p className="font-semibold">${booking.price}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Dates</p>
                                                        <p>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                    {booking.status === 'reserved' && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    // Assuming you need to implement the API call to cancel the booking
                                                                    // Replace with the actual endpoint and booking ID
                                                                    await api.put(`/bookings/hotel`, 
                                                                        {userId: booking.userId, roomId: booking.roomId, checkInDate: booking.checkInDate, checkOutDate: booking.checkOutDate});
                                                                    // Refresh the booking data after cancellation
                                                                    featchBookingData();
                                                                } catch (err) {
                                                                    console.error('Error cancelling booking:', err);
                                                                    setError('Failed to cancel booking');
                                                                }
                                                            }}
                                                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md dark:bg-red-600 dark:hover:bg-red-700 transition"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <p className="text-gray-600 dark:text-gray-400">No booking data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}