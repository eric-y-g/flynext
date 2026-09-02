'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Header from '@/components/header';
import api from '@/utils/api'

export default function addRoomType() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params.id as string;
    const [error, setError] = useState<any>(null);
    const roomType = params.type as string;
    const [loading, setLoading] = useState(true);
    const [typeData, setTypeData] = useState<{
        typeName: string;
        pricePerNight: number;
        amenities: string;
    }|null>(null);
    const [roomImage, setImage] = useState<any[]|null>(null);
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
        await fetch('/api/hotels/type/image', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }, 
            body: JSON.stringify({ hotelId, typeName: roomType, secure_url, public_id })
        });
        fetchTypeData();
    }

    const triggerFileInput = () => {fileInputRef.current?.click();}

    const fetchTypeData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/hotels/type/${roomType}?hotelId=${hotelId}`);
            setTypeData(response.data.type);
            setImage(response.data.img);
            setCurrentImageIndex(0); // Reset to first image when data refreshes
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load room page');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypeData();
    }, [hotelId, roomType]);

    const goToPreviousImage = () => {
        if (!roomImage || roomImage.length === 0) return;
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? roomImage.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = () => {
        if (!roomImage || roomImage.length === 0) return;
        setCurrentImageIndex((prevIndex) => 
            prevIndex === roomImage.length - 1 ? 0 : prevIndex + 1
        );
    };
    
    return(
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => router.push(`/manage/${hotelId}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Back
                    </button>
                </div> 
                <div className="space-y-3 mb-6">
                    {/* <p className="dark:text-gray-300">Hotel ID: {hotelId || 'Not specified'}</p> */}
                    <p className="dark:text-gray-300">Room Type: {roomType || 'Not specified'}</p>
                    <p className="dark:text-gray-300">Amenities: {typeData?.amenities}</p>
                    <p className="dark:text-gray-300">Price: {typeData?.pricePerNight}</p>
                </div>

                {/* Room image carousel with navigation arrows */}
                {roomImage && roomImage.length > 0 ? (
                    <div className="my-6">
                        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Room Images ({currentImageIndex + 1}/{roomImage.length})</h2>
                        <div className="relative w-full max-w-2xl mx-auto">
                            <button 
                                onClick={goToPreviousImage}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-md hover:bg-opacity-70 z-10"
                                aria-label="Previous image"
                            >
                                ←
                            </button>
                            
                            <div className="flex justify-center">
                                <img 
                                    src={roomImage[currentImageIndex].picture}
                                    alt={`Room type ${typeData?.typeName} image`}
                                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                                />
                            </div>
                            
                            <button 
                                onClick={goToNextImage}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md hover:bg-opacity-70 z-10"
                                aria-label="Next image"
                            >
                                →
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="my-6 text-gray-500 dark:text-gray-400">No images available for this room type</p>
                )}

                <div className="flex justify-center mb-6">
                    <div
                        className="h-12 w-36 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden cursor-pointer 
                        border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center hover:bg-gray-300 
                        dark:hover:bg-gray-600 transition-colors"
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
                
                {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}
            </div>
        </div>
    );
}
