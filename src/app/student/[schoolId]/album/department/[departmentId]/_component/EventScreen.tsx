"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type MediaEvent = {
  id: number | string;
  name: string;
  type: "photo" | "video";
  url?: string;
};

type Props = {
  media_event: MediaEvent[];
  schoolId?: number | string | null;
};

export default function MediaEventSection({ media_event, schoolId }: Props) {
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [modal, setModal] = useState<MediaEvent | null>(null);

  return (
    <div className="flex flex-col gap-5">

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
        {media_event?.map((medium) => (
            <li key={medium.id}>
            <div
                onClick={() => setModal(medium)}
                className="block border border-border rounded-md overflow-hidden hover:outline hover:outline-primary-700 transition cursor-pointer"
            >
                {medium.type === "photo" && medium.url && (
                <div className="relative w-full aspect-[3/2] bg-gray-50">
                    <Image
                    src={medium.url}
                    alt="이미지"
                    fill
                    className="object-contain"
                    />
                </div>
                )}

                {medium.type === "video" && medium.url && (
                <video
                    src={medium.url}
                    className="w-full aspect-[3/2] object-contain bg-black"
                    controls
                />
                )}
            </div>
            </li>
        ))}
        </ul>

        {modal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">

                {/* 배경 */}
                <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={() => setModal(null)}
                />

                {/* 닫기 버튼 (화면 기준 우상단) */}
                <button
                onClick={() => setModal(null)}
                className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white text-black shadow-md"
                >
                ✕
                </button>

                {/* 콘텐츠 */}
                <div className="relative z-10 flex items-center justify-center">
                {modal.type === "photo" && modal.url && (
                    <Image
                    src={modal.url}
                    alt=""
                    width={1600}
                    height={1000}
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
                    />
                )}

                {modal.type === "video" && modal.url && (
                <div className="w-[90vw] h-[80vh] flex items-center justify-center">
                    <video
                    src={modal.url}
                    controls
                    className="w-full h-full object-contain rounded-lg bg-black"
                    />
                </div>
                )}
                </div>

            </div>
            )}
    </div>
  );
}