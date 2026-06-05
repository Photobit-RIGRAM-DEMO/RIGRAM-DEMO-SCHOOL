import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import Image from "next/image";

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const { data: medium } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single()

  const { data: department } = await supabase
    .from('departments')
    .select('*')
    .eq('id', medium?.department_id)
    .single()

return (
        <div className="w-full flex flex-col gap-8 items-center">
          <section className="w-full max-w-[1600px]">
            <div className="bg-gray-200 px-5 py-4 border-y border-gray-300 w-full max-w-[1600px] mx-auto"> 
              <div className="pl-4 border-l-[3px] border-gray-800"> 
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight"> 
                  {department?.name} 
                </h1> 
              </div> 
            </div>
          </section>

          <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition"> 
            <div className="flex flex-col items-center gap-12">
              <div className="relative w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] aspect-[4/3]">
                
                {medium.type === 'photo' && medium.url && (
                  <Image
                    src={medium.url}
                    alt="이미지"
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 640px) 300px, (max-width: 768px) 500px, 700px"
                  />
                )}

                {medium.type === 'video' && medium.url && (
                  <video
                    src={medium.url}
                    className="w-full h-full object-contain rounded-lg"
                    controls
                  />
                )}

              </div>
            </div>
          </section>
        </div>
  )
}