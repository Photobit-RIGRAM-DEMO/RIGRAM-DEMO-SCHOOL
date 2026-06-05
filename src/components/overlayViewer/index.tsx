'use client';

import type { Media } from '@/types/media';
import { X } from 'lucide-react';
import Image from 'next/image';

interface OverlayViewerProps {
  media: Media | null;
  members?: string[];
  onClose: () => void;
}

export default function OverlayViewer({ media, members, onClose }: OverlayViewerProps) {
  if (!media) return null;

  const isMediaObject = typeof media === 'object' && media !== null;
  const mediaUrl = isMediaObject ? media.url : media;
  const mediaType = isMediaObject ? media.type : 'image';
  const videoThumbnail =
    isMediaObject && media.type === 'video' ? media.video_thumbnail : undefined;

  return (
    <div className="fixed inset-0 bg-gray-200 z-50 flex items-center justify-center">
      <button className="absolute top-5 right-5 text-black/70 hover:text-black" onClick={onClose}>
        <X size={26} />
      </button>

      <div className="flex flex-col items-center">
        <div className="w-[75vw] h-[75vh] relative">
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <Image src={mediaUrl} alt="" fill className="object-contain" />
          )}
        </div>

        <div className="mt-6 text-center text-black/60 text-2xl">
          {media.title}  {members?.join(', ')}
        </div>
      </div>
    </div>
    
  );
}
