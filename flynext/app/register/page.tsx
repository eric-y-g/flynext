"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [restul, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setResult("Account created successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:shadow-gray-700">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
            >
              Back
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-200 dark:text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: "Email", id: "email", type: "email", value: email, setter: setEmail },
              { label: "Phone Number", id: "phoneNumber", type: "text", value: phoneNumber, setter: setPhoneNumber },
              { label: "First Name", id: "firstName", type: "text", value: firstName, setter: setFirstName },
              { label: "Last Name", id: "lastName", type: "text", value: lastName, setter: setLastName },
              { label: "Password", id: "password", type: "password", value: password, setter: setPassword },
            ].map(({ label, id, type, value, setter }) => (
              <div className="mb-4" key={id}>
                <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
                <input
                  type={type}
                  id={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            ))}

            <div className="flex items-center justify-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                Create Account
              </button>
            </div>

            {restul && (
              <h2 className="mt-4 text-center text-green-600 dark:text-green-400 font-semibold">
                {restul}
              </h2>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
