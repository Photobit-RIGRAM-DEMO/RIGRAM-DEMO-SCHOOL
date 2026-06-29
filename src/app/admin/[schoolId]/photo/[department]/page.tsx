'use client';

import Button from '@/components/button';
import OverlayViewer from '@/components/overlayViewer';
import PageHeader from '@/components/pageHeader';
import BottomTab from '@/components/tab/bottom';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useMediaStore } from '@/store/useMediaStore';
import { ImageMinus, ImagePlus, Images, Play, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

export default function PhotoListPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const currentDept = segments[3];

  const [deptName, setDeptName] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const mediaList = useMediaStore((state) => state.mediaList);
  const fetchMediaList = useMediaStore((state) => state.fetchMediaList);
  const members = useMediaStore((state) => state.members);
  const fetchMembers = useMediaStore((state) => state.fetchMembers);
  const deleteMedia = useMediaStore((state) => state.deleteMedia);
  const fetchDepartmentById = useDepartmentStore((state) => state.fetchDepartmentById);

  const RENDER_MEDIA = useMemo(() => {
    return currentTab === 'all'
      ? mediaList
      : mediaList.filter((item) => item.category === currentTab);
  }, [currentTab, mediaList]);

  useEffect(() => {
    fetchMediaList(currentDept);
    fetchDepartmentById(currentDept).then((dept) => {
      setDeptName(dept?.name || '');
    });
  }, [currentDept, fetchMediaList, fetchDepartmentById]);

  // 🗑️ 삭제 버튼 동작
  const handleDeleteButton = async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (selectedMediaIds.length === 0) {
      alert('삭제할 사진 또는 동영상이 없습니다.');
      setIsDeleteMode(false);
      return;
    }

    if (!confirm(`${selectedMediaIds.length}개의 사진 또는 동영상을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await Promise.all(selectedMediaIds.map((id) => deleteMedia(currentDept, id)));
      await fetchMediaList(currentDept);

      alert('삭제 완료');
      setSelectedMediaIds([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error('사진/동영상 삭제 중 오류:', error);
      alert('사진/동영상 삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectMedia = async (media: any) => {
  setSelectedMedia(media);
  await fetchMembers(media.id);
};

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PageHeader title={deptName + ' 반'} />
      <section className="relative flex flex-col gap-2 w-full h-full bg-white rounded-xl p-5 overflow-y-scroll scrollbar-hide md:p-6">
        {/* 헤더 */}
        <header className="relative flex justify-between items-center md:px-6 md:py-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-16 text-gray-900 font-semibold md:text-20">
              {
                currentTab === 'all'
                  ? '전체'
                  : currentTab === 'team'
                  ? '조별 사진'
                  : currentTab === 'event'
                  ? '학예회'
                  : currentTab
              }
            </h3>
            <span className="flex items-center gap-1 text-14 text-gray-700 font-medium md:text-16">
              <Images aria-hidden="true" />
              {`이미지 ${RENDER_MEDIA.filter((i) => i?.type === 'photo').length}개, 동영상 ${RENDER_MEDIA.filter((i) => i?.type === 'video').length}개`}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-gray-800 text-white rounded-full p-1.5 md:p-2.5 hover:bg-gray-700"
              href={`${pathname}/add`}
              aria-label="새 사진 또는 동영상 추가"
            >
              <ImagePlus aria-hidden="true" />
            </Button>
            <Button
              className="bg-gray-800 text-white rounded-full p-1.5 md:p-2.5 hover:bg-gray-700"
              onClick={handleDeleteButton}
              aria-label={isDeleteMode ? '선택한 미디어 삭제' : '삭제 모드 전환'}
            >
              {isDeleteMode ? <Trash aria-hidden="true" /> : <ImageMinus aria-hidden="true" />}
            </Button>
          </div>
        </header>

        {/* 미디어 그리드 */}
        <ul
          className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-2 max-h-[500px] w-full"
          role="list"
        >
          {RENDER_MEDIA.map((media, index) => {
            const isSelected = selectedMediaIds.includes(media?.id);

            return (
              <li
                role="listitem"
                tabIndex={0}
                aria-label={media?.type === 'photo' ? '사진 보기' : '동영상 보기'}
                key={media?.id ?? `media-${index}`}
                className={`relative flex justify-center items-center bg-[#eee] h-[200px] rounded-lg overflow-hidden hover:cursor-pointer
                ${
                  isDeleteMode
                    ? isSelected
                      ? 'ring-4 ring-red-500'
                      : 'hover:opacity-70'
                    : 'hover:scale-105 hover:opacity-70'
                }`}
                onClick={() => (isDeleteMode ? toggleSelect(media.id) : handleSelectMedia(media))}
              >
                {/* 미디어 (사진/영상) */}
                {media?.type === 'video' ? (
                  <video preload="none" poster={media.video_thumbnail || '/default-thumbnail.jpg'}>
                    <source src={media?.url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={media?.url || '/default-thumbnail.png'}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100%, 100%"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                  {media?.title}
                </div>

                {/* ▶️ 비디오 아이콘 (삭제 모드 아닐 때만 표시) */}
                {media?.type === 'video' && !isDeleteMode && (
                  <div className="absolute flex justify-center items-center w-[84px] h-[84px] bg-[#51515D] text-white opacity-60 rounded-full">
                    <Play />
                  </div>
                )}

                {/* ✅ 삭제 모드일 때 체크박스 */}
                {isDeleteMode && (
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* 하단 탭 */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 min-w-fit">
          <BottomTab purpose="organization" />
        </footer>

        {/* 오버레이 뷰어 */}
        <OverlayViewer media={selectedMedia} members={members} onClose={() => setSelectedMedia(null)} />
      </section>
    </Suspense>
  );
}
