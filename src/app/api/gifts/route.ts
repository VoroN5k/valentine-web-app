import { NextRequest, NextResponse} from "next/server";
import { CreateClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest ) {
    const supabase = await CreateClient();

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const owner_name = formData.get("owner_name") as string;

        const giftData = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            price: formData.get("price") as string,
            link: formData.get("link") as string,
            owner_name: owner_name
        };

        let image_url = "";

        if (file) {
            const filePath = `gifts/${Date.now ()}-${file.name}`;
            const uploadRes = await supabase.storage
                .from("photos")
                .upload(filePath, file);

            if (uploadRes.error) throw uploadRes.error;
            const { data: urlData } = supabase.storage.from ("photos").getPublicUrl(filePath);
            image_url = urlData.publicUrl;
        }

        const { data, error } = await supabase
            .from("gifts")
            .insert([{ ...giftData, image_url }])
            .select()

        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch ( err:any ){
        return NextResponse.json({error: err.message}, { status: 500 });
    }
}