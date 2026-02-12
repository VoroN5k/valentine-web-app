"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Photo {
    id: string;
    url: string;
    name: string;
    caption: string;
}

interface AlbumPhotosProps {
    photos: Photo[];
}

export default function AlbumPhotos({ photos: initialPhotos }: AlbumPhotosProps) {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Перевірка авторизації
    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase().auth.getUser();
            setUser(data.user);
        };
        fetchUser();
    }, []);

    const togglePhoto = (id: string) => {
        setSelectedPhotos(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (!selectedPhotos.length) return;

        try {
            const res = await fetch("/api/deletePhotos", {
                method: "POST",
                body: JSON.stringify({ photoIds: selectedPhotos }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.success) {
                // Видаляємо фото з UI плавно
                setPhotos(prev => prev.filter(p => !selectedPhotos.includes(p.id)));
                setSelectedPhotos([]);
                setDeleteMode(false);
            } else {
                alert(data.error || "Помилка видалення");
            }
        } catch (err) {
            console.error(err);
            alert("Помилка видалення");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative">
            {user && (
                <div className="col-span-full flex justify-end mb-2 gap-2">
                    {!deleteMode ? (
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => setDeleteMode(true)}
                        >
                            Видалити
                        </button>
                    ) : (
                        <>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                onClick={handleDelete}
                            >
                                Підтвердити
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => {
                                    setDeleteMode(false);
                                    setSelectedPhotos([]);
                                }}
                            >
                                Відмінити
                            </button>
                        </>
                    )}
                </div>
            )}

            <AnimatePresence>
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden relative transform hover:scale-105 hover:shadow-2xl"
                    >
                        <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-64 object-cover rounded-t-2xl"
                        />
                        <div className="p-4 flex flex-col items-center">
                            <p className="text-gray-700 text-center text-sm">{photo.caption}</p>
                        </div>

                        {deleteMode && user && (
                            <input
                                type="checkbox"
                                checked={selectedPhotos.includes(photo.id)}
                                onChange={() => togglePhoto(photo.id)}
                                className="absolute top-2 right-2 w-6 h-6 accent-pink-500"
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
