import { NextRequest, NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = await CreateClient();
    const { giftId } = await req.json();

    try {
        // 1. Отримуємо дані про подарунок, щоб видалити фото
        const { data: gift } = await supabase
            .from("gifts")
            .select("image_url, user_id")
            .eq("id", giftId)
            .single();

        if (!gift) return NextResponse.json({ error: "Не знайдено" }, { status: 404 });


        if (gift.image_url) {
            const path = gift.image_url.split("/photos/")[1];
            if (path) {
                await supabase.storage.from("photos").remove([path]);
            }
        }


        const { error } = await supabase
            .from("gifts")
            .delete()
            .eq("id", giftId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}