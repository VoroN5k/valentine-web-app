"use client";

import PhotoUploader from "@/components/PhotoUploader";

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)]">
            <h1 className="text-2xl font-bold text-pink-500 mb-6">Адмінка: Завантаження фото</h1>
            <PhotoUploader />
        </div>
    );
}
