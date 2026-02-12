import { NextRequest, NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const { photoIds }: { photoIds: string[] } = await req.json();

        if (!photoIds?.length) {
            return NextResponse.json({ error: "No photos selected" }, { status: 400 });
        }

        const supabase = await CreateClient();

        // Отримуємо URL фото для видалення зі Storage
        const { data: photos, error } = await supabase
            .from("photos")
            .select("id, url")
            .in("id", photoIds);

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        // Видаляємо файли зі Storage
        for (const photo of photos!) {
            const path = photo.url.split("/storage/v1/object/public/photos/")[1];
            if (path) {
                const { error: storageError } = await supabase.storage
                    .from("photos")
                    .remove([path]);
                if (storageError) console.error("Storage delete error:", storageError);
            }
        }

        // Видаляємо рядки з таблиці
        const { error: delError } = await supabase
            .from("photos")
            .delete()
            .in("id", photoIds);

        if (delError) return NextResponse.json({ error: delError.message }, { status: 400 });

        return NextResponse.json({ success: true, deletedIds: photoIds });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
