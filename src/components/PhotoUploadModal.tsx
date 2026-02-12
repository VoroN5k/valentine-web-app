"use client";

import { useState } from "react";

interface ModalProps {
    file: File;
    onClose: () => void;
    onUploaded?: () => void;
}

export default function PhotoUploadModal({ file, onClose, onUploaded }: ModalProps) {
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async () => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                if (onUploaded) onUploaded();
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-pink-500">Додати підпис</h2>
                <p className="text-sm text-gray-600">{file.name}</p>
                <input
                    type="text"
                    placeholder="Підпис до фото"
                    className="border rounded-lg px-2 py-1 w-full"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        disabled={uploading}
                    >
                        Відмінити
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        disabled={uploading}
                    >
                        {uploading ? "Завантаження..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}
