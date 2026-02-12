import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    // Створюємо прямий адмін-клієнт, щоб обійти RLS
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    );

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const caption = formData.get("caption") as string || "";

        if (!file) {
            return NextResponse.json({ error: "Файл не знайдено" }, { status: 400 });
        }

        // 1. Формуємо шлях: папка 'public' + унікальне ім'я файлу
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `public/${fileName}`; // ЦЕ ЗАПИСУЄ ФАЙЛ У ПАПКУ public

        // 2. Завантаження у Storage бакет "photos"
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("photos")
            .upload(filePath, file, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error("Storage Error:", uploadError);
            return NextResponse.json({ error: `Помилка сховища: ${uploadError.message}` }, { status: 500 });
        }

        // 3. Отримання публічного URL
        const { data: urlData } = supabaseAdmin.storage
            .from("photos")
            .getPublicUrl(filePath);

        // 4. Запис у таблицю БД
        // Переконайтеся, що в таблиці 'photos' є колонки: url, name, caption
        const { data: insertData, error: insertError } = await supabaseAdmin
            .from("photos")
            .insert([
                {
                    url: urlData.publicUrl,
                    name: filePath, // зберігаємо повний шлях з папкою public/
                    caption: caption,
                },
            ])
            .select();

        if (insertError) {
            // Якщо файл завантажився, а в БД не записалось - краще видалити файл зі сховища, щоб не смітити
            await supabaseAdmin.storage.from("photos").remove([filePath]);

            console.error("Database Error:", insertError);
            return NextResponse.json({ error: `Помилка БД: ${insertError.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: insertData });

    } catch (err: any) {
        console.error("Server Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}