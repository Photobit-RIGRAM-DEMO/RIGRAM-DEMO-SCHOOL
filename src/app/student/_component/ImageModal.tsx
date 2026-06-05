"use client";

import Image from "next/image";

type Props = {
  isOpen: boolean;
  src: string | null;
  width?: number;
  height?: number;
  onClose: () => void;
  alt?: string;
};

export default function ImageModal({
  isOpen,
  src,
  width = 2000,
  height = 1200,
  onClose,
  alt = "image",
}: Props) {
  if (!isOpen || !src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* X 버튼 */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white text-black shadow-md"
      >
        ✕
      </button>

      {/* 이미지 */}
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-[90vw] h-[85vh] object-contain"
        />
      </div>

    </div>
  );
}