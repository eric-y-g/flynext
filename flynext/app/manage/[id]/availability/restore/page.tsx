'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import api from '@/utils/api';

export default function AddRoom() {
    const router = useRouter();
    const params = useParams();
    const hotelId = params.id as string;
    const [error, setError] = useState<any>(null);
    const [typeName, setTypeName] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [num, setNum] = useState<number>(0);

    const fetchData = async () => {
        try {
            const response = await api.get(`/hotels/available?hotelId=${hotelId}`);
            if (response.status === 200) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching room types:", error);
            setError("Failed to load room types");
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [hotelId]); 

    const handleRestore = async (roomId: string) => {
        try {
            const response = await api.delete(`/hotels/available?hotelId=${hotelId}&roomId=${roomId}`);
            if (response.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.error("Error restoring room:", error);
            setError("Failed to restore room availability");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Restore Room Availability</h1>
                
                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {data.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No available rooms found for this hotel.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="px-6 py-3 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Room Type</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Room ID</th>
                                    <th className="px-6 py-3 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((room, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-800 dark:text-gray-200">{room.typeName}</td>
                                        <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-800 dark:text-gray-200">{room.roomId}</td>
                                        <td className="px-6 py-4 border-b dark:border-gray-600">
                                            <button 
                                                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                onClick={() => handleRestore(room.roomId)}
                                            >
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div className="mt-6">
                    <button 
                        onClick={() => router.back()} 
                        className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded mr-2"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}
