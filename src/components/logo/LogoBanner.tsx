import Image from 'next/image';

export default function LogoBanner({ school }: { school: any }) {
  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8 pb-5 sm:pb-10">
      <section className="w-full">
        <div className="w-full mx-auto pb-4 relative">
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-800/40 via-gray-500/30 to-gray-800/40" />

          <div className="flex justify-center w-full mb-3 sm:mb-10">
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full min-w-0">

              <div className="relative w-[60px] sm:w-[90px] md:w-[130px] lg:w-[150px] aspect-square flex-shrink-0">
                {school?.school_img_url && (
                  <Image
                    src={school.school_img_url}
                    alt="학교 이미지"
                    fill
                    className="object-cover"
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
    </div>
  );
}