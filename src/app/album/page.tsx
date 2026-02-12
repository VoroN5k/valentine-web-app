// src/app/album/page.tsx
import { CreateClient } from "@/lib/supabase/server";
import AlbumPhotos from "@/components/AlbumPhotos";

// 🚀 Додаємо цей рядок, щоб Next.js завжди отримував свіжі дані з бази
export const dynamic = "force-dynamic";

export default async function AlbumPage() {
    const supabase = await CreateClient();

    // Отримуємо фото з бази
    const { data: photos, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
        return (
            <p className="text-red-500 text-center mt-10">
                Помилка завантаження фото: {error.message}
            </p>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">Наш Альбом 💖</h1>

            {/* Додаємо перевірку на довжину масиву */}
            {!photos || photos.length === 0 ? (
                <p className="text-gray-500 text-center">Фотографії поки що відсутні 😢</p>
            ) : (
                <AlbumPhotos photos={photos} />
            )}
        </div>
    );
}