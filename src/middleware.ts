import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
    let res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    res = NextResponse.next();
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    const pathname = req.nextUrl.pathname;

    const protectedRoutes = ["/album", "/admin/dashboard"];
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtected && !session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/admin";
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: ["/album/:path*", "/admin/dashboard/:path*"],
};
