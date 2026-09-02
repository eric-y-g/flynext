'use client'; 
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function Home() {
    const router = useRouter();
  
    return (
        <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* <div className="flex justify-end mb-6">
                    <button 
                        onClick={() => router.push('/cart')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Cart
                    </button>
                </div> */}
                
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-2">Welcome to the Travel App</h1>
                    <p className="text-lg">One app to choose to book hotel and flights.</p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center gap-8">
                    <div className="w-full md:w-72 h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Hotels</h2>
                        <p className="text-center mb-6">Find your perfect stay with our curated selection of hotels.</p>
                        <div className="flex justify-center">
                            <button 
                                onClick={() => router.push('/hotelPage')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Browse Hotels
                            </button>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-72 h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Flights</h2>
                        <p className="text-center mb-6">Discover the best flight deals to your favorite destinations.</p>
                        <div className="flex justify-center">
                            <button 
                                onClick={() => router.push('/planePage')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Search Flights
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
