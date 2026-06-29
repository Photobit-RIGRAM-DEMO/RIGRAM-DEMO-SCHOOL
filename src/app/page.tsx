import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('user_type, school_id')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    redirect('/auth/login');
  }

  redirect(`/${profile.user_type}/${profile.school_id}`);

}
