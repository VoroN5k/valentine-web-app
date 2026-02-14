import { CreateClient } from "@/lib/supabase/server";
import GiftCard from "@/components/GiftCard";

export const dynamic = "force-dynamic";

export default async function GiftsPage() {
    // 1. Використовуємо правильну назву імпорту (з маленької букви)
    const supabase = await CreateClient();

    // 2. Отримуємо сесію поточного юзера для функцій видалення
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    const { data: gifts, error } = await supabase
        .from("gifts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching gifts:", error);
    }

    // 3. Фільтруємо за owner_name, як у вашому робочому коді
    const boyGifts = gifts?.filter(g => g.owner_name === 'boy') || [];
    const girlGifts = gifts?.filter(g => g.owner_name === 'girl') || [];

    return (
        <div className="p-6 pt-24 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Наші Списки Бажань 🎁</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {/* Секція Хлопця */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 border-b-2 border-blue-100 pb-2">
                        <span>🧔</span> Мої мрії
                    </h2>
                    {boyGifts.length > 0 ? (
                        boyGifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                currentUserId={currentUserId}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 italic">Поки що пусто...</p>
                    )}
                </div>

                {/* Секція Дівчини */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2 border-b-2 border-pink-100 pb-2">
                        <span>👩‍🦰</span> Її мрії
                    </h2>
                    {girlGifts.length > 0 ? (
                        girlGifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                currentUserId={currentUserId}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 italic">Ще нічого не загадала...</p>
                    )}
                </div>
            </div>
        </div>
    );
}