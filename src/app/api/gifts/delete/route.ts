import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const { giftId } = await req.json();

        if (!giftId) {
            return NextResponse.json({ error: "ID не надано" }, { status: 400 });
        }

        // Створюємо адмін-клієнт (ігнорує RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // Переконайся, що цей ключ є в .env.local
            { auth: { persistSession: false } }
        );

        // 1. Отримуємо дані про подарунок (його фото)
        const { data: gift, error: fetchError } = await supabaseAdmin
            .from("gifts")
            .select("image_url")
            .eq("id", giftId)
            .single();

        if (fetchError || !gift) {
            return NextResponse.json({ error: "Подарунок не знайдено" }, { status: 404 });
        }

        // 2. Видаляємо файл зі Storage (якщо є фото)
        if (gift.image_url) {
            const parts = gift.image_url.split("/photos/");
            if (parts.length > 1) {
                // Отримуємо "gifts/назва.jpg", відрізаючи параметри ?t=...
                const filePath = parts[1].split("?")[0];

                console.log("Адмін-видалення файлу:", filePath);

                const { error: storageError } = await supabaseAdmin.storage
                    .from("photos")
                    .remove([filePath]);

                if (storageError) {
                    console.error("Помилка адмін-видалення файлу:", storageError.message);
                } else {
                    console.log("Файл успішно видалено через Admin Role");
                }
            }
        }

        // 3. Видаляємо запис із таблиці
        const { error: dbError } = await supabaseAdmin
            .from("gifts")
            .delete()
            .eq("id", giftId);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Server Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}