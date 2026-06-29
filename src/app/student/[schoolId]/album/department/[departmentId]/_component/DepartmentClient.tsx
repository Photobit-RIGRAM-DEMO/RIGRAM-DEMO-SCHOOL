'use client';

import DepartmentImage from '../_component/DepartmentImage';
import StudentImage from '../_component/StudentImage';
import TeacherImage from '../_component/TeacherImage';
import EventScreen from '../_component/EventScreen';

type Department = {
  id: string;
  name: string;
  school_id: string | null;
  img_url: string | null;
};

type Staff = any; // 나중에 구체화 가능
type Student = any;
type Media = any;
type TeamMember = any;

type Props = {
  department: Department | null;
  staffs: Staff[];
  students: Student[];
  mediaTeam: Media[];
  teamMembers: TeamMember[];
  mediaEvent: Media[];
};

export default function DepartmentClient({
  department,
  staffs,
  students,
  mediaTeam,
  teamMembers,
  mediaEvent,
}: Props) {

  if (!department?.school_id) return (<div>404 - Department not found</div>);

  return (
    <div className="
      w-full max-w-[640px] sm:max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1600px] 
      mx-auto flex flex-col gap-8 bg-[#f6f3ee] p-3 sm:p-10
      border border-dashed border-gray-300
      ">

      {/* 헤더 */}
    <section className="w-full max-w-[1600px] mx-auto">
      <div className="text-center sm:py-8">
        <h1 className="text-base md:text-3xl font-semibold text-gray-800">
          {department?.name} 반
        </h1>
        <div className="mx-auto mt-1 sm:mt-3 w-15 sm:w-24 h-[2px] bg-gray-400" />
      </div>
    </section>

      {/* 교수진 + 대표 이미지 */}
      <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-1 md:p-10 shadow-dropdown transition flex justify-center sm:gap-10">
        
        <div className="flex flex-col items-center justify-center gap-5">
          <TeacherImage staffs={staffs ?? []} schoolId={department?.school_id}/>
        </div>

        <div className="relative w-full max-w-[1100px] rounded-lg overflow-hidden flex items-center justify-center">
         <DepartmentImage imageUrl={department?.img_url ?? null} />
        </div>

      </section>

      {/* 실습사진 */}
      
    <StudentImage
        mediaTeam={mediaTeam}
        teamMembers={teamMembers}
        students={students}
        schoolId={department.school_id}
    />
        
      {/* 축제영상 */}
      <section className="w-full max-w-[1600px] bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
        <EventScreen
        media_event={mediaEvent ?? []}
        schoolId={department?.school_id}
      />
      </section>

    </div>
  );
}