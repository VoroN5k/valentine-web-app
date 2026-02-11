"use client";

import { useState } from "react";
import FloatingNoButton from "./FloatingNoButton";
import YesAnimation from "./YesAnimation";

export default function ValentineCard() {
    const [answeredYes, setAnsweredYes] = useState(false);

    if (answeredYes) {
        return <YesAnimation />;
    }

    return (
        <div
            id="valentine-container"
            className="relative w-full h-full flex flex-col items-center justify-center"
        >
            <div className="relative rounded-3xl w-[90%] max-w-md h-[400px] md:h-[500px] border border-gray-300 bg-white shadow-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-3 select-none">💖</div>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-800">
                    ти будеш моєю валентикою?
                </h1>

                <p className="mt-3 text-gray-600 text-sm md:text-base">
                    (обережно… кнопка “ні” трохи з характером 😼)
                </p>

                <div className="mt-8 flex gap-4 mr-29">
                    <button
                        id="yes-button"
                        onClick={() => setAnsweredYes(true)}
                        className="px-7 py-3 rounded-2xl bg-pink-500 text-white hover:bg-pink-400 font-semibold shadow-lg transition cursor-pointer"
                    >
                        Так 💘
                    </button>


                    <FloatingNoButton />
                </div>
            </div>
        </div>
    );
}
