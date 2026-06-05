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

  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)

    const { data: department } = await supabase
    .from('departments')
    .select('*')
    .eq('id', students?.[0]?.dept_id)
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

      {/* 반응형 이미지 1.3배 확대 */}


      <div className="relative w-full aspect-[16/9] max-h-[80vh]">
      {students?.[0]?.profile_graduate && (
        <Image
          src={students[0].profile_graduate}
          alt="임원진"
          fill
          className="object-contain rounded-lg"
          sizes="100vw"
        />
         )}
      </div>

      {/* 학생 이름 */}
      <h1 className="text-xl md:text-2xl font-bold">{students?.[0]?.name}</h1>

    </div>
  </section>
</div>
  )
}