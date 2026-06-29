import Executive from '@/components/executive';
import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type Executive = {
  id: string;
  school_id: string;
  name: string;
  position: string;
  profile_url: string | null;
  role: string | null;
  section: string | null;
};

interface ExecutiveState {
  isLoading: boolean;
  error: string | null;

  executive: Executive | null;
  executives: Executive[];

  fetchExecutives: (schoolId: string) => Promise<void>;
  addExecutiveProfile: (
    school_id: string,
    name: string,
    position: string,
    profile_url: string | null,
    role: string | null,
    section: string | null
  ) => Promise<void>;
  deleteExecutive: (schoolId: string, executiveId: string) => Promise<boolean>;
  updateExecutivesPlace: (schoolId: string, executiveId: string, place: number) => Promise<boolean>;
}

export const useExecutiveStore = create<ExecutiveState>((set) => ({
  isLoading: false,
  error: null,

  executive: null,
  executives: [],

  fetchExecutives: async (schoolId) => {
    set({ isLoading: true, error: null });

    const { data: place, error: placeError } = await supabase
      .from('executive_place')
      .select('executive_id, place_number')
      .eq('school_id', schoolId)
      .order('place_number', { ascending: true });

    if (placeError) throw new Error("placeError");

    if (!place || place.length === 0) {
     const { data: execData } = await supabase
      .from('executive')
      .select('*')
      .eq('school_id', schoolId);

    set({ executives: execData || [], isLoading: false });

    }else{

      const ids = place.map(p => p.executive_id);

      const { data: execData, error: execError } = await supabase
      .from('executive')
      .select('*')
      .in('id', ids);

      if (execError) {
        console.error(execError);
        throw new Error(execError.message);
      }

      const execMap = new Map(
        execData.map(item => [item.id, item])
      );

      console.log('execMap',execMap);

      const executives: Executive[] = ids
      .map(id => execMap.get(id))
      .filter(Boolean) as Executive[];
      
      console.log('executives',executives);

      set({ executives: executives || [], isLoading: false });
    }
  },
  
  addExecutiveProfile: async (school_id, name, position, profile_url,role,section) => {

  const { data, error } = await supabase
    .from('executive')
    .insert([
      {
        school_id,
        name,
        position,
        profile_url,
        role,
        section,
      },
    ])
    .select()
    .single();

    if (error) {
      console.error('프로필을 추가하던 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false, error: error.message });
    } else if (data) {
      set((state) => ({
        executives: [...state.executives, data],
        isLoading: false,
      }));
    }
  },

  deleteExecutive: async (schoolId, executiveId) => {
    set({ isLoading: true, error: null });

    try {
      /* storage 파일 삭제 */
      const { data } = await supabase
        .from('executive')
        .select('profile_url')
        .eq('school_id', schoolId)
        .eq('id', executiveId)
        .single();

      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/executive-profiles/`;
      const filePaths: string[] = [];

      const extractPath = (fullUrl?: string | null) => {
        if (!fullUrl) return null;
        if (!fullUrl.startsWith(baseUrl)) return null;

        return fullUrl.replace(baseUrl, '');
      };

      const mainPath = extractPath(data?.profile_url);
      if (mainPath) filePaths.push(mainPath);

      console.log('삭제할 파일 경로:', filePaths);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('executive-profiles')
          .remove(filePaths);
        if (storageError) console.warn(`Storage 파일 삭제 중 오류:`, storageError.message);
      }


      const { error: deleteError } = await supabase
        .from('executive')
        .delete()
        .eq('id', executiveId)
        .eq('school_id', schoolId);
      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        executives: state.executives.filter((executive) => executive.id !== executiveId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('임직원 삭제 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false });
      return false;
    }
  },

   updateExecutivesPlace: async (schoolId, executiveId, place) => {
      const { data: existing, error: selectError } = await supabase
          .from('executive_place')
          .select('*')
          .eq('school_id', schoolId)
          .eq('executive_id', executiveId)
          .maybeSingle();

        
        // 없으면 INSERT
        if (!existing) {
          const { error: insertError } = await supabase
            .from('executive_place')
            .insert({
              school_id: schoolId,
              executive_id: executiveId,
              place_number: place,
            });

          if (insertError) {
            console.error('insert error:', insertError);
            return false;
          }

          return true;

          // 있으면 UPDATE
        }else{
          const { error: updateError } = await supabase
            .from('executive_place')
            .update({
              place_number: place,
            })
            .eq('school_id', schoolId)
            .eq('executive_id', executiveId);

          if (updateError) {
            console.error('update error:', updateError);
            return false;
          }

          return true;
        }

   }
}));
