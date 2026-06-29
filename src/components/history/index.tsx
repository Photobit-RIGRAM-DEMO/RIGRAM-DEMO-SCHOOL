'use client';

import Button from '@/components/button';
import { useHistoryStore } from '@/store/useHistoryStore';
import type { Mode } from '@/types/mode';
import { Image as ImageIcon, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface HistoryProps {
  mode: Mode;
}

export default function History({ mode }: HistoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  const { histories, fetchHistories, deleteHistory } = useHistoryStore();

  useEffect(() => {
    fetchHistories(schoolId);
  }, [schoolId, fetchHistories]);

  const toggleSelect = (id: string) => {
    setSelectedHistoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteButton = async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (histories.length === 0) {
      alert('삭제할 연혁이 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (selectedHistoryIds.length === 0) {
      alert('선택된 연혁이 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (!confirm(`${selectedHistoryIds.length}명의 연혁을 정말 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(selectedHistoryIds.map((id) => deleteHistory(schoolId, id)));

      await fetchHistories(schoolId);
      alert('선택된 연혁이 삭제되었습니다.');

      setSelectedHistoryIds([]);
      setIsDeleteMode(false);
      router.refresh();
    } catch (error) {
      console.error('연혁 삭제 중 오류가 발생했습니다. : ', error);
      alert('연혁 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-1.5 mb-4 md:mb-6 shrink-0">
        <h3 className="text-18 font-semibold md:text-24 md:text-gray-900">연혁</h3>
        <div className="flex justify-start items-center gap-1">
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
          <span>연혁 {histories.length}개</span>
        </div>
        {mode === 'admin' && (
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              className="flex items-center gap-1 text-gray-600"
              href={`/admin/${schoolId}/introduction/history/add`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium hover:font-bold focus:font-bold active:font-bold">
                추가하기
              </span>
            </Button>
            <Button
              className="flex items-center gap-1 text-red"
              onClick={handleDeleteButton}
              aria-label={isDeleteMode ? '선택한 연혁 삭제' : '삭제 모드 전환'}
            >
              {isDeleteMode ? (
                <>
                  <Trash className="w-4 h-4" aria-hidden="true" />
                  <span>선택된 연혁 삭제하기</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4" aria-hidden="true" />
                  <span>삭제하기</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide md:max-h-[520px]">
        {histories.length === 0 && <p>등록된 연혁이 없습니다.</p>}
        <div className="grid grid-cols-1 gap-2 md:gap-6">
          {histories.map((history) => {
            const isSelected = selectedHistoryIds.includes(history?.id);

            const handleClick = () => {
              if (isDeleteMode) {
                toggleSelect(history.id);
              } else {
                router.push(
                  `/${mode === 'admin' ? 'admin' : 'student'}/${schoolId}/introduction/history/${history.id}`
                );
              }
            };

            return (
              <Button  
              key={history.id}
              className={`
                ${isDeleteMode ? (isSelected ? 'ring-4 ring-red-500' : '') : ''}
                hover:font-normal hover:font-medium hover:outline-none
                focus:font-normal focus:outline-none focus-visible:outline-none
                active:font-normal
                !cursor-default
              `}
              onClick={isDeleteMode ? handleClick : undefined}>
                <figure
                  className={`relative flex flex-col gap-2.5 w-full
                  ${isDeleteMode ? isSelected ? 'ring-4 ring-red-500'
                        : ''
                      : 'hover:none'
                  }`}
                >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-base bg-gray-100 rounded">
                    {history.date}
                  </span>

                  <span className="text-lg">
                    {history.title}
                  </span>
                </div>

                  {isDeleteMode && (
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                    ${isSelected ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'}`}
                    />
                  )}
                </figure>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
