"use client";

import { useState } from "react";

export default function LogOutButton() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            const data = await res.json();

            if (data.success) {
                // Це ключовий момент: викликаємо клієнтський logout Supabase
                // Щоб видалити сесію
                const { supabase } = await import("@/lib/supabase/client");
                await supabase().auth.signOut();

                window.location.href = "/admin"; // редірект на логін
            } else {
                alert(data.error || "Помилка при виході");
            }
        } catch (err) {
            console.error(err);
            alert("Помилка при виході");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
        >
            {loading ? "Вихід..." : "Вийти"}
        </button>
    );
}
