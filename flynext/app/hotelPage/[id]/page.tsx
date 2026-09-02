'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import api from '@/utils/api'


export default function hotelById() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const hotelId = params.id as string;
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const [hotelData, setHotelData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState<any[]|null>(null);
    const [detail, setDetail] = useState<any | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    useEffect(() => {
        async function fetchHotel() {
            try {
                const response = await fetch(`/api/hotels/${hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
                const detail = await fetch(`/api/hotels/details?hotelId=${hotelId}`)

                if (response.status === 200 || response.status === 201) {
                    // Set hotel data from response
                    const stuff = await detail.json();
                    const rooms = await response.json();
                    setImage(stuff.image);
                    setDetail(stuff.hotel);
                    setHotelData(rooms);
                } else {
                    throw new Error('Failed to fetch hotel data');
                }
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching hotel data:', err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchHotel();
    }, [hotelId, checkInDate, checkOutDate]);
    // Now you can use hotelId to fetch data or display it
    
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header></Header>
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => router.push('/hotelPage')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Back
                    </button>
                </div>
                {/* Image Gallery Section */}
                <div className="flex flex-col md:flex-row mt-6 mb-8 gap-6">
                    {/* Hotel Info Section */}
                    <div className="md:w-1/2">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Hotel Information</h2>
                            <div className="space-y-2">
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Name:</span> {detail && detail.name}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Address:</span> {detail && detail.address}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Location:</span> {detail && detail.location}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Rating:</span> {detail && detail.starRating} Stars</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Check-in:</span> {checkInDate}</p>
                                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Check-out:</span> {checkOutDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery Section */} 
                    <div className="md:w-1/2">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Hotel Images</h2>
                            {image && image.length > 0 ? (
                                <div className="relative">
                                    <div className="h-60 overflow-hidden rounded">
                                        <img 
                                            src={image[currentImageIndex]?.picture} 
                                            alt={`Hotel image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                        <button 
                                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? image.length - 1 : prev - 1))}
                                            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-r"
                                            aria-label="Previous image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <button 
                                            onClick={() => setCurrentImageIndex((prev) => (prev === image.length - 1 ? 0 : prev + 1))}
                                            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-l"
                                            aria-label="Next image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {currentImageIndex + 1} / {image.length}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300">No images available</p>
                            )}
                        </div>
                    </div>
                </div>
                {loading ? (
                    <p className="text-gray-700 dark:text-gray-300">Loading hotel data...</p>
                ) : error ? (
                    <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                ) : hotelData ? (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{hotelData.name}</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">{hotelData.description}</p>
                        
                        <h3 className="text-lg font-medium mt-6 mb-3 text-gray-800 dark:text-gray-100">Available Rooms:</h3>
                        {hotelData && hotelData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotelData.map((room: any) => (
                                    <div 
                                        key={room.roomId} 
                                        className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm cursor-pointer 
                                                hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-800"
                                        onClick={() => router.push(`/hotelPage/${hotelId}/room?roomId=${room.roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${room.typeName}`)}
                                    >
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">Room #{room.roomNumber}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Type: {room.typeName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">No rooms available for the selected dates.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300">No hotel data available</p>
                )}
            </div>
        </div>
    );
}
