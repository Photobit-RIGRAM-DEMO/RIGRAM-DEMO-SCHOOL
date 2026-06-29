'use client';

import Button from '@/components/button';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import type { Department } from '@/types/department';
import type { Mode } from '@/types/mode';
import { supabase } from '@/utils/supabase/client';
import { Calendar, GraduationCap, PencilLine, Tag, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface DetailTypes {
  department: Department;
  mode: Mode;
}

export default function Detail({ department, mode }: DetailTypes) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];
  const departmentId = segments[3];

  const school = useSchoolStore((state) => state.school);
  const { departments, deleteDepartment, isLoading } = useDepartmentStore();

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  if (isLoading) return <p>학과 데이터를 불러오는 중 입니다.</p>;
  if (!department) return <p>학과 데이터를 찾을 수 없습니다.</p>;

  const handleDelete = async () => {
    if (!department) return;
    if (!confirm(`${department.name} 반을 삭제하시겠습니까?`)) return;

    try {
      const schoolName = slugify(school?.school_name_en ?? '');
      const deptPath = `${schoolName}/${department.name}`;

      const { data: files, error: listError } = await supabase.storage
        .from('dept-img')
        .list(deptPath);

        console.log('파일 목록:', files);

      if (listError) {
        console.error('파일 목록 불러오기 실패:', listError);
        throw listError;
      }

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${deptPath}/${f.name}`);
        const { error: removeError } = await supabase.storage.from('dept-img').remove(filePaths);
        if (removeError) {
          console.error('파일 삭제 실패:', removeError);
          throw removeError;
        }
      }

      const otherDepartments = departments.filter(
        (d) => d.id !== department.id && d.college_id === department.college_id
      );

      if (otherDepartments.length === 0) {
        const { data: schoolFiles } = await supabase.storage.from('dept-img').list(schoolName);
        if (schoolFiles && schoolFiles.length === 0) {
          const { error: cleanError } = await supabase.storage
            .from('dept-img')
            .remove([schoolName]);
          if (cleanError) console.error('학교 폴더 삭제 실패:', cleanError);
        }
      }

      const success = await deleteDepartment(departmentId);
      if (success) {
        alert(`${department.name} 반이(가) 삭제되었습니다.`);
        router.replace(`/admin/${schoolId}/department`);
      }
    } catch (err) {
      console.error(' 삭제 중 오류 발생:', err);
      alert('삭제 중 문제가 발생했습니다.');
    }
  };

  const DETAIL_DATA = [
    {
      id: '0',
      icon: <GraduationCap />,
      title: '학과명',
      content: `${department.name}`,
    },
    {
      id: '1',
      icon: <GraduationCap />,
      title: '영어 학과명',
      content: `${department.name_en}`,
    },
    {
      id: '2',
      icon: <Tag />,
      title: '단과대학',
      content: ``,
    },
    {
      id: '3',
      icon: <Calendar />,
      title: '생성일',
      content: `${department.created_at.slice(0, 10)}`,
    },
    {
      id: '4',
      icon: <Calendar />,
      title: '수정일',
      content: `${department.updated_at.slice(0, 10)}`,
    },
  ];

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-20 text-gray-900 font-semibold" id="department-info">
          {department.name} 반
        </h2>
        {mode === 'admin' && (
          <div className="flex flex-row gap-2">
            <Button
              className="flex items-center gap-1 text-gray-600"
              href={`${pathname}/edit`}
              aria-label="수정하기"
            >
              <PencilLine className="w-4 h-4" />
              <span>학급 수정하기</span>
            </Button>
            <Button
              className="flex items-center gap-1 text-red"
              onClick={handleDelete}
              aria-label="삭제하기"
            >
              <Trash className="w-4 h-4" />
              <span>학급 삭제하기</span>
            </Button>
          </div>
        )}
      </header>

      {department.img_url && (
        <div className="mb-6 md:mb-15">
          <div className="relative w-full h-[200px] md:h-[280px] rounded-xl">
            <Image
              src={department.img_url}
              alt={`${department.name} 대표 이미지`}
              fill
              sizes="(max-width: 768px) 100% 200px, 100%, 280px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
