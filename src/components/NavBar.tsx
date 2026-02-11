"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-pink-500"> <Link href={"/"}>💖 Наш сайт</Link></div>

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
                    <Link href="/admin" className="hover:text-pink-500 transition">
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
}
