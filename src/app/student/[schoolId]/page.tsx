'use client';

import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from "next/image";
import { useSchoolStore } from '@/store/useSchoolStore';
import { useUserStore } from '@/store/userUserStore';
import { useCallback, useEffect, useState} from 'react';
import { useForegroundStore } from '@/store/useForegroundStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useExecutiveStore } from '@/store/useExecutive';
import { useSymbolStore } from '@/store/useSymbolStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import ImageModal from '../_component/ImageModal';

interface Department {
  id: string;
  name: string;
  college_id: string;
}

export default function AlbumPage() {

    const fetchUser = useUserStore((state) => state.fetchUser);
    const user = useUserStore((state) => state.user);

    const fetchSchool = useSchoolStore((state) => state.fetchSchool);
    const isLoading = useSchoolStore((state) => state.isLoading);
    const school = useSchoolStore((state) => state.school);

    const fetchForegroundList = useForegroundStore((state) => state.fetchForegroundList);
    const foregroundList = useForegroundStore((state) => state.foregroundList);

    const fetchHistory = useHistoryStore((state) => state.fetchHistories);
    const histories = useHistoryStore((state) => state.histories);

    const fetchSymbolList = useSymbolStore((state) => state.fetchSymbolList);
    const symbolList = useSymbolStore((state) => state.symbolList);

    const fetchExecutives = useExecutiveStore((state) => state.fetchExecutives);
    const executives = useExecutiveStore((state) => state.executives);

    const fetchDepartments = useDepartmentStore((state) => state.fetchDepartments);
    const departments = useDepartmentStore((state) => state.departments);

    // const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState<{
      url?: string;
      width?: number;
      height?: number;
    } | null>(null);

    const motto = symbolList.find((symbol) => symbol.title === "motto");
    const tree = symbolList.find((symbol) => symbol.title === "tree");
    const flower = symbolList.find((symbol) => symbol.title === "flower");
    const flag = symbolList.find((symbol) => symbol.title === "flag");
    const song = symbolList.find((symbol) => symbol.title === "song");

    const getAuthData = useCallback(async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) return console.error(error);
        const user = data?.session?.user;
        if (!user) return;
        if (user) {
          await fetchUser(user.id);
          await fetchSchool(user.id);
        }
      } catch (err) {
        console.error(err);
      }
    }, [fetchSchool, fetchUser]);

    useEffect(() => {
      if (!school) return;
        getAuthData();
      
        const run = async () => {
          await fetchForegroundList(school.id ?? "");
          await fetchHistory(school.id ?? "");
          await fetchExecutives(school.id ?? "");
          await fetchSymbolList(school.id ?? "");
          await fetchDepartments(school.id ?? "");

          // await fetchDepartments(school.id ?? "").then((data) => {
          //   setDepartments(data || []);
          //   setLoading(false);
          // });
        };

        run();

    }, [getAuthData, school]);

    

  return (
    <div className="w-full max-w-[640px] sm:max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1600px] mx-auto flex flex-col gap-8">
      <section className="w-full px-4 md:px-10 py-6">
        {user?.user_type === 'admin' && (
        <Link
          href={`/admin//${school?.id}`}
          className="mt-4 w-full max-w-[1600px] mx-auto block bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl shadow hover:shadow-lg transition text-center"
        >
          관리 페이지로 이동
        </Link>
        )}
      </section>


      {/* 블록 1 */}
      <section className="w-full px-4 md:px-10 py-6">
        <div className="w-full mx-auto pb-4 relative">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-800/40 via-gray-500/30 to-gray-800/40" />

                <div className="flex justify-center w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-center">

                        <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-md overflow-hidden flex items-center justify-center">
                          <div className="relative w-[104px] sm:w-[117px] md:w-[156px] aspect-square">
                            {school?.school_img_url && (
                              <Image
                                src={school?.school_img_url as string}
                                alt="학교 이미지"
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </div>

                        <h1 className="font-semibold text-gray-800 tracking-tight text-[clamp(1rem,2vw,1.5rem)] text-center">
                          <span className="block">2026년 {school?.school_name} 전자졸업앨범</span>
                        </h1>
   

                    </div>
                </div>
          </div>
      </section>

      {/* 블록 2 (가장 중요) */}
      <section className="w-full px-2 md:px-4">
        <div
        onClick={() =>
        setModal({
          url: foregroundList[0].url || "",
          width: 2400,
          height: 1200,
        })}
        className="w-full max-w-[1600px] mx-auto aspect-[3/1] relative rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)] cursor-pointer"
      >
        {foregroundList[0]?.url ? (
          <>
            {/* 배경 이미지 */}
            <Image
              src={foregroundList[0].url}
              alt="배경"
              fill
              className="object-cover z-0"
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


        {/* 블록 3 상징 */}
      <section className="relative w-full max-w-[1600px] mx-auto p-4 md:p-10">

        <div className="mt-10 absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 z-10" />

       <div className="mt-20 columns-1 md:columns-2 gap-10 bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
          {histories?.map((history) => (
            <div key={history.id} className="mb-3 break-inside-avoid">
              <span className="text-xs md:text-base">
                {history.date} {history.title}
              </span>
            </div>
          ))}
      </div>

      </section>



        {/* 블록 3 상징 */}
      <section className="relative w-full max-w-[1600px] mx-auto p-4 md:p-10 ">
        <div className="mt-10 absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 z-10" />
        <div className="mt-20 grid grid-cols-1 gap-6">
          
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">

            <div className="relative w-full bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
              <Image
                src={flag?.url || "/default.png"}
                alt="교기"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
              <h1 className="text-lg font-bold text-center">교기</h1>
            </div>

            {/* 이미지 */}
            <div className="relative w-full bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
              <Image
                src={tree?.url || "/default.png"}
                alt="교목"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
              <h1 className="pt-8 text-lg font-bold text-center">교목: {tree?.description}</h1>
            </div>

            <div className="relative w-full bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
              <Image
                src={flower?.url || "/default.png"}
                alt="교화"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
              <h1 className="pt-8 text-lg font-bold text-center">교화: {flower?.description}</h1>
            </div>

            <div className="relative w-full bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition xl:col-span-1">
              <h1 className="pb-8 text-lg font-bold text-center">교가</h1>
              <div  className="cursor-pointer" onClick={() =>
                    setModal({
                      url: song?.url || "",
                      //width: 800,
                      //height: 500,
                      })
                    }>
              <Image
                src={song?.url || "/default.png"}
                alt="교가"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
              </div>

            </div>
            
          </div>
        </div>
      </section>

      {/* 블록 4 */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 shadow-dropdown transition">
        <div className="grid grid-cols-1 gap-6">
          {executives?.filter((executive) => executive.position === "principal" && executive.section === "profile").map((executive) => (

                <div key={executive.id}
                className="flex flex-col items-center gap-3 cursor-pointer w-full group">
                                  {/* 헤더 */}
                  <div className="w-full bg-gray-50 border-y border-gray-100">
                    <div className="px-4 md:px-8 py-3 md:py-4">
                      <h1 className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-gray-800 pl-3 border-l-4 border-gray-800">
                        {executive.name} 교장 선생님
                      </h1>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div
                  onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      //width: 800,
                      //height: 500,
                    })
                  }
                  className="cursor-pointer"
                >
                  <Image
                    src={executive.profile_url || ""}
                    alt=""
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                  />
                </div>
                </div>
            ))}
        </div>
      </section>

      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 shadow-dropdown transition">
        <div className="grid grid-cols-1 gap-6">
          {executives?.filter((executive) => executive.position === "vice principal" && executive.section === "profile").map((executive) => (

                <div key={executive.id} className="flex flex-col items-center gap-3 cursor-pointer w-full group">
                  {/* 헤더 */}
                  <div className="w-full bg-gray-50 border-y border-gray-100">
                    <div className="px-4 md:px-8 py-3 md:py-4">
                      <h1 className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-gray-800 pl-3 border-l-4 border-gray-800">
                        {executive.name} 교감 선생님
                      </h1>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="relative w-full max-w-[800px] rounded-lg overflow-hidden"
                  onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      //width: 800,
                      //height: 500,
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
                    />
                  </div>
                </div>
            ))}
        </div>
      </section>

      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 shadow-dropdown transition">
  
      <div className="flex flex-wrap justify-center gap-6">
        {/* 헤더 */}
        <div className="w-full bg-gray-50 border-y border-gray-100">
          <div className="px-4 md:px-8 py-3 md:py-4">
            <h1 className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-gray-800 pl-3 border-l-4 border-gray-800">
              선생님
            </h1>
          </div>
        </div>
        {executives
          ?.filter((executive) => executive.position === "teacher")
          .map((executive) => (
              <div key={executive.id} className="flex flex-col items-center gap-3 cursor-pointer group">

                {/* 이미지 */}
                <div className="relative w-[250px] rounded-lg overflow-hidden"
                onClick={() =>
                    setModal({
                      url: executive.profile_url || "",
                      //width: 800,
                      //height: 500,
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
                  />
                </div>

                <h1 className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-gray-800 pl-3">
                  {executive.name} 선생님 ({executive.role})
                </h1>

              </div>
          ))}
      </div>
    </section>

    <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-4 md:p-10 shadow-dropdown transition">
  
      <div className="flex flex-wrap justify-center gap-6">
        {/* 헤더 */}
        <div className="w-full bg-gray-50 border-y border-gray-100">
          <div className="px-4 md:px-8 py-3 md:py-4">
            <h1 className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-gray-800 pl-3 border-l-4 border-gray-800">
              서무실
            </h1>
          </div>
        </div>
        {executives
          ?.filter((executive) => executive.position === "staff")
          .map((executive) => (
              <div key={executive.id} className="flex flex-col items-center gap-3 cursor-pointer group">

                {/* 이미지 */}
                <div className="relative w-[250px] rounded-lg overflow-hidden"
                     onClick={() =>
                        setModal({
                          url: executive.profile_url || "",
                          //width: 800,
                          //height: 500,
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
                  />
                </div>

                <h1 className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-gray-800 pl-3">
                 {executive.role} {executive.name} 님 
                </h1>

              </div>
          ))}
      </div>
    </section>


        {/* 학과 블록 */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
          <div className="flex flex-col gap-5">
            <div className="w-full bg-gray-50 border-y border-gray-100">
              <div className="px-5 md:px-10 py-4">
                <h1 className="text-base md:text-lg font-semibold text-gray-800 pl-4 border-l-4 border-gray-800">
                  반별 졸업사진
                </h1>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {departments?.map((college) => (
                <li key={college.id}>
                  <Link
                    href={`/student/${school?.id}/album/department/${college.id}`}
                    className="block p-4 border-l-4 border-gray-500 rounded-xl bg-gray-50 text-gray-900 transition-all duration-300 hover:border-gray-700 hover:shadow-md"
                  >
                    {college.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="w-full bg-gray-100 border-t border-border py-6 md:py-10">
          <div className="w-full max-w-[1600px] mx-auto flex justify-end px-4">
            {/* 오른쪽: 회사/학교 이름 */}
            <p className="text-sm md:text-base text-gray-600">&copy; 2026 RIGRAM. All rights reserved.</p>
          </div> 
        </footer> 

        {modal && (
        <ImageModal
          isOpen={!!modal}
          src={modal.url || null}
          width={modal.width}
          height={modal.height}
          onClose={() => setModal(null)}
        />
      )}

      </div> 

      
  )
}
