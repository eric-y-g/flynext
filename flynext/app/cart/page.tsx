'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNotification } from '@/components/NotificationContext';
import Header from '@/components/header';
import api from '@/utils/api';

interface HotelCartItem {
    roomId: string;
    hotelName: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    pricePerNight: number;
}

interface HotelCartItemWithTotals extends HotelCartItem {
    nights: number;
    totalPrice: number;
}

interface FlightCartItem {
    flightTempId: string;
    flightId: string;
    origin: string;
    destination: string;
    price: number;
    departureDate: string;
}

export default function CartPage() {
    const router = useRouter();
    const [hotelData, setHotelData] = useState<HotelCartItemWithTotals[] | null>(null);
    const [flightData, setFlightData] = useState<FlightCartItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const { setUnreadCount } = useNotification();

    const getNights = (start: string, end: string) => {
        const checkIn = new Date(start);
        const checkOut = new Date(end);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms to days
    };
      
    const totalFlightCost = flightData?.reduce((sum, f) => sum + (f.price || 0), 0) || 0;
      
    const totalHotelCost = hotelData?.reduce((sum, h) => {
        const nights = getNights(h.checkInDate, h.checkOutDate);
        return sum + (h.pricePerNight * nights);
    }, 0) || 0;
      
    const totalCost = totalFlightCost + totalHotelCost;

    const getDaysBetween = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setCheckoutMessage('⚠️ You must be logged in to check out.');
            return;
        }
        
        setCheckoutLoading(true);
        setCheckoutMessage('');
        
        try {
            const res = await fetch('/api/cart/checkout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    creditCardNumber,
                    expiryDate,
                    cvv,
                    passportNumber,
                }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            const invoiceId = data.invoiceId;
            if (!invoiceId) {
                throw new Error('Missing invoice ID in response.');
            }
            
            setCheckoutMessage('✅ Checkout successful!');
            setCreditCardNumber('');
            setExpiryDate('');
            setCvv('');
            setPassportNumber('');
            setUnreadCount((prev: number) => prev + 1);
            router.push(`/invoice/${invoiceId}`);
        } catch (err: any) {
            setCheckoutMessage(`⚠️ ${err.message}`);
        } finally {
            setCheckoutLoading(false);
        }
    };

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if(!token){
                router.push('/login');
                return;
            }
            setLoading(true);

            const [hotelCart, flightCart] = await Promise.all([
                api.get('/cart/hotel'),
                api.get('/cart/flight')
            ]);

            if (hotelCart.status === 200) {
                const itemsWithDays: HotelCartItemWithTotals[] = hotelCart.data.map((item: HotelCartItem) => ({
                    ...item,
                    nights: getDaysBetween(item.checkInDate, item.checkOutDate),
                    totalPrice: item.pricePerNight * getDaysBetween(item.checkInDate, item.checkOutDate)
                }));
                setHotelData(itemsWithDays);
            }

            if (flightCart.status === 200) {
                setFlightData(flightCart.data);
            }
        } catch (err) {
            setError("Failed to load cart data");
        } finally {
            setLoading(false);
        }
    };

    const deleteHotelItem = async (roomId: string, checkInDate: string, checkOutDate: string) => {
        console.log(roomId, checkInDate, checkOutDate);
        try {
            await api.delete(`/cart/hotel`, {
                params: {
                    roomId,
                    checkInDate: new Date(checkInDate).toISOString(),
                    checkOutDate: new Date(checkOutDate).toISOString(),
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setUnreadCount((prev: number) => prev + 1);
            fetchCartItems();
        } catch (err) {
            console.error("Error deleting hotel cart item:", err);
        }
    };

    const deleteFlightItem = async (flightTempId: string) => {
        try {
            await api.delete(`/cart/flight`, {
                params: { flightTempId },
            });
            setUnreadCount((prev: number) => prev + 1);
            fetchCartItems();
        } catch (err) {
            console.error("Error deleting flight cart item:", err);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />

            <div className="container mx-auto px-4 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.push('/hotelPage')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    >
                        Back
                    </button>
                </div>

                <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hotels Section */}
                    <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors">
                        <details className="cursor-pointer">
                            <summary className="text-lg font-semibold flex justify-between items-center">
                                Hotels
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="mt-3 pl-4">
                                {loading ? (
                                    <p>Loading hotel data...</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : hotelData && hotelData.length > 0 ? (
                                    <div className="space-y-4">
                                        {hotelData.map((item, index) => (
                                            <div key={item.roomId || index} className="border-b pb-4 last:border-b-0">
                                                <h3 className="font-medium text-lg">{item.hotelName}</h3>
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                    <p><span className="font-medium">Check-in:</span> {new Date(item.checkInDate).toLocaleDateString()}</p>
                                                    <p><span className="font-medium">Check-out:</span> {new Date(item.checkOutDate).toLocaleDateString()}</p>
                                                    <p><span className="font-medium">Nights:</span> {item.nights}</p>
                                                    <p className="col-span-2"><span className="font-medium">Total Price:</span> ${item.totalPrice.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteHotelItem(item.roomId, item.checkInDate, item.checkOutDate)}
                                                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Remove Hotel
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hotels added to cart</p>
                                )}
                            </div>
                        </details>
                    </div>

                    {/* Flights Section */}
                    <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors">
                        <details className="cursor-pointer">
                            <summary className="text-lg font-semibold flex justify-between items-center">
                                Flights
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="mt-3 pl-4">
                                {loading ? (
                                    <p>Loading flight data...</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : flightData && flightData.length > 0 ? (
                                    <div className="space-y-4">
                                        {flightData.map((flight, index) => (
                                            <div key={flight.flightTempId || index} className="border-b pb-4 last:border-b-0">
                                                <h3 className="font-medium text-lg">
                                                    {flight.origin} ➡️ {flight.destination}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                    <p><span className="font-medium">Flight ID:</span> {flight.flightId}</p>
                                                    <p><span className="font-medium">Price:</span> ${flight.price.toFixed(2)}</p>
                                                    <p><span className="font-medium">Departure:</span> {new Date(flight.departureDate).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteFlightItem(flight.flightTempId)}
                                                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Remove Flight
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No flights added to cart</p>
                                )}
                            </div>
                        </details>
                    </div>
                </div>
            </div>
            {(hotelData?.length || 0) > 0 || (flightData?.length || 0) > 0 ? (
                <div className="mt-10 border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Checkout</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Credit Card Number"
                        value={creditCardNumber}
                        onChange={(e) => setCreditCardNumber(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        type="text"
                        placeholder="Expiry Date (YYYY-MM-DD)"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        type="text"
                        placeholder="Passport Number"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    </div>
                    <div className="mt-4 text-lg font-semibold text-center">
                        Total Cost: ${totalCost.toFixed(2)}
                    </div>
                    <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
                    >
                    {checkoutLoading ? 'Processing...' : 'Complete Checkout'}
                    </button>

                    {checkoutMessage && (
                    <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400">
                        {checkoutMessage}
                    </p>
                    )}
                </div>
            ) : null}
        </div>
    );
}
