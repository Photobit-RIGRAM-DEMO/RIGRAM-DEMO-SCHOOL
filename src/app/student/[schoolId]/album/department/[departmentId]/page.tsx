import { createClient } from '@/utils/supabase/server';
import Link from "next/link";
import Image from "next/image";
import DepartmentImage from "./_component/DepartmentImage";
import StudentImage from './_component/StudentImage';
import TeacherImage from './_component/TeacherImage';
import EventScreen from './_component/EventScreen';

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ departmentId: string }>
}) {
  const { departmentId } = await params

   const supabase = await createClient();

  // staffs 중 departmentId 같은 것
  const { data: department } = await supabase
    .from('departments')
    .select('*')
    .eq('id', departmentId)
    .single()

  // staffs 중 departmentId 같은 것
  const { data: staffs } = await supabase
    .from('staffs')
    .select('*')
    .eq('department_id', departmentId)

  // students 중 departmentId 같은 것
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('dept_id', departmentId)

  const { data: media_team } = await supabase
    .from('media')
    .select('*')
    .eq('department_id', departmentId)
    .eq('category', 'team')

  const mediaIds = media_team?.map((media) => media.id) ?? [];

  const { data: team_members } = await supabase
  .from('team_member')
  .select('*')
  .in('media_id', mediaIds);

  const { data: media_event } = await supabase
    .from('media')
    .select('*')
    .eq('department_id', departmentId)
    .eq('category', 'event')

return (
    <div className="w-full flex flex-col items-center gap-8 px-0 md:px-10">

      <section className="w-full max-w-[1600px]">
        <div className="bg-gray-200 px-2 py-4 md:px-5 md:py-4 border-y border-gray-300 w-full max-w-[1600px] mx-auto">
          <div className="pl-4 border-l-[3px] border-gray-800">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {department?.name} 반
            </h1>
          </div>
        </div>
      </section>
    
      {/* 교수진 */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md px-2 py-4 md:p-10 shadow-dropdown transition flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10">
    
        <div className="flex flex-col items-center gap-5">
          <TeacherImage staffs={staffs ?? []} schoolId={department?.school_id} />
        </div>
    
        <div className="relative w-full max-w-[1100px] rounded-lg overflow-hidden">
          <DepartmentImage imageUrl={department?.img_url ?? null} />
        </div>
    
      </section>
    
      {/* 실습사진 */}
      <StudentImage
        mediaTeam={media_team ?? []}
        teamMembers={team_members ?? []}
        students={students ?? []}
        schoolId={department?.school_id}
      />
    
      {/* 축제영상 */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md px-2 py-4 md:p-10 shadow-dropdown transition">
        <EventScreen
          media_event={media_event ?? []}
          schoolId={department?.school_id}
        />
      </section>
    
      {/* 바텀 영역 */}
      <footer className="w-full max-w-[1600px] mx-auto bg-gray-100 border-t border-border py-6 flex justify-end px-2 md:px-4 rounded-md">
        <p className="text-sm md:text-base text-gray-600">
          &copy; 2026 RIGRAM. All rights reserved.
        </p>
      </footer>
    
    </div>
  )
}
