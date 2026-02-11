"use client";

import { useRef, useState, useEffect } from "react";

export default function FloatingNoButton() {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const padding = 16;

    // стартова позиція праворуч від кнопки "Так"
    useEffect(() => {
        const btn = btnRef.current;
        const yesButton = document.getElementById("yes-button");
        if (!btn || !yesButton) return;

        const yesRect = yesButton.getBoundingClientRect();

        // ставимо кнопку трохи правіше і по центру висоти кнопки "Так"
        setPos({
            x: yesRect.right + 16, // 16px відступ праворуч
            y: yesRect.top + yesRect.height / 2 - btn.offsetHeight / 2,
        });
    }, []);

    // рух кнопки по всьому екрану при наведенні
    const moveButton = () => {
        const btn = btnRef.current;
        if (!btn) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const maxX = vw - btn.offsetWidth - padding;
        const maxY = vh - btn.offsetHeight - padding;

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        setPos({ x, y });
    };

    return (
        <button
            ref={btnRef}
            onMouseEnter={moveButton}
            style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                transition: "left 0.4s ease, top 0.4s ease", // плавний рух
                zIndex: 50,
            }}
            className="px-7 py-3 rounded-2xl bg-pink-500 text-white font-semibold shadow-lg border border-pink-600 cursor-pointer"
        >
            Ні 😅
        </button>
    );
}
