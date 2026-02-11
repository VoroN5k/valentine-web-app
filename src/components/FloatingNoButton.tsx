"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, min: number, max: number){
    return Math.max(min, Math.min(max, n));
}


export default function FloatingNoButton() {
    const btnRef = useRef<HTMLButtonElement | null>(null);

    const [pos, setPos] = useState<{ x: number, y: number } | null> (null);
    const [mounted, setMounted] = useState(false);

    const padding = 16;

    useEffect(() => {
        setMounted(true);

        setPos({x: 0,y: 0});
    }, []);

    const moveRandom = () => {
        const btn = btnRef.current;
        if(!btn) return;

        const rect = btn.getBoundingClientRect();

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const maxY = vw - rect.width - padding;
        const maxX = vh - rect.height - padding;

        let x = Math.floor(Math.random() * maxX);
        let y = Math.floor(Math.random() * maxY);

        x = clamp(x, padding, maxX);
        y = clamp(y, padding, maxY);

        setPos({x, y});

    }

    if (!mounted || !pos) {
        return (
            <button
                ref={btnRef}
                type="button"
                className="px-7 py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition font-semibold border border-white/15"
            >
                Ні 😅
            </button>
        );
    }

    return (
        <button
            ref={btnRef}
            type="button"
            onMouseEnter={moveRandom}
            onClick={moveRandom}
            style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: 50,
            }}
            className="px-7 py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition font-semibold border border-white/15 shadow-lg"
        >
            Ні 😅
        </button>
    );
}
