'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/header';
import api from '@/utils/api'

export default function AddRoomType() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params.id as string;
    const [error, setError] = useState<any>(null);
    const [typeName, setTypeName] = useState<any>(null);
    const [amenities, setAmenities] = useState<any>(null);
    const [pricePerNight, setPricePerNight] = useState<number>(0);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/hotels/type", {
                typeName: typeName, 
                amenities: amenities, 
                pricePerNight: pricePerNight,
                hotelId: hotelId
            });
            
            if (response.status === 200 || response.status === 201) {
                router.push(`/manage/${hotelId}`);
            } else {
                console.error("Failed to add hotel:", response);
            }
        } catch (error) {
            console.error("Error adding hotel:", error);
            setError("Failed to add room type. Please try again.");
        }       
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-6">
                           
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Room Type</h2>
                    <div className="flex justify-between items-center mb-6">
                        <button 
                            onClick={() => router.push(`/manage/${hotelId}`)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Back
                        </button>
                    </div> 
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="typeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type Name</label>
                            <input
                                type="text"
                                id="typeName"
                                value={typeName || ''}
                                onChange={(e) => setTypeName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amenities</label>
                            <textarea
                                id="amenities"
                                value={amenities || ''}
                                onChange={(e) => setAmenities(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Per Night</label>
                            <input
                                type="number"
                                id="pricePerNight"
                                value={pricePerNight}
                                onChange={(e) => setPricePerNight(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        
                        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-800"
                            >
                                Add Room Type
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
