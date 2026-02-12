"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/AdminNavbar";

interface Props {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase().auth.getSession();
            setSession(session);
            setLoading(false);

            // якщо користувач на dashboard і неавторизований → редірект
            if (!session && window.location.pathname.startsWith("/admin/dashboard")) {
                router.replace("/admin");
            }
        };

        checkSession();

        // слухаємо зміни сесії (логін/логаут)
        const { data: listener } = supabase().auth.onAuthStateChange((_event, session) => {
            setSession(session);

            if (!session && window.location.pathname.startsWith("/admin/dashboard")) {
                router.replace("/admin");
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [router]);

    if (loading) return null;

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col">
            {session && <Navbar />}
            <main className="flex-1">{children}</main>
        </div>
    );
}
