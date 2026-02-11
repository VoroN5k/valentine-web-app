"use client";

import { useState } from "react";
import FloatingNoButton from "@/components/FloatingNoButton";
import YesAnimation from "@/components/YesAnimation";

export default function ValentineCard() {
    const [answeredYes, setAnsweredYes] = useState(false);

    if (answeredYes) {
        return <YesAnimation />;
    }

    return (
        <div className="relative w-full max-w-xl">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-[2.5rem] bg-white/10 blur-2xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-8 md:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className="text-6xl mb-3 select-none">💖</div>

                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        ти будеш моєю валентикою?
                    </h1>

                    <p className="mt-3 text-white/80 text-sm md:text-base">
                        (обережно… кнопка “ні” трохи з характером 😼)
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => setAnsweredYes(true)}
                            className="px-7 py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 active:scale-[0.98] transition font-semibold shadow-lg"
                        >
                            Так 💘
                        </button>

                        <FloatingNoButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
