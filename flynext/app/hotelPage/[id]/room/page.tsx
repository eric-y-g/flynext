'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNotification } from '@/components/NotificationContext';
import Header from '@/components/header';
import api from '@/utils/api'

export default function RoomById() {
    const router = useRouter();
    const params = useParams();
    const { setUnreadCount } = useNotification();
    const searchParams = useSearchParams();
    const hotelId = params.id as string;
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const roomId = searchParams.get('roomId');
    const roomType = searchParams.get('roomType');
    const [loading, setLoading] = useState(true);
    const [typeData, setTypeData] = useState<{
        typeName: string;
        pricePerNight: number;
        amenities: string;
    }|null>(null);
    const [roomImage, setImage] = useState<any[]|null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTypeData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/hotels/type/${roomType}?hotelId=${hotelId}`);
            const info = await response.json();
            setTypeData(info.type);
            setImage(info.img);
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load room page');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if(!token){
                router.push('/login');
                return;
            }

            const cartResponse = await api.post(`/cart/hotel`, {
                "roomId": roomId, 
                "checkInDate": checkInDate, 
                "checkOutDate": checkOutDate, 
                "typeName": typeData?.typeName, 
                "price": typeData?.pricePerNight
            });

            if(cartResponse.status === 200) {
                router.push('/cart');
                setUnreadCount((prev: number) => prev + 1);
            }else{
                setError('Some issue might occured');
            }
        } catch(err) {
            router.push('/cart');
        }
    }
    
    useEffect(() => {
        fetchTypeData();
    }, []);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToPreviousImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (roomImage && roomImage.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? roomImage.length - 1 : prevIndex - 1
            );
        }
    };

    const goToNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (roomImage && roomImage.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % roomImage.length
            );
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => router.push(`/hotelPage/${hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)}
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        Back
                    </button>
                </div>                 
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="text-gray-700 dark:text-gray-300 space-y-2">
                        {/* <p>Hotel ID: <span className="font-medium">{hotelId || 'Not specified'}</span></p>
                        <p>Room ID: <span className="font-medium">{roomId || 'Not specified'}</span></p> */}
                        <p>Room Type: <span className="font-medium">{roomType || 'Not specified'}</span></p>
                        <p>Check-in Date: <span className="font-medium">{checkInDate || 'Not specified'}</span></p>
                        <p>Check-out Date: <span className="font-medium">{checkOutDate || 'Not specified'}</span></p>
                        <p>Amenities: <span className="font-medium">{typeData?.amenities}</span></p>
                        <p>Price: <span className="font-medium">${typeData?.pricePerNight}</span></p>
                    </div>
                    {roomImage && roomImage.length > 0 ? (
                        <div className="my-6">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Room Images ({currentImageIndex + 1}/{roomImage.length})</h2>
                            <div className="relative w-full max-w-2xl mx-auto">
                                <button 
                                    onClick={goToPreviousImage}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-70 text-white p-2 rounded-l-md hover:bg-opacity-70 dark:hover:bg-opacity-90 z-10 transition-all"
                                    aria-label="Previous image"
                                >
                                    ←
                                </button>
                                
                                <div className="flex justify-center">
                                    <img 
                                        src={roomImage[currentImageIndex].picture}
                                        alt={`Room type ${typeData?.typeName} image`}
                                        className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md dark:shadow-gray-700"
                                    />
                                </div>
                                
                                <button 
                                    onClick={goToNextImage}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-70 text-white p-2 rounded-r-md hover:bg-opacity-70 dark:hover:bg-opacity-90 z-10 transition-all"
                                    aria-label="Next image"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="my-6 text-gray-500 dark:text-gray-400 text-center">No images available for this room type</p>
                    )}
                    <div className="mt-6">
                        <button 
                            onClick={addToCart} 
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            Add to cart
                        </button>
                    </div>
                    
                    {error && (
                        <p className="mt-4 text-red-500 dark:text-red-400">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
