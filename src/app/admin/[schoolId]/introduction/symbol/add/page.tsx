'use client';

import Badge from '@/components/badge';
import Button from '@/components/button';
import FileInput from '@/components/fileInput';
import Input from '@/components/input';
import PageHeader from '@/components/pageHeader';
import Textarea from '@/components/textarea';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useSymbolStore } from '@/store/useSymbolStore';
import { supabase } from '@/utils/supabase/client';
import { Asterisk } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { transliterate } from 'transliteration';

const options = [
  { value: "tree", label: "교목" },
  { value: "flower", label: "교화" },
  { value: "animal", label: "교수" },
  { value: "flag", label: "교기" },
  { value: "song", label: "교가" },
  { value: "motto", label: "교훈" },
];

export default function SymbolAddPage() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const schoolId = segments[1];

  const [title, setTitle] = useState('tree');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const addSymbol = useSymbolStore((state) => state.addSymbol);
  const school = useSchoolStore((state) => state.school);

  const slugify = (text: string) =>
    transliterate(text) // 👈 한글 → 영어 변환
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  useEffect(() => {
    if (!schoolId) return;
  }, [schoolId]);

  /* 파일 업로드 (Supabase Storage) */
  const uploadFile = useCallback(
    async (file: File) => {
      const schoolName = slugify(school?.school_name_en || '');

      const fileExt = file.name.split('.').pop();
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const safeFileName = `${slugify(baseName)}_${Date.now()}_${crypto.randomUUID()}.${fileExt}`;

      const filePath = `${schoolName}/${safeFileName}`;

      const bucketName = 'symbols';

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error(`상징 이미지 업로드 실패:`, error.message);
        alert(`상징 이미지 업로드 중 오류가 발생했습니다.`);
        return null;
      }

      const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

      const urlData = `${baseUrl}${bucketName}/${filePath}`;

      return urlData ?? null;
    },
    [school]
  );

  const handleAddSymbol = () => async () => {
    if (!description.trim()) {
      alert('의미를 입력해 주세요.');
      return;
    }
    if (!mediaFile) {
      alert('상징 이미지를 업로드해 주세요.');
      return;
    }

    try {
      const mediaUrl = await uploadFile(mediaFile);
      await addSymbol(schoolId, title, description, mediaUrl);

      alert('상징이 성공적으로 추가되었습니다.');
      router.replace(`/admin/${schoolId}/introduction?tab=symbol`);
    } catch (error) {
      console.error('상징 추가 중 오류가 발생했습니다. : ', error);
      alert('상징 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }
  };

  return (
    <>
      <PageHeader title="상징 추가하기" />
      <section className="relative bg-white w-full p-4 md:p-10 border border-gray-200 rounded-xl shadow-dropdown md:w-[1080px] md:min-h-[753px]">
        <header className="relative flex flex-col justify-start gap-1">
          <ol className="flex justify-start items-center">
            <li>
              <Badge active>상징 추가</Badge>
            </li>
          </ol>
          <h3 className="text-24 text-gray-900 font-semibold">상징 추가</h3>
          <div className="absolute right-0 bottom-0 flex items-center gap-2">
            <Button
              className="text-white bg-primary-700 rounded-lg px-3 py-1.5"
              onClick={handleAddSymbol()}
            >
              추가하기
            </Button>
          </div>
        </header>
        <span className="inline-block w-full h-px bg-gray-200 my-8" aria-hidden="true"></span>
        <form className="flex flex-col gap-6">

          {/* 이름 업로드 */}
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="title"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[100px] md:text-18 md:w-[200px]"
            >
              종류
              <Asterisk className="text-red w-4 h-4" aria-hidden="true" />
            </label>
            <div className="flex-1 min-w-0">
              <select
                id="title"
                className="w-full border rounded-md px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

           {/* 설명 업로드 */}
          <div className="flex justify-start items-start w-full">
            <label
              htmlFor="description"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[100px] md:text-18 md:w-[200px]"
            >
              의미
              <Asterisk className="text-red w-4 h-4" aria-hidden="true" />
            </label>
            <div className="flex-1 min-w-0">
              <Textarea
                id="description"
                placeholder="의미를 입력해 주세요."
                className="w-full p-4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          {/* 대표 사진 업로드 */}
          <div className="flex justify-start items-start">
            <label
              htmlFor="symbol"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[100px] md:text-18 md:w-[200px]"
            >
              상징 이미지
              <Asterisk className="text-red w-4 h-4" aria-hidden="true" />
            </label>
            <div className="flex-1 min-w-0">
              <FileInput
                id="symbol"
                size="lg"
                multiple={false}
                value={mediaFile}
                onChange={(files) => {
                  if (!files) return;
                  const file = files instanceof FileList ? files[0] : files;
                  setMediaFile(file);
                }}
              />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
