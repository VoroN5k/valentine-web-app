
import { CreateClient } from "@/lib/supabase/server";
import GiftCard from "@/components/GiftCard";

export default async function GiftsPage() {
    const supabase = await CreateClient();
    const { data: gifts } = await supabase
        .from("gifts")
        .select("*")
        .order("created_at", { ascending: false });

    const boyGifts = gifts?.filter(g => g.owner_name === 'boy') || [];
    const girlGifts = gifts?.filter(g => g.owner_name === 'girl') || [];

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-center mb-10">Наші Списки Бажань 🎁</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {/* Секція Хлопця */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <span>🧔</span> Мої мрії
                    </h2>
                    {boyGifts.length > 0 ? (
                        boyGifts.map(gift => <GiftCard key={gift.id} gift={gift} />)
                    ) : (
                        <p className="text-gray-400 italic">Поки що пусто...</p>
                    )}
                </div>

                {/* Секція Дівчини */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
                        <span>👩‍🦰</span> Її мрії
                    </h2>
                    {girlGifts.length > 0 ? (
                        girlGifts.map(gift => <GiftCard key={gift.id} gift={gift} />)
                    ) : (
                        <p className="text-gray-400 italic">Ще нічого не загадала...</p>
                    )}
                </div>
            </div>
        </div>
    );
}