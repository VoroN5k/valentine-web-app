import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const { photoIds }: { photoIds: string[] } = await req.json();

        if (!photoIds?.length) {
            return NextResponse.json({ error: "Не обрано фото для видалення" }, { status: 400 });
        }

        // Використовуємо адмін-клієнт для гарантованого видалення
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false } }
        );

        // 1. Отримуємо дані про фото (нам потрібен URL, щоб знайти шлях у Storage)
        const { data: photos, error: fetchError } = await supabaseAdmin
            .from("photos")
            .select("id, url")
            .in("id", photoIds);

        if (fetchError || !photos) {
            return NextResponse.json({ error: fetchError?.message || "Фото не знайдено" }, { status: 400 });
        }

        // 2. Видаляємо файли зі Storage
        const filesToRemove = photos.map(photo => {
            // Витягуємо чистий шлях.
            // Шукаємо все, що йде після імені бакета "photos/"
            const parts = photo.url.split("/photos/");
            return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean) as string[];

        if (filesToRemove.length > 0) {
            const { error: storageError } = await supabaseAdmin.storage
                .from("photos")
                .remove(filesToRemove);

            if (storageError) {
                console.error("Помилка видалення зі Storage:", storageError);
                // Продовжуємо далі, щоб видалити хоча б записи з БД
            }
        }

        // 3. Видаляємо записи з таблиці БД
        const { error: dbError } = await supabaseAdmin
            .from("photos")
            .delete()
            .in("id", photoIds);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Server Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}