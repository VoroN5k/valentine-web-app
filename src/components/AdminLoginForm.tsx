"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const {error} = await supabase().auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);

        if (error) setError(error.message);

        router.push("/admin/dashboard");

    }

    return (
        <form
            onSubmit={onLogin}
            className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-8"
        >
            <h1 className="text-3xl font-bold mb-4">Адмінка 🔐</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-2xl bg-black/30 border border-white/15 outline-none focus:border-pink-400 transition"
            />

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-2xl bg-black/30 border border-white/15 outline-none focus:border-pink-400 transition"
            />

            {error && (
                <p className="text-red-300 mb-2 text-sm bg-red-500/10 px-3 py-2 rounded">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 disabled:opacity-60 transition font-semibold shadow-lg"
            >
                {loading ? "Вхід..." : "Увійти"}
            </button>
        </form>
    )
}