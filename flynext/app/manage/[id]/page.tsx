'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Header from '@/components/header';
import api from '@/utils/api'


export default function ManageHotelById() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const hotelId = params.id as string;
    const [hotelData, setHotelData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [roomType, setRoomType] = useState<any>(null);
    const [rooms, setRooms] = useState<any>(null);
    const [image, setImage] = useState<any[]|null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // Step 1: Upload to api/upload
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadResponse.json();
        console.log('Upload response:', uploadData);
        const { secure_url, public_id } = uploadData;
        if (!secure_url || !public_id) {
            console.error('Error uploading file:', uploadData);
            return;
        }
        // Step 2: Update user profile with the uploaded image
        const accessToken = localStorage.getItem('accessToken');
        await fetch('/api/hotels/add/image', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }, 
            body: JSON.stringify({ hotelId, secure_url, public_id })
        });
        fetchHotel();
    }
    
    
    const triggerFileInput = () => {fileInputRef.current?.click();}

    const fetchHotel = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/user/hotel/${hotelId}`);
            const data = response.data;
            if (data && data.roomTypes && data.rooms) {
                setHotelData(data);
                setRoomType(data.roomTypes);
                setRooms(data.rooms);
                setImage(data.hotelImage);
                setCurrentImageIndex(0); // Reset image index when data changes
            }
        } catch (error) {
            console.error("Error fetching hotel data:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHotel();
    }, [hotelId]);

    const goToPreviousImage = () => {
        if (image && image.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? image.length - 1 : prevIndex - 1
            );
        }
    };

    const goToNextImage = () => {
        if (image && image.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === image.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <Header></Header>
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => router.push('/profile/properties')}
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        Back
                    </button>
                </div>            
                <h1 className="text-2xl font-bold mb-4">Hotel Details</h1>
                {/* <p>Hotel ID: {hotelId}</p> */}
                {loading && <p>Loading hotel details...</p>}
                {error && <p className="text-red-500 dark:text-red-400">Error: {error.message}</p>}
                {hotelData && (
                    <div className="mt-4">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Hotel Name: {hotelData.hotelName}</h2>
                            <p className="dark:text-gray-300">Address: {hotelData.address}</p>
                            <p className="dark:text-gray-300">Location: {hotelData.location}</p>
                        </div>
                        <div className="flex justify-center mb-6">
                            <div
                                className="h-12 w-36 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden cursor-pointer border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center"
                                onClick={triggerFileInput}
                            >
                                <div className="text-gray-700 dark:text-gray-200">
                                    Upload Image
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {image && image.length > 0 ? (
                            <div className="my-4">
                                <h2 className="text-lg font-semibold mb-2">Hotel Images</h2>
                                <div className="relative max-w-3xl mx-auto">
                                    <div className="flex items-center justify-center">
                                        <button 
                                            onClick={goToPreviousImage}
                                            className="absolute left-0 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
                                            aria-label="Previous image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        
                                        <img 
                                            src={image[currentImageIndex].picture}
                                            alt={`Room type ${hotelData?.hotelName} image ${currentImageIndex + 1}`}
                                            className="w-full h-64 object-cover rounded"
                                        />
                                        
                                        <button 
                                            onClick={goToNextImage}
                                            className="absolute right-0 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
                                            aria-label="Next image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-center mt-2">
                                        {currentImageIndex + 1} / {image.length}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="my-4 text-gray-500">No images available for this hotel</p>
                        )}
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Room Types</h3>
                                <button 
                                    onClick={() => router.push(`/manage/${hotelId}/addType`)}
                                    className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                                >
                                    Add Type
                                </button>
                            </div>
                            {roomType && roomType.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {roomType.map((type: any) => (
                                        <div 
                                            key={type.typeName} 
                                            className="border border-gray-200 dark:border-gray-700 p-3 rounded bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                            onClick={() => router.push(`/manage/${hotelId}/${type.typeName}`)}
                                        >
                                            <p><strong>Type:</strong> {type.typeName}</p>
                                            <p><strong>Price:</strong> ${type.pricePerNight}/night</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="dark:text-gray-400">No room types available</p>
                            )}
                        </div>
                        
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Rooms</h3>
                                <button 
                                    onClick={() => router.push(`/manage/${hotelId}/addRoom`)}
                                    className="bg-green-500 dark:bg-green-600 text-white py-2 px-4 rounded hover:bg-green-600 dark:hover:bg-green-700 transition"
                                >
                                    Add Room
                                </button>
                            </div>
                            {rooms && rooms.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {rooms.map((room: any) => (
                                        <div key={room.roomNumber} className="border border-gray-200 dark:border-gray-700 p-3 rounded bg-gray-50 dark:bg-gray-800">
                                            <p><strong>Room Number:</strong> {room.roomNumber}</p>
                                            <p><strong>Type:</strong> {room.typeName || "Unknown"}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="dark:text-gray-400">No rooms available</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <button 
                                onClick={() => router.push(`/manage/${hotelId}/availability`)}
                                className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                            >
                                Change Availability
                            </button>
                        </div>
                        <div className="mt-6">
                            <button 
                                onClick={() => router.push(`/manage/${hotelId}/booking`)}
                                className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                            >
                                Check Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}