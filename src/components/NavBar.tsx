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

                <div className="flex gap-6 text-gray-700 font-medium items-center">
                    <Link href="/" className="hover:text-pink-500 transition">
                        Головна
                    </Link>

                    {/* Подарунки бачать усі */}
                    <Link href="/gifts" className="hover:text-pink-500 transition flex items-center gap-1">
                        🎁 Подарунки
                    </Link>

                    {!loading && isAuthed && (
                        <>
                            <Link href="/album" className="hover:text-pink-500 transition">
                                Альбом
                            </Link>
                            {/* Кнопка швидкого додавання подарунка тільки для залогінених */}
                            <Link
                                href="/gifts/add"
                                className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition"
                            >
                                + Бажання
                            </Link>
                        </>
                    )}

                    <Link href="/moments" className="hover:text-pink-500 transition">
                        Moments
                    </Link>

                    <button
                        onClick={handleAdminClick}
                        className="hover:text-pink-500 transition font-semibold"
                    >
                        {isAuthed ? "Admin" : "Увійти"}
                    </button>
                </div>
            </div>
        </nav>
    );
}