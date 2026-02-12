// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: { headers: req.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Використовуйте ANON_KEY
        {
            cookies: {
                getAll: () => req.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const pathname = req.nextUrl.pathname;

    const protectedRoutes = ["/album", "/admin/dashboard"];

    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (pathname === "/admin" && session) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/album/:path*", "/admin/dashboard/:path*", "/admin"],
};