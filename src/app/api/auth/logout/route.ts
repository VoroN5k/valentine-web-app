
import { supabaseServer } from "@/lib/supabase/server";

export async function POST() {
    try {

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200 }
        );
    } catch (err: any) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 }
        );
    }
}
