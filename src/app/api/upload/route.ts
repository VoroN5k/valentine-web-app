import { NextRequest, NextResponse } from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const supabaseServer = await CreateClient();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string || "";

    if (!file) return NextResponse.json({ error: "No file provided" });

    const filePath = `public/${Date.now()}-${file.name}`;

    // Upload у Storage
    const { error: uploadError } = await supabaseServer.storage
        .from("photos")
        .upload(filePath, file, { upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message });

    // Отримання public URL
    const { data: urlData } = supabaseServer.storage
        .from("photos")
        .getPublicUrl(filePath);

    if (!urlData?.publicUrl) return NextResponse.json({ error: "Failed to get public URL" });

    // Insert у таблицю з caption
    const { data: insertData, error: insertError } = await supabaseServer
        .from("photos")
        .insert([{ url: urlData.publicUrl, name: file.name, caption }])
        .select();

    if (insertError) return NextResponse.json({ error: insertError.message });

    return NextResponse.json({ data: insertData, url: urlData.publicUrl });
}
