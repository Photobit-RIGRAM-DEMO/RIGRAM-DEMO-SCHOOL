'use client';

import Button from '@/components/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Header({ hasSchool = false }: { hasSchool?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const userType = segments[0];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const school = useSchoolStore((state) => state.school);
  const logout = useAuthStore((state) => state.logout);

  const schoolId = school?.id;

  const handleMenuDrop = () => {
    setIsOpen(!isOpen);
  };

  const handleSchoolPage = () => {
    router.replace(`/${userType}/${schoolId}`);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('schoolId');
    localStorage.removeItem('userType');
    logout();
    router.replace('/auth/login');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
        <header
          role="banner"
          className="flex justify-between items-center w-full min-h-14 bg-gray-100 px-5 shadow-dropdown md:min-h-16 md:px-10"
        >
          {/* 👉 로고 클릭 영역으로 변경 */}
          <figure
            className="flex items-center gap-2 cursor-pointer"
            onClick={school?.school_name ? handleSchoolPage : undefined}
          >
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              <Image
                src="/images/logo_icon.png"
                alt="리그램 로고"
                fill
                priority
                sizes="(max-width: 768px): 24px, 32px"
                className="object-contain"
              />
            </div>

            <figcaption className="text-16 md:text-18 text-gray-900 font-semibold">
              RIGRAM
            </figcaption>
          </figure>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-14 md:text-16 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              로그아웃
            </button>
          </div>
        </header>
    
  );
}
