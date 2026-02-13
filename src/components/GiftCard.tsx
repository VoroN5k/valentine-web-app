export default function GiftCard({ gift }: { gift: any }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex border border-gray-100 hover:shadow-xl transition">
            <div className="w-1/3 h-32 relative">
                <img src={gift.image_url || "/no-image.png"} className="absolute inset-0 w-full h-full object-cover" alt="" />
            </div>
            <div className="p-4 w-2/3 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg leading-tight">{gift.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-1">{gift.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-pink-600 font-bold">{gift.price}</span>
                    {gift.link && (
                        <a href={gift.link} target="_blank" className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-pink-100 transition">
                            Посилання 🔗
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}