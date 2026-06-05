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

  const { data: staffs } = await supabase
    .from('staffs')
    .select('*')
    .eq('id', id)
    .single()

  const { data: department } = await supabase
    .from('departments')
    .select('*')
    .eq('id', staffs?.department_id)
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

              {/* 반응형 이미지 */}
              <div className="relative w-full aspect-[16/9] max-h-[80vh]">
                <Image
                  src={staffs.profile_url}
                  alt="교수"
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                />
              </div>

              <h1 className="text-xl md:text-2xl font-bold">{staffs.name} {staffs.position}</h1>
            </div>
          </section>
        </div>
  )
}