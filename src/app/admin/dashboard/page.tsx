"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const check = async () => {
            const { data } = await supabase().auth.getUser();

            if(!data.user){
                router.push("/admin");
                return;
            }

            setChecking(false);
        };

        check();
    }, [router]);

    const logout = async () => {
        await supabase().auth.signOut();
        router.push("/admin");
    };

    if (checking) return <p className="text-white mt-10">Перевіряю доступ...</p>;

    return (
        <div className="w-full max-w-4xl mt-10 mx-auto p-8 rounded-3xl bg-white/10 border border-white/15 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
                >
                    Вийти
                </button>
            </div>

            <p className="text-white/70">Тут буде адмінка для завантаження фото та додавання текстів 💖</p>
        </div>
    );

}