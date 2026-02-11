import "./globals.css";
import Navbar from "@/components/NavBar";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Sasha Valentine",
    description: "Наш сайт валентинки 💖",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uk">
        <body className="bg-white w-screen h-screen overflow-hidden">
        <Navbar />
        <main className="pt-16">{children}</main> {/* pt-16 щоб не перекривало Navbar */}
        </body>
        </html>
    );
}
