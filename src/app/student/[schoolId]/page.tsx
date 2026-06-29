import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AlbumClient from '../_component/AlbumClient';

export default async function AlbumPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/auth/login');

  const userId = session.user.id;

  const { data: profile } = await supabase
    .from('users')
    .select('user_type, school_id')
    .eq('id', userId)
    .single();

  if (!profile?.school_id) redirect('/auth/login');

  const schoolId = profile.school_id;

  // 🔥 서버에서 전부 미리 가져오기 (핵심)
  const [{ data: school },
    { data: foregroundList },
    { data: histories },
    { data: symbolList },
    { data: executives },
    { data: departments }
  ] = await Promise.all([
    supabase.from('schools').select('*').eq('id', schoolId).single(),
    supabase.from('foreground').select('*').eq('school_id', schoolId),
    supabase.from('history').select('*').eq('school_id', schoolId),
    supabase.from('symbol').select('*').eq('school_id', schoolId),
    supabase.from('executive').select('*').eq('school_id', schoolId),
    supabase.from('departments').select('*').eq('school_id', schoolId),
  ]);

  return (
    <AlbumClient
      user={profile}
      school={school}
      foregroundList={foregroundList ?? []}
      histories={histories ?? []}
      symbolList={symbolList ?? []}
      executives={executives ?? []}
      departments={departments ?? []}
    />
  );
}