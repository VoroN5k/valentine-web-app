"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function YesAnimation() {
    const [phase, setPhase] = useState<"spin" | "gif">("spin");

    useEffect(() => {
        const t = setTimeout(() => setPhase("gif"), 1200);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="w-full max-w-xl relative">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-white/10 blur-2xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-10">
                <div className="flex flex-col items-center text-center">
                    {phase === "spin" ? (
                        <>
                            <div className="text-7xl select-none animate-[spin_1.2s_linear_infinite]">
                                💖
                            </div>
                            <h2 className="mt-6 text-3xl font-extrabold">
                                урааааааа 😭❤️
                            </h2>
                            <p className="mt-2 text-black/80">
                                я щас розплавлюсь від щастя…
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="relative w-[220px] h-[220px] rounded-3xl overflow-hidden border border-white/15 shadow-xl">
                                <Image
                                    src="/gifs/catkiss.gif"
                                    alt="Love gif"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <h2 className="mt-6 text-3xl font-extrabold">
                                тепер ти офіційно моя валентинка 💘
                            </h2>

                            <p className="mt-2 text-black/80">
                                (і я тебе більше не відпущу 😼)
                            </p>

                            <div className="mt-6 flex gap-3 flex-wrap justify-center">
                <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  💞
                </span>
                                <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  🌸
                </span>
                                <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  🥺
                </span>
                                <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  ❤️
                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
