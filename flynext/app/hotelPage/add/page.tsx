'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import api from '@/utils/api';
import { useState } from 'react';

export default function HotelPage() {
    const router = useRouter();
    const [hotelName, setHotelName] = useState('');
    const [starRating, setStarRating] = useState(1);
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            setIsLoading(true);
            const response = await api.post("/hotels/add", {
                name: hotelName,
                address,
                location,
                starRating
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess("Hotel added successfully!");
                router.push('/hotelPage');
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (error) {
            setError("Please sure the location is correst.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => router.push('/hotelPage')}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        >
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-center">Add Hotel</h1>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 dark:bg-green-200 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {[
                            { id: 'name', label: 'Name', value: hotelName, setter: setHotelName, placeholder: 'Hotel name' },
                            { id: 'location', label: 'Location', value: location, setter: setLocation, placeholder: 'City' },
                            {
                                id: 'starRating',
                                label: 'Star Rating',
                                value: starRating,
                                setter: (v: any) => setStarRating(Number(v)),
                                type: 'number',
                                min: 1,
                                max: 5,
                                placeholder: '1–5'
                            },
                            { id: 'address', label: 'Address', value: address, setter: setAddress, placeholder: 'Full address' }
                        ].map(({ id, label, value, setter, placeholder, ...rest }) => (
                            <div className="space-y-2" key={id}>
                                <label htmlFor={id} className="block text-sm font-medium">
                                    {label}:
                                </label>
                                <input
                                    id={id}
                                    value={value}
                                    placeholder={placeholder}
                                    onChange={(e) => setter(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md shadow-sm bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                                    {...rest}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
