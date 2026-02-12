"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LogOutButton from "@/components/LogOutButton";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoUploadModal from "@/components/PhotoUploadModal";

export default function AdminDashboard() {
    const [files, setFiles] = useState<{ id: string; url: string; name: string }[]>([]);
    const [uploading, setUploading] = useState(false);

    const [modalFile, setModalFile] = useState<File | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const router = useRouter();

    // Перевірка авторизації
    useEffect(() => {
        supabase().auth.getSession().then(({ data: { session } }) => {
            if (!session) router.push("/admin");
        });
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        const { data, error } = await supabase()
            .from("photos")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) return console.error(error);
        setFiles(data as any);
    };

    // Викликаємо модал при виборі файлів
    const handleFilesSelected = (files: FileList) => {
        if (files.length === 0) return;
        setModalFile(files[0]); // модал показуємо для першого файлу
        setModalVisible(true);
    };

    // Фактичний аплоад викликається з модала
    const uploadFileWithCaption = async (file: File, caption: string) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.error) console.error("Upload error:", data.error);
            fetchPhotos();
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, url: string) => {
        const path = url.split("/storage/v1/object/public/photos/")[1];
        await supabase().storage.from("photos").remove([path]);
        await supabase().from("photos").delete().eq("id", id);
        fetchPhotos();
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            {/* Верхня панель з кнопкою Вийти */}
            <div className="w-full flex justify-end mb-6">
                <LogOutButton />
            </div>

            <h1 className="text-2xl font-bold text-pink-500 mb-6">Адмін панель: Завантаження фото</h1>

            {/* Drag & Drop зона */}
            <PhotoUploader uploading={uploading} onFilesSelected={handleFilesSelected} />

            {/* Галерея фото */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mt-6">
                {files.map((f) => (
                    <div
                        key={f.id}
                        className="relative rounded overflow-hidden shadow-lg hover:scale-105 transition-transform"
                    >
                        <img src={f.url} alt={f.name} className="w-full h-48 object-cover" />
                        <button
                            onClick={() => handleDelete(f.id, f.url)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
                        >
                            Видалити
                        </button>
                    </div>
                ))}
            </div>

            {/* Модал */}
            {modalVisible && modalFile && (
                <PhotoUploadModal
                    file={modalFile}
                    onClose={() => setModalVisible(false)}
                    onUploaded={() => setModalVisible(false)}
                />
            )}
        </div>
    );
}
