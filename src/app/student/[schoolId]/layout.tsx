import Header from '@/components/header';
import { createClient } from '@/utils/supabase/server';

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let school = null;

  if (user) {
    const { data } = await supabase
      .from('users')
      .select('school_id, user_type')
      .eq('id', user.id)
      .single();

    school = data;
  }

  let mainClass =
    'flex justify-center items-start flex-1 p-5 md:px-10 md:pb-0';

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header hasSchool />

      <main role="main" className={mainClass}>
        {children}
      </main>

      <footer className="w-full bg-gray-100 py-6 md:py-10">
        <div className="max-w-[1600px] mx-auto flex justify-end px-4 sm:mt-10 border-t border-border rounded-md">
          <p className="text-[8px] sm:text-sm md:text-base text-gray-600 mt-5">
            &copy; 2027 RIGRAM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}