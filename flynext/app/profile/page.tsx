'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import api from '@/utils/api';

export default function ProfilePage() {
    const router = useRouter();

    const [userData, setUserData] = useState({ userInfo: { firstName: '', lastName: '', phoneNumber: '', email: '', profilePic: '' } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '', password: '' });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadResponse.json();
        const { secure_url, public_id } = uploadData;
        if (!secure_url || !public_id) return;

        const accessToken = localStorage.getItem('accessToken');
        await fetch('/api/auth/profilepic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ secure_url, public_id })
        });
        setProfilePic(secure_url);
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await fetch('/api/auth/me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setUserData({ userInfo: data.user });
                setEditMode(false);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('An error occurred while updating.');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/user');
                setUserData(response.data);
                setFormData({
                    firstName: response.data.userInfo.firstName,
                    lastName: response.data.userInfo.lastName,
                    phoneNumber: response.data.userInfo.phoneNumber,
                    password: ''
                });
                setError(null);
            } catch (err) {
                router.push('/login');
                setError('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <div className="flex justify-center items-center mt-10 px-4">
                <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-lg p-8 max-w-md w-full transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">
                            Back
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-center">Loading user data...</p>
                    ) : error ? (
                        <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
                    ) : userData ? (
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-6">User Profile</h1>

                            <div className="flex justify-center mb-6">
                                <div className="h-32 w-32 rounded-full bg-gray-300 overflow-hidden cursor-pointer border-4 border-blue-500" onClick={triggerFileInput}>
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : userData.userInfo?.profilePic ? (
                                        <img src={userData.userInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-700">Upload</div>
                                    )}
                                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                                </div>
                            </div>

                            {editMode ? (
                                <div className="space-y-4">
                                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
                                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
                                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
                                    <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="New Password" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
                                    <button onClick={handleSaveChanges} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                                    <button onClick={() => setEditMode(false)} className="text-sm text-gray-500">Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4"><p className="font-medium">First Name: {userData.userInfo.firstName}</p></div>
                                    <div className="mb-4"><p className="font-medium">Last Name: {userData.userInfo.lastName}</p></div>
                                    <div className="mb-4"><p className="font-medium">Phone Number: {userData.userInfo.phoneNumber}</p></div>
                                    <div className="mb-4"><p className="font-medium">Email: {userData.userInfo.email}</p></div>
                                    <button onClick={() => setEditMode(true)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">Edit Profile</button>
                                </>
                            )}

                            <div className="flex justify-center mt-6">
                                <button onClick={() => router.push('/profile/properties')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition mr-4">Properties</button>
                                <button onClick={() => router.push('/profile/myBookings')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition mr-4">See My Bookings</button>
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition">LogOut</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">No user data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
