"use client";

import { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

type Props = {
    onFilesSelected: (files: FileList) => void;
    uploading: boolean;
};

export default function PhotoUploader({ onFilesSelected, uploading }: Props) {
    const dropRef = useRef<HTMLDivElement | null>(null);
    const [hover, setHover] = useState(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHover(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHover(true);
    };

    const handleDragLeave = () => setHover(false);

    const handleClick = () => {
        if (dropRef.current) {
            const input = dropRef.current.querySelector<HTMLInputElement>("input");
            input?.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onFilesSelected(e.target.files);
    };

    return (
        <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className={`
                w-full max-w-xl p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer
                transition-all duration-300 shadow-md bg-white
                ${hover ? "border-pink-500 bg-pink-50 scale-105" : "border-pink-400"}
            `}
        >
            <div className="flex flex-col items-center gap-2">
                <FiUploadCloud size={48} className={`text-pink-400 ${hover ? "text-pink-500" : ""} transition-colors`} />
                {uploading ? (
                    <p className="text-pink-500 font-semibold mt-2">Завантаження...</p>
                ) : (
                    <p className="text-gray-500 font-medium mt-2">
                        Перетягніть сюди файли або клікніть для вибору
                    </p>
                )}
            </div>
            <input
                type="file"
                multiple
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}
