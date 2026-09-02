"use client";

import Card from '@/components/cards';
import Header from '@/components/header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HotelPage = () => {
    const router = useRouter();
    const [location, setLocation] = useState('');

    interface HotelItem {
        hotelId: string;
        name: string;
        address: string;
        location: string;
        starRating: string;
        image?: string;
        ownerId?: string;
        pictures?: any;
    }

    const [items, setItem] = useState<HotelItem[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [starRating, setStarRating] = useState(0);
    const [hotelName, setHotelName] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [checkIn, setcheckIn] = useState<string | undefined>(undefined);
    const [checkOut, setcheckOut] = useState<string | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const toggleFilters = () => setShowFilters(!showFilters);

    const handleSearch = async () => {
        try {
            // Validate required fields
            if (!location) {
                setErrorMsg('Required field not filled out: Location');
                return;
            }
            
            if (!checkIn) {
                setErrorMsg('Required field not filled out: Check-in Date');
                return;
            }
            
            if (!checkOut) {
                setErrorMsg('Required field not filled out: Check-out Date');
                return;
            }
            
            // Clear error message if all required fields are filled
            setErrorMsg('');
            
            // Use relative URL which will be resolved by the browser
            let url = new URL('/api/hotels', window.location.origin);
            url.searchParams.append('checkInDate', checkIn);
            url.searchParams.append('checkOutDate', checkOut);
            url.searchParams.append('location', location);
            
            if (showFilters) {
                if (hotelName) url.searchParams.append('name', hotelName);
                if (starRating > 0) url.searchParams.append('starRating', starRating.toString());
                if (priceRange[0] > 0) url.searchParams.append('priceRangeMin', priceRange[0].toString());
                if (priceRange[1] < 1000) url.searchParams.append('priceRangeMax', priceRange[1].toString());
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch hotels');
            const data = await response.json();
            setItem(data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const value = parseInt(e.target.value);
        setPriceRange(type === 'min' ? [value, priceRange[1]] : [priceRange[0], value]);
    };

    return (
        <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <div className="container mx-auto p-4">
                {/* Search bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {[
                        {
                            label: 'Location',
                            id: 'location',
                            type: 'text',
                            value: location,
                            onChange: (e: any) => setLocation(e.target.value)
                        },
                        {
                            label: 'Check-in Date',
                            id: 'checkInTime',
                            type: 'date',
                            value: checkIn || '',
                            onChange: (e: any) => setcheckIn(e.target.value)
                        },
                        {
                            label: 'Check-out Date',
                            id: 'checkOutTime',
                            type: 'date',
                            value: checkOut || '',
                            onChange: (e: any) => setcheckOut(e.target.value)
                        }
                    ].map((field, i) => (
                        <div className="flex-1" key={i}>
                            <label htmlFor={field.id} className="block mb-1 text-sm font-medium">{field.label}</label>
                            <input
                                id={field.id}
                                type={field.type}
                                value={field.value}
                                onChange={field.onChange}
                                className="w-full p-2 border rounded-md bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                            />
                        </div>
                    ))}

                    <div className="flex items-end gap-2">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                        <button
                            onClick={() => router.push('/hotelPage/add')}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
                        {errorMsg}
                    </div>
                )}

                {/* Filters */}
                <div className="mb-6">
                    <button
                        onClick={toggleFilters}
                        className="bg-gray-200 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                    >
                        <span>Filters</span>
                        <span className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {showFilters && (
                        <div className="mt-4 p-4 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 shadow-sm transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="hotelName" className="block mb-1 text-sm font-medium">Hotel Name</label>
                                    <input
                                        id="hotelName"
                                        type="text"
                                        value={hotelName}
                                        onChange={(e) => setHotelName(e.target.value)}
                                        placeholder="Enter hotel name"
                                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Price Range</label>
                                    <div className="flex gap-2">
                                        {['min', 'max'].map((type, i) => (
                                            <input
                                                key={type}
                                                type="number"
                                                value={priceRange[i]}
                                                onChange={(e) => handlePriceChange(e, type as 'min' | 'max')}
                                                placeholder={type === 'min' ? "Min" : "Max"}
                                                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Star Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setStarRating(star)}
                                                className={`w-8 h-8 ${
                                                    starRating >= star
                                                        ? 'bg-yellow-400 text-black'
                                                        : 'bg-gray-200 dark:bg-gray-600'
                                                } rounded-md`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hotel cards */}
                <div id="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map(item => (
                        <div
                            key={item.hotelId}
                            className="cursor-pointer"
                            onClick={() => router.push(`/hotelPage/${item.hotelId}?checkInDate=${checkIn}&checkOutDate=${checkOut}`)}
                        >
                            <Card
                                imageSrc={item.image || '/placeholder.jpg'}
                                name={item.name}
                                address={item.address}
                                starRating={item.starRating}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelPage;
