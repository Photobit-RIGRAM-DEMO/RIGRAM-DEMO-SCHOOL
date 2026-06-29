"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Staff = {
  id: number | string;
  name: string;
  position?: string;
  profile_url?: string;
};

type Props = {
  staffs: Staff[];
  schoolId?: number | string | null;
};

export default function StaffSection({ staffs, schoolId }: Props) {

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  return (
    <div className="flex flex-col items-center md:gap-5 pr-1 sm:pr-0 mt-3 sm:mt-0 mb-3 sm:mb-0">
        <h1 className="text-[8px] sm:text-2xl font-semibold pt-2 sm:pt-6">
            담임
        </h1>

        {staffs?.map((staff) => (
            <div
            key={staff.id}
            onClick={() => setSelectedStaff(staff)}
            className="block p-2 sm:p-4 cursor-pointer"
            >
              <div className="flex flex-col items-center gap-2 md:gap-4">

                  {staff.profile_url && (
                  <div className="relative w-full max-w-[90px] sm:max-w-[300px] rounded-lg overflow-hidden">
                      <Image
                      src={staff.profile_url || "/default.png"}
                      alt={staff.position || "staff"}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto object-contain"
                      unoptimized
                      />
                  </div>
                  )}

                  <span className="font-medium ext-10 text-[8px] sm:text-2xl text-gray-900 text-center md:pt-5">
                  {staff.name} 선생님
                  </span>

              </div>
            </div>
        ))}

       {selectedStaff && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
            onClick={() => setSelectedStaff(null)}
          >
            {/* X 버튼 (화면 기준 우상단) */}
            <button
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white text-black"
              onClick={() => setSelectedStaff(null)}
            >
              ✕
            </button>

            <div
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 이미지 */}
              {selectedStaff.profile_url && (
                <Image
                  src={selectedStaff.profile_url || "/default.png"}
                  alt={selectedStaff.name}
                  width={1000}
                  height={1000}
                  className="w-auto max-w-[90vw] max-h-[85vh] h-auto object-contain"
                  unoptimized
                />
              )}

              {/* 텍스트 */}
              <div className="mt-4 text-center text-white">
                <p className="mt-2 text-center text-white text-sm sm:text-2xl font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {selectedStaff.name} 선생님
                </p>
              </div>
            </div>
          </div>
        )}
        </div>


  );
}