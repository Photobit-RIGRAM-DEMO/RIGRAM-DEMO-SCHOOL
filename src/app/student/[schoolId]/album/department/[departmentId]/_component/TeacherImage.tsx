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
  schoolId?: number | string;
};

export default function StaffSection({ staffs, schoolId }: Props) {

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  return (
    <div className="flex flex-col items-center gap-5">
        <h1 className="text-14 md:text-20 font-semibold pt-3 md:pt-6">
          담임
        </h1>
        
        {staffs?.map((staff) => (
          <div
            key={staff.id}
            onClick={() => setSelectedStaff(staff)}
            className="block p-2 md:p-4 cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2 md:gap-4">
        
              {staff.profile_url && (
                <div className="relative w-full max-w-[70px] sm:max-w-[90px] md:max-w-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={staff.profile_url || "/default.png"}
                    alt={staff.position || "staff"}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
        
              <span className="font-medium text-xs md:text-xl text-gray-900 text-center pt-1">
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
        />
      )}

      {/* 텍스트 */}
      <div className="mt-4 text-center text-white">
        <h2 className="text-xl font-semibold">
          {selectedStaff.name} 선생님
        </h2>
        <p className="text-gray-200">
          {selectedStaff.position}
        </p>
      </div>
    </div>
  </div>
)}
        </div>


  );
}
