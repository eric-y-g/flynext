'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import api from '@/utils/api';

export default function addRoom() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params.id as string;
    const [error, setError] = useState<any>(null);
    const [typeName, setTypeName] = useState<any>(null);
    const [roomNumber, setRoomNumber] = useState<any>('');
    const [dropdown, setDropDown] = useState<string[]>([]);

    // Fetch room types on component render
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
            const response = await api.post("/hotels/rooms", {
                typeName: typeName, 
                roomNumber: roomNumber,
                hotelId: hotelId
            });
            
            if (response.status === 200 || response.status === 201) {
                // Success - redirect to hotel list
                router.push(`/manage/${hotelId}`);
            } else {
                // Handle error response
                console.error("Failed to add hotel:", response);
            }
        } catch (error) {
            // Add user-friendly error handling here
            console.error("Error adding hotel:", error);
            setError("Failed to add room. Make sure this roomNumber does not exist.");
        }       
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header></Header>
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => router.push(`/manage/${hotelId}`)}
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        Back
                    </button>
                </div>            
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Room</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="typeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type Name</label>
                        <select
                            id="typeName"
                            value={typeName || ''}
                            onChange={(e) => setTypeName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">RoomNumber</label>
                        <input
                            type="number"
                            id="roomNumber"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            step="1"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
