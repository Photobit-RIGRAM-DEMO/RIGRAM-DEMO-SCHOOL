import { useSchoolStore } from '@/store/useSchoolStore';
import { useUserStore } from '@/store/userUserStore';
import { useCallback, useEffect, useState} from 'react';
import { supabase } from '@/utils/supabase/client';
import Image from "next/image";

export default function LogoBanner() {

        const fetchUser = useUserStore((state) => state.fetchUser);
    const user = useUserStore((state) => state.user);

        const fetchSchool = useSchoolStore((state) => state.fetchSchool);
        const isLoading = useSchoolStore((state) => state.isLoading);
        const school = useSchoolStore((state) => state.school);

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
                     
            }, [getAuthData, school]);

  return (
    <div className="w-full max-w-[640px] sm:max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1600px] mx-auto flex flex-col gap-8">
        <section className="w-full px-4 md:px-10 py-6">
          <div className="w-full mx-auto pb-4 relative">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-800/40 via-gray-500/30 to-gray-800/40" />

                  <div className="flex justify-center w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 w-full text-center">

                      {/* 이미지 영역 */}
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

                      {/* 텍스트 */}
                      <h1 className="font-semibold text-gray-800 tracking-tight text-[clamp(1rem,2vw,1.5rem)] text-center">
                        <span className="block">2026년 {school?.school_name} 전자졸업앨범</span>
                      </h1>

                    </div>
                  </div>
                  
            </div>
        </section>
      </div>
  );
}