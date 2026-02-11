"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AlbumPage() {
    const [photos, setPhotos] = useState<{ id: string; url: string; name: string }[]>([]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        const { data, error } = await supabase().from("photos").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error(error);
            return;
        }
        setPhotos(data as any);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Альбом</h1>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((p) => (
                    <div key={p.id}>
                        <img src={p.url} alt={p.name} className="w-full h-48 object-cover rounded shadow" />
                    </div>
                ))}
            </div>
        </div>
    );
}
