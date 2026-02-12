"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [files, setFiles] = useState<{ id: string; url: string; name: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const dropRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    // Перевірка авторизації
    useEffect(() => {
        supabase().auth.getSession().then(({ data: { session } }) => {
            if (!session) router.push("/admin");
        });
        fetchPhotos();
    }, []);

    // Завантажуємо фото з таблиці
    const fetchPhotos = async () => {
        const { data, error } = await supabase().from("photos").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error(error);
            return;
        }
        setFiles(data as any);
    };

    // Обробка файлів
    const handleFiles = async (files: FileList) => {
        setUploading(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log("Step 1: got file", file.name);

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.error) {
                console.error("Upload error:", data.error);
            }

            console.log("Step 2: got response, public url + inserted: ", data, data.url);
        }


        setUploading(false);
        fetchPhotos();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDelete = async (id: string, url: string) => {
        const path = url.split("/storage/v1/object/public/photos/")[1];
        await supabase().storage.from("photos").remove([`public/${path}`]);
        await supabase().from("photos").delete().eq("id", id);
        fetchPhotos();
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Адмін панель</h1>

            {/* Drag & Drop зона */}
            <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="mb-6 border-2 border-dashed border-pink-400 rounded-lg p-8 text-center text-gray-500 hover:border-pink-500 transition cursor-pointer"
            >
                {uploading ? "Завантаження..." : "Перетягніть сюди файли або клікніть для вибору"}
                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
            </div>

            {/* Галерея фото */}
            <div className="grid grid-cols-3 gap-4">
                {files.map((f) => (
                    <div key={f.id} className="relative">
                        <img src={f.url} alt={f.name} className="w-full h-48 object-cover rounded shadow" />
                        <button
                            onClick={() => handleDelete(f.id, f.url)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Видалити
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
