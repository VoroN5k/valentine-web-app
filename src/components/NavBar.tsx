"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase().auth.getSession();
            setIsAuthed(!!session);
            setLoading(false);
        };

        checkSession();

        const { data: listener } = supabase().auth.onAuthStateChange((_event, session) => {
            setIsAuthed(!!session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleAdminClick = async () => {
        const { data: { session } } = await supabase().auth.getSession();
        router.push(session ? "/admin/dashboard" : "/admin");
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-pink-500">
                    <Link href={"/"}>💖 Наш сайт</Link>
                </div>

                <div className="flex gap-6 text-gray-700 font-medium">
                    <Link href="/" className="hover:text-pink-500 transition">
                        Головна
                    </Link>

                    {/* Альбом показуємо тільки якщо авторизований */}
                    {!loading && isAuthed && (
                        <Link href="/album" className="hover:text-pink-500 transition">
                            Альбом
                        </Link>
                    )}

                    <Link href="/moments" className="hover:text-pink-500 transition">
                        Moments
                    </Link>

                    <button
                        onClick={handleAdminClick}
                        className="hover:text-pink-500 transition"
                    >
                        Admin
                    </button>
                </div>
            </div>
        </nav>
    );
}
