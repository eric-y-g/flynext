'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import api from '@/utils/api'
import Card from '@/components/cards';


interface Hotel {
    hotelId: string;
    name: string;
    address: string;
    image?: string;
    starRating: string;
}

export default function ManageHotelById() {
    const router = useRouter();
    const [hotelData, setHotelData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function fetchHotel() {
            try {
                setLoading(true);
                const response = await api.get(`/user/hotel`);
                const data = response.data;
                
                if (data && data.hotels) {
                    setHotelData(data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching hotel data:", err);
                setError(err);
                setLoading(false);
            }
        }
        
        fetchHotel();
    }, []);
    
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header></Header>
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => router.push(`/profile`)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Back
                    </button>
                </div>
                <div id="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {hotelData && hotelData.hotels && hotelData.hotels.length > 0 ? (
                        hotelData.hotels.map((hotel: Hotel) => (
                            <div key={hotel.hotelId} className="cursor-pointer transition-transform hover:scale-105" onClick={() => router.push(`/manage/${hotel.hotelId}`)}>
                                <Card imageSrc={hotel.image || '/placeholder.jpg'} name={hotel.name} address={hotel.address} starRating={hotel.starRating} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-700 dark:text-gray-300">
                            <p>There are no hotels under your name.</p>
                        </div>
                    )}
                </div>
                {loading && <p className="text-center py-4 text-gray-700 dark:text-gray-300">Loading...</p>}
                {error && <p className="text-center py-4 text-red-500 dark:text-red-400">Error loading hotel data</p>}
            </div>
            {/* Rest of your hotel page content */}
        </div>
    );
}