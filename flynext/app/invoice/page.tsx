'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

interface Invoice {
  invoiceId: string;
  createdAt: string;
  totalAmount: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return router.push('/login');

      const res = await fetch('/api/invoice', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
        if (!Array.isArray(data)) {
            setInvoices([]);
            return;
        }
      setInvoices(data);
      setLoading(false);
    };

    fetchInvoices();
  }, [router]);

  return (
    <>
        <Header />
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow-md mt-6">
            <h1 className="text-2xl font-bold mb-4">Your Invoices</h1>
            {loading ? (
                <p>Loading...</p>
            ) : invoices.length === 0 ? (
                <p>You have no invoices yet.</p>
            ) : (
                <ul className="space-y-4">
                {invoices.map((inv) => (
                    <li
                    key={inv.invoiceId}
                    className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    onClick={() => router.push(`/invoice/${inv.invoiceId}`)}
                    >
                    <p><strong>Invoice ID:</strong> {inv.invoiceId}</p>
                    <p><strong>Date:</strong> {new Date(inv.createdAt).toLocaleString()}</p>
                    <p><strong>Total:</strong> ${inv.totalAmount.toFixed(2)}</p>
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    </>
  );
}
