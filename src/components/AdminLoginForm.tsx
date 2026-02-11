"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase().auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setError("");
            window.location.href = "/admin/dashboard";
        }
    };

    return (
        <div className="relative w-full h-screen bg-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-50/50 backdrop-blur-sm p-10 rounded-[3rem] shadow-2xl w-full max-w-sm flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-pink-500 text-center mb-8"> Адмін панель 💖</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-5 py-3 border border-pink-200 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 px-5 py-3 border border-pink-200 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner"
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-pink-400 text-white font-bold rounded-[2rem] hover:bg-pink-300 transition-all shadow-md flex justify-center items-center cursor-pointer"
                >
                    {loading ? "Завантаження..." : "Увійти"}
                </button>

                {error && <p className="text-red-500 mt-4 text-center font-medium">{error}</p>}
            </div>
        </div>

    );
}
