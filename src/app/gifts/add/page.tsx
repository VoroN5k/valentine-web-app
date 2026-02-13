"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddGiftPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);


        const res = await fetch("/api/gifts", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            router.push("/gifts");
            router.refresh();
        } else {
            alert("Помилка при збереженні");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Додати бажання ✨</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Назва (напр. LEGO Star Wars)" required
                       className="w-full p-2 border rounded" />

                <input type="text" name="price" placeholder="Ціна (напр. 2500 грн)"
                       className="w-full p-2 border rounded" />

                <input type="url" name="link" placeholder="Посилання на магазин"
                       className="w-full p-2 border rounded" />

                <textarea name="description" placeholder="Опис або чому це важливо"
                          className="w-full p-2 border rounded" />

                <select name="owner_name" className="w-full p-2 border rounded bg-gray-50">
                    <option value="boy">Для нього 🧔</option>
                    <option value="girl">Для неї 👩‍🦰</option>
                </select>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">Фото подарунка:</label>
                    <input type="file" name="file" accept="image/*" className="text-sm" />
                </div>

                <button type="submit" disabled={loading}
                        className="w-full bg-pink-500 text-white p-3 rounded-lg font-bold hover:bg-pink-600 disabled:bg-gray-400">
                    {loading ? "Завантаження..." : "Додати у список"}
                </button>
            </form>
        </div>
    );
}