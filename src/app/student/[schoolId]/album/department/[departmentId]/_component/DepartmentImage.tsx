"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  imageUrl: string | null;
}

export default function DepartmentImage({ imageUrl }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[1100px] rounded-lg overflow-hidden">
        <Image
            src={imageUrl || "/default.png"}
            alt="반 이미지"
            width={0}
            height={0}
            sizes="100vw"
            className={`w-full h-auto object-contain transition-opacity cursor-pointer ${
            loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            
            {/* 블러 + 어두운 배경 */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* ❗ X 버튼 (화면 기준 우상단) */}
            <button
              onClick={() => setIsOpen(false)}
              className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>

            {/* 이미지 영역 */}
            <div className="relative z-10 max-w-[90vw] max-h-[90vh]">
              <Image
                src={imageUrl || "/default.png"}
                alt="학과 이미지"
                width={1600}
                height={900}
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-lg object-contain"
              />
            </div>
          </div>
        )}
    </div>
  );
}