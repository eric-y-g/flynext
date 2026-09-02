"use client";
import { useState, useEffect } from "react";

export default function useAuth() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            setAccessToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Function to log in and get an access token
    async function login(email: string, password: string) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Ensures refresh token is stored in an HTTP-only cookie
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login Failed");

        const { accessToken } = data;
        localStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
    }

    // Function to refresh the access token
    async function refreshAccessToken() {
        const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (res.ok) {
            const { accessToken } = await res.json();
            localStorage.setItem("accessToken", accessToken);
            setAccessToken(accessToken);
            return accessToken;
        } else {
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            return null;
        }
    }

    return { accessToken, login, refreshAccessToken };
}
