'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header';

interface Invoice {
  invoiceId: string;
  totalAmount: number;
  createdAt: string;
  flights: {
    flightId: string;
    passportNumber: string;
    price: number;
    origin: string;
    destination: string;
  }[];
  hotels: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    price: number;
  }[];
}

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoice/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, router]);

  const getNights = (start: string, end: string) => {
    const checkIn = new Date(start);
    const checkOut = new Date(end);
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handlePrint = () => {
    window.print();
  };

return (
    <>
        <Header />
        <div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded p-6 mt-6 print:bg-white print:text-black print:shadow-none">
                <h1 className="text-2xl font-bold mb-4">Invoice Summary</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : invoice ? (
                    <>
                        <p className="text-sm text-gray-500 mb-4">Invoice ID: {invoice.invoiceId}</p>
                        <p className="text-sm text-gray-500 mb-4">Date: {new Date(invoice.createdAt).toLocaleString()}</p>

                        {/* Flights */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Flights</h2>
                            {invoice.flights.length === 0 ? (
                                <p>No flights in this invoice.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {invoice.flights.map((f, idx) => (
                                        <li key={idx} className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                            <p><strong>Flight ID:</strong> {f.flightId}</p>
                                            <p><strong>Route:</strong> {f.origin} → {f.destination}</p>
                                            <p><strong>Price:</strong> ${f.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Hotels */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Hotels</h2>
                            {invoice.hotels.length === 0 ? (
                                <p>No hotel bookings in this invoice.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {invoice.hotels.map((h, idx) => {
                                        console.log(h);
                                        const nights = getNights(h.checkInDate, h.checkOutDate);
                                        return (
                                            <li key={idx} className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                                <p><strong>Room ID:</strong> {h.roomId}</p>
                                                <p><strong>Dates:</strong> {new Date(h.checkInDate).toLocaleDateString()} → {new Date(h.checkOutDate).toLocaleDateString()} ({nights} night{nights > 1 ? 's' : ''})</p>
                                                <p><strong>Price:</strong> ${h.price.toFixed(2)} × {nights} = ${(h.price * nights).toFixed(2)}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Total */}
                        <div className="text-xl font-bold text-right mb-4">
                            Total: ${invoice.totalAmount.toFixed(2)}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Download / Print Invoice
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-red-500">Invoice not found.</p>
                )}
            </div>
        </div>
    </>
);
}
