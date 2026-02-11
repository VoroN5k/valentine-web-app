import "./globals.css"; // <-- підключаємо тут
import { ReactNode } from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Sasha Valentine",
    description: "Наш сайт для валентинки 💖",
};


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="uk">
        <body>
        {children}
        </body>
        </html>
    );
}
