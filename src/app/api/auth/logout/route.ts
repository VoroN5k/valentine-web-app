import { CreateClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const supabase = await CreateClient();

        // Це видалить сесію на сервері та очистить cookies
        await supabase.auth.signOut();

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}