import { supabaseServer } from "@/lib/supabase/server";

export default async function AlbumPage() {
    const { data: photos, error } = await supabaseServer
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return <p>Помилка завантаження фото: {error.message}</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto grid grid-cols-3 gap-4">
            {photos?.map(photo => (
                <div key={photo.id} className="flex flex-col">
                    <img src={photo.url} alt={photo.name} className="w-full h-48 object-cover rounded-lg" />
                    <p className="mt-2 text-sm text-gray-700">{photo.caption}</p>
                </div>
            ))}
        </div>
    );
}
