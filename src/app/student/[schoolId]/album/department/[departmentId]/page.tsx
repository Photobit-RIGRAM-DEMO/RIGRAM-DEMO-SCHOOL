import { createClient } from '@/utils/supabase/server';
import DepartmentClient from './_component/DepartmentClient';

export default async function DepartmentPage({
  params,
}: {
  params: { departmentId: string };
}) {
  const supabase = await createClient();
  const departmentId = params.departmentId;

  const [
    departmentResult,
    staffsResult,
    studentsResult,
    mediaTeamResult,
    mediaEventResult,
  ] = await Promise.all([
    supabase.from('departments').select('*').eq('id', departmentId).single(),

    supabase.from('staffs').select('*').eq('department_id', departmentId),

    supabase.from('students').select('*').eq('dept_id', departmentId),

    supabase
      .from('media')
      .select('*')
      .eq('department_id', departmentId)
      .eq('category', 'team'),

    supabase
      .from('media')
      .select('*')
      .eq('department_id', departmentId)
      .eq('category', 'event'),
  ]);

  const department = departmentResult.data;
  const staffs = staffsResult.data ?? [];
  const students = studentsResult.data ?? [];
  const media_team = mediaTeamResult.data ?? [];
  const media_event = mediaEventResult.data ?? [];

  const mediaIds = media_team.map((m) => m.id);

  const { data: team_members } = await supabase
    .from('team_member')
    .select('*')
    .in('media_id', mediaIds);

  return (
    <DepartmentClient
      department={department}
      staffs={staffs}
      students={students}
      mediaTeam={media_team}
      teamMembers={team_members ?? []}
      mediaEvent={media_event}
    />
  );
}