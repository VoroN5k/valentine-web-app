"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { name: "PhotoUploader", href: "/admin/dashboard" },

    { name: "Dashboard", href: "/admin/dashboard/main" },
];

export default function AdminNavbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-pink-500 text-white p-4 flex gap-4 shadow-md">
            {links.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg transition ${
                        pathname === link.href ? "bg-white text-pink-500" : "hover:bg-pink-600"
                    }`}
                >
                    {link.name}
                </Link>
            ))}
        </nav>
    );
}
