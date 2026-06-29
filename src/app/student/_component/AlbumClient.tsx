'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ImageModal from '../_component/ImageModal';

export default function AlbumClient({
  user,
  school,
  foregroundList,
  histories,
  symbolList,
  executives,
  departments,
}: any) {
  const [modal, setModal] = useState<{
    url?: string;
    width?: number;
    height?: number;
    text?: string;
  } | null>(null);

  const motto = symbolList?.find((s: any) => s.title === 'motto');
  const tree = symbolList?.find((s: any) => s.title === 'tree');
  const flower = symbolList?.find((s: any) => s.title === 'flower');
  const flag = symbolList?.find((s: any) => s.title === 'flag');
  const song = symbolList?.find((s: any) => s.title === 'song');

  const symbols = [
    { title: '교기', image: flag?.url },
    { title: '교목', image: tree?.url, description: tree?.description },
    { title: '교화', image: flower?.url, description: flower?.description },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8 bg-[#f6f3ee] p-3 sm:p-10">

     <section className="w-full px-4 md:px-10 py-6">
        {user?.user_type === 'admin' && (
        <Link
          href={`/admin/${school?.id}`}
          className="mt-4 w-full max-w-[1600px] mx-auto block bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl shadow hover:shadow-lg transition text-center"
        >
          관리 페이지로 이동
        </Link>
        )}
      </section>

      {/* =========================
          학교 헤더
      ========================= */}
      <section className="w-full px-4 md:px-10 py-0 sm:py-6">
        <div className="w-full mx-auto pb-4 relative">

                <div className="flex justify-center w-full mb-3 sm:mb-10">
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full min-w-0">

                    <div className="relative w-[60px] sm:w-[90px] md:w-[130px] lg:w-[150px] aspect-square flex-shrink-0">
                      {school?.school_img_url && (
                        <Image
                          src={school.school_img_url as string}
                          alt="학교 이미지"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>

                    <h1 className="min-w-0 font-semibold text-gray-800 tracking-tight whitespace-nowrap text-[clamp(0.75rem,3vw,1.5rem)]">
                      2026년 {school?.school_name} 전자졸업앨범
                    </h1>

                  </div>
                </div>
          </div>
      </section>

      {/* =========================
          전경 이미지
      ========================= */}
      <section className="w-full">
        <div
          onClick={() =>
          setModal({
            url: foregroundList[0].url || "",
            width: 2400,
            height: 1200,
          })}
          className="w-full max-w-[1600px] mx-auto aspect-[5/2] md:aspect-[2/1] relative rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)] cursor-pointer"
        >
        {foregroundList[0]?.url ? (
          <>
            {/* 배경 이미지 */}
            <Image
              src={foregroundList[0].url}
              alt="배경"
              fill
              className="object-cover z-0"
              unoptimized
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <span className="text-gray-500 text-lg md:text-2xl font-semibold">
              전경 이미지 없음
            </span>
          </div>
        )}
        </div>  
        
      </section>
      {/* =========================
          연혁
      ========================= */}
      <section className="relative w-full max-w-[1600px] mx-auto p-0 md:p-0">
        <div className="sm:mt-10 absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 z-10" />
            <div className="mt-6 md:mt-25 columns-1 md:columns-2 gap-6 md:gap-10 bg-white border border-border rounded-md p-4 md:p-10 shadow-dropdown transition">
            {histories?.map((history: any) => (
                <div
                key={history.id}
                className="mb-2 md:mb-3 break-inside-avoid text-[10px] md:text-base"
                >
                {history.date} {history.title}
                </div>
            ))}
            </div>

      </section>

      {/* =========================
          상징
      ========================= */}
      <section className="relative w-full max-w-[1600px] mx-auto p-4 md:p-10 sm:mb-10">
        <div className="sm:mt-10 absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 z-10" />
        <div className="mt-5 sm:mt-20 grid grid-cols-1 gap-6">
          
        <div className="mb-5 sm:mb-10 flex flex-col lg:flex-row items-center justify-center gap-6 w-full group">

            {/* symbols 3개 */}
            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[1000px]">
                {symbols.map((item) => (
                  <div
                    key={item.title}
                    className="relative w-full max-w-[300px] rounded-lg overflow-hidden bg-white border border-border 
                              p-2 sm:p-5 md:p-10 shadow-dropdown transition"
                  >
                    {/* 이미지 박스 (정사각형 고정) */}
                    <div className="relative w-full aspect-square">
                      <Image
                        src={item.image || "/default.png"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <h1 className="pt-4 sm:pt-6 md:pt-8 
                                  text-[10px] sm:text-base md:text-lg 
                                  font-bold text-center">
                      {item.title}
                      {item.description ? `: ${item.description}` : ""}
                    </h1>
                  </div>
                ))}
              </div>

              {/* 교가 */}
              <div className="relative w-full max-w-[600px] rounded-lg overflow-hidden bg-white border border-border p-5 md:p-10 shadow-dropdown transition">
                <h1 className="pb-0 text-[10px] sm:text-base md:text-lg  font-bold text-center">교가</h1>

                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setModal({
                      url: song?.url || "",
                    })
                  }
                >
                  <Image
                    src={song?.url || "/default.png"}
                    alt="교가"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* =========================
          교장
      ========================= */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 sm:mb-10 shadow-dropdown transition">
        <div className="grid grid-cols-1 gap-6">
          {executives?.filter((executive:any) => executive.position === "principal" && executive.section === "profile").map((executive:any) => (

                <div key={executive.id}
                className="flex flex-col items-center gap-3 cursor-pointer w-full group">
                                  {/* 헤더 */}
                  <div className="w-full sm:mb-8 text-center">
                    <div className="inline-block relative">
                      <h2 className="text-xs md:text-xl font-medium text-gray-800">
                        {executive.name} 교장 선생님
                      </h2>

                      <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div
                  onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      //width: 800,
                      //height: 500,
                      text: `${executive.name} 교장 선생님`,
                    })
                  }
                  className="relative w-full max-w-[1300px] rounded-lg overflow-hidden cursor-pointer"
                >
                  <Image
                    src={executive.profile_url || ""}
                    alt=""
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                </div>
                </div>
            ))}
        </div>
      </section>

      {/* =========================
          교감
      ========================= */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 sm:mb-10 shadow-dropdown transition">
        <div className="grid grid-cols-1 gap-6">
          {executives?.filter((executive:any) => executive.position === "vice principal" && executive.section === "profile").map((executive:any) => (

                <div key={executive.id} className="flex flex-col items-center gap-3 cursor-pointer w-full group">
                  {/* 헤더 */}
                  <div className="w-full sm:mb-8 text-center">
                    <div className="inline-block relative">
                      <h2 className="text-xs md:text-xl font-medium text-gray-800">
                        {executive.name} 교감 선생님
                      </h2>

                      <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="relative w-full max-w-[200px] md:max-w-[800px] rounded-lg overflow-hidden"
                  onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      //width: 800,
                      //height: 500,
                      text: `${executive.name} 교감 선생님`,
                    })
                  }
                  >
                    
                    <Image
                      src={executive.profile_url || "/default.png"}
                      alt={executive.position}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto object-contain"
                      unoptimized
                    />
                  </div>
                </div>
            ))}
        </div>
      </section>

      {/* =========================
          선생님
      ========================= */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 sm:mb-10 shadow-dropdown transition">
        {/* 헤더 */}
        <div className="w-full mb-8 text-center">
          <div className="inline-block relative">
            <h2 className="text-xs md:text-xl font-medium text-gray-800">
              선생님
            </h2>

            <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {executives
            ?.filter((executive:any) => executive.position === "teacher")
            .map((executive:any) => (
              <div
                key={executive.id}
                className="flex flex-col items-center gap-1 sm:gap-3 cursor-pointer group"
              >
                {/* 이미지 */}
                <div
                  className="relative w-full rounded-lg overflow-hidden"
                  onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      text: `${executive.name} 선생님`,
                    })
                  }
                >
                  <Image
                    key={executive.id}
                    src={executive.profile_url || "/default.png"}
                    alt={executive.position}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                </div>

                <h1 className="text-center text-[10px] md:text-base font-semibold text-gray-800">
                  {executive.name} 선생님 ({executive.role})
                </h1>
              </div>
            ))}
        </div>
      </section>

      {/* =========================
          서무실
      ========================= */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 sm:mb-10 shadow-dropdown transition">
        {/* 헤더 */}
        <div className="w-full mb-8 text-center">
          <div className="inline-block relative">
            <h2 className="text-xs md:text-xl font-medium text-gray-800">
              서무실
            </h2>

            <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {executives
            ?.filter((executive:any) => executive.position === "staff")
            .map((executive:any) => (
              <div
                key={executive.id}
                className="flex flex-col items-center gap-1 sm:gap-3 cursor-pointer group"
              >
                {/* 이미지 */}
                <div
                  className="relative w-full rounded-lg overflow-hidden"
                  onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      text: `${executive.name}`,
                    })
                  }
                >
                  <Image
                    key={executive.id}
                    src={executive.profile_url || "/default.png"}
                    alt={executive.position}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                </div>

                <h1 className="text-center text-[10px] md:text-base font-semibold text-gray-800">
                 {executive.role} {executive.name} 님
                </h1>
              </div>
            ))}
        </div>
      </section>

      {/* =========================
          학과
      ========================= */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
        <div className="w-full mb-8 text-center">
          <div className="inline-block relative">
            <h2 className="text-xs md:text-xl font-medium text-gray-800">
              반별 졸업사진
            </h2>
            <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {departments?.map((college:any) => (
            <Link
              key={college.id}
              href={`/student/${school?.id}/album/department/${college.id}`}
              className="group"
            >
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-400">
                <div className="mb-3">
                  <Image
                    src="/images/logo_icon.png"
                    alt="졸업사진"
                    width={50}
                    height={50}
                    className="mx-auto"
                    unoptimized
                  />
                </div>

                <h2 className="font-semibold text-gray-800 group-hover:text-gray-900">
                  {college.name} 반
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  졸업사진 보기
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================
          MODAL
      ========================= */}
     {modal && (
        <ImageModal
          isOpen={!!modal}
          src={modal.url || null}
          width={modal.width}
          height={modal.height}
          text={modal.text}
          onClose={() => setModal(null)}
          
        />
      )}
    </div>
  );
}