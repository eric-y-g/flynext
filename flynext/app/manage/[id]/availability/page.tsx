'use client';

import { useParams, useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import api from '@/utils/api';

export default function AddRoom() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params.id as string;
    const [error, setError] = useState<any>(null);
    const { setUnreadCount } = useNotification();
    const [typeName, setTypeName] = useState<any>(null);
    const [dropdown, setDropDown] = useState<string[]>([]);
    const [num, setNum] = useState<number>(0);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/hotels/available", {
                roomType: typeName, 
                hotelId: hotelId,
                number: num 
            });
            
            if (response.status === 200 || response.status === 201) {
                setUnreadCount((prev: number) => prev + 1);
                router.push(`/manage/${hotelId}`);
            } else {
                console.error("Failed to decrease availability:", response);
            }
        } catch (error) {
            console.error("Error adding hotel:", error);
            setError("Failed to decrease availability. Please try again.");
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <button 
                    onClick={() => router.push(`/manage/${hotelId}`)}
                    className="mb-6 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Back
                </button>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Decrease Room Availability</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="typeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Type Name
                            </label>
                            <select
                                id="typeName"
                                value={typeName || ''}
                                onChange={(e) => setTypeName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                required
                            >
                                <option value="">Select a room type</option>
                                {dropdown.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="num" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Number to decrease by:
                            </label>
                            <input
                                type="number"
                                id="num"
                                value={num}
                                onChange={(e) => setNum(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                step="1"
                                required
                            />
                        </div>
                        
                        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                                Decrease Availability
                            </button>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => router.push(`/manage/${hotelId}/availability/restore`)}
                                className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                                Check Unavailable List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}