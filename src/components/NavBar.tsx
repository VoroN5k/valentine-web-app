"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
    const router = useRouter();

    const handleAdminClick = async () => {
        const {
            data: { session },
        } = await supabase().auth.getSession();

        if (session) {
            router.push("/admin/dashboard");
        } else {
            router.push("/admin");
        }
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

                    <Link href="/album" className="hover:text-pink-500 transition">
                        Альбом
                    </Link>

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
