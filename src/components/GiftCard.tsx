"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function GiftCard({ gift, currentUserId }: { gift: any, currentUserId: string | undefined }) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    // Перевіряємо, чи є поточний користувач власником цього бажання
    const isOwner = currentUserId === gift.user_id;

    const handleDelete = async () => {
        if (!confirm("Ви впевнені, що хочете видалити це бажання?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch("/api/gifts/delete", {
                method: "POST",
                body: JSON.stringify({ giftId: gift.id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                router.refresh(); // Оновлюємо сторінку, щоб прибрати картку
            } else {
                alert("Помилка при видаленні");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden flex border border-gray-100 relative group ${isDeleting ? "opacity-50" : ""}`}>
            {/* Кнопка трьох крапок - показуємо тільки власнику */}
            {isOwner && (
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-xl py-1 z-20">
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                🗑️ Видалити
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="w-1/3 h-32 relative">
                <img src={gift.image_url || "/no-image.png"} className="absolute inset-0 w-full h-full object-cover" alt="" />
            </div>

            <div className="p-4 w-2/3 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg leading-tight pr-6">{gift.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-1">{gift.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-pink-600 font-bold">{gift.price}</span>
                    {gift.link && (
                        <a href={gift.link} target="_blank" className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-pink-100 transition">
                            Лінк 🔗
                        </a>
                    )}
                </div>
            </div>

            {/* Закриття меню при кліку зовні */}
            {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)}></div>}
        </div>
    );
}