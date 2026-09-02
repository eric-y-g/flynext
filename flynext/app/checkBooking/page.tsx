'use client';

import { useState } from 'react';
import Header from '@/components/header';

export default function FlightLookupPage() {
  const [lastName, setLastName] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
    const res = await fetch(`/api/bookings/flight?flightBookingId=${bookingId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to retrieve booking');

      if (data.bookingDetails.lastName.toLowerCase() !== lastName.toLowerCase()) {
        throw new Error('Last name does not match our records');
      }

      setResult(data.bookingDetails);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <div className="flex justify-center mt-10 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-lg p-8 max-w-xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Lookup Flight Booking</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="bookingId" className="block text-sm font-medium mb-1">
                Flight Booking ID
              </label>
              <input
                type="text"
                id="bookingId"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Looking up...' : 'Search Booking'}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}

          {result && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
              <p><strong>Passenger:</strong> {result.firstName} {result.lastName}</p>
              <p><strong>Booking Reference:</strong> {result.bookingReference}</p>
              <p><strong>Email:</strong> {result.email}</p>
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Ticket Number:</strong> {result.ticketNumber}</p>

              <h3 className="text-lg font-semibold mt-4">Flights</h3>
              {result.flights.map((flight: any, index: number) => (
                <div key={index} className="border border-gray-300 dark:border-gray-600 rounded p-3 my-3">
                  <p><strong>Flight Number:</strong> {flight.flightNumber} ({flight.airline.name})</p>
                  <p><strong>From:</strong> {flight.origin.city}, {flight.origin.country} ({flight.origin.code})</p>
                  <p><strong>To:</strong> {flight.destination.city}, {flight.destination.country} ({flight.destination.code})</p>
                  <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                  <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                  <p><strong>Duration:</strong> {flight.duration} minutes</p>
                  <p><strong>Price:</strong> ${flight.price} {flight.currency}</p>
                  <p><strong>Status:</strong> {flight.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
