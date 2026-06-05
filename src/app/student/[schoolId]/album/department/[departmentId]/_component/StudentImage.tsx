"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  mediaTeam: any[];
  teamMembers: any[];
  students: any[];
  schoolId: string;
}

export default function TeamMediaSection({
  mediaTeam,
  teamMembers,
  students,
  schoolId,
}: Props) {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
  graduateUrl: string;
  defaultUrl?: string;
  name: string;
} | null>(null);

const [modal, setModal] = useState<null | {
  type: "student" | "media";
  student?: {
    graduateUrl: string;
    defaultUrl?: string;
    name: string;
  };
  media?: {
    url: string;
    mediaType: "photo" | "video";
  };
}>(null);

    useEffect(() => {
    if (selectedImage) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }

    return () => {
        document.body.style.overflow = "";
    };
    }, [selectedImage]);

  return (
    <section className="w-full max-w-[1600px] bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition">
      <div className="flex flex-col gap-5">

        <ul className="grid grid-cols-1 gap-4">
          {mediaTeam.map((medium) => (
            <li key={medium.id}>
              <div className="flex items-stretch gap-4 mt-4">

                <div className="w-8/12 shrink-0">
                    <div
                    className="cursor-pointer"
                    onClick={() =>
                        setModal({
                        type: "media",
                        media: {
                            url: medium.url,
                            mediaType: medium.type,
                        },
                        })
                    }
                    >
                        {medium.type === "photo" && (
                        <div className="relative w-full aspect-[3/2] bg-gray-50">
                            <Image
                            src={medium.url}
                            alt=""
                            fill
                            className="object-contain"
                            />
                        </div>
                        )}
                    </div>
                </div>

                <div className="w-4/12 shrink-0 flex items-center">
                  <div className="grid grid-cols-3 gap-3 w-full">

                    {teamMembers
                      .filter((member) => member.media_id === medium.id)
                      .slice(0, 6)
                      .map((member) => {
                        const student = students.find(
                          (student) => student.name === member.name
                        );

                        if (!student?.profile_graduate) return null;

                        return (
                          <div
                            key={member.id}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() =>
                              setSelectedStudent(student.name)
                            }
                          >
                            <Image
                                key={student.profile_graduate}
                                src={`${student.profile_graduate}?v=${student.id}`}
                                alt={student.name}
                                width={180}
                                height={180}
                                className="object-cover rounded-md cursor-pointer hover:opacity-90 transition"
                               onClick={() =>
                                setModal({
                                    type: "student",
                                    student: {
                                    graduateUrl: student.profile_graduate,
                                    defaultUrl: student.profile_default,
                                    name: student.name,
                                    },
                                })
                                }
                                />

                            <span className="text-lg mt-1 text-center">
                              {student.name}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            </li>
          ))}
        </ul>

       {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* 배경 */}
            <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setModal(null)}
            />

            {/* 닫기 버튼 (화면 기준) */}
            <button
            onClick={() => setModal(null)}
            className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white text-black shadow-md"
            >
            ✕
            </button>

            {/* MEDIA 모달 */}
            {modal.type === "media" && modal.media && (
            <div className="relative z-10 flex items-center justify-center">
                {modal.media.mediaType === "photo" ? (
                <Image
                    src={modal.media.url}
                    alt=""
                    width={1600}
                    height={1000}
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
                />
                ) : (
                <video
                    src={modal.media.url}
                    controls
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto"
                />
                )}
            </div>
            )}

            {/* STUDENT 모달 */}
            {modal.type === "student" && modal.student && (
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">

                <div className="flex flex-col items-center">
                <Image
                    src={modal.student.graduateUrl}
                    alt=""
                    width={800}
                    height={1000}
                    className="max-w-[45vw] max-h-[80vh] w-auto h-auto object-contain"
                />
                <p className="text-white mt-2">졸업사진</p>
                </div>

                {modal.student.defaultUrl && (
                <div className="flex flex-col items-center">
                    <Image
                    src={modal.student.defaultUrl}
                    alt=""
                    width={800}
                    height={1000}
                    className="max-w-[45vw] max-h-[80vh] w-auto h-auto object-contain"
                    />
                    <p className="text-white mt-2">프로필</p>
                </div>
                )}
            </div>
            )}

        </div>
        )}
      </div>
    </section>
  );
}