import LogoBanner from '@/components/logo/LogoBanner';
import { createClient } from '@/utils/supabase/server';

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  let school = null;

  if (user) {
    // 1. user 정보 가져오기
    const { data: profile } = await supabase
      .from('users')
      .select('school_id, user_type')
      .eq('id', user.id)
      .single();

    // 2. school_id로 schools 테이블 조회
    if (profile?.school_id) {
      const { data: schoolData } = await supabase
        .from('schools')
        .select('*')
        .eq('id', profile.school_id)
        .single();

      school = schoolData;
    }
  }

  return (
    <div>
      <LogoBanner school={school} />
      <main>{children}</main>
    </div>
  );
}