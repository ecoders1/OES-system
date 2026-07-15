import { createClient } from '@/lib/supabase/server'
import ExamList from '@/components/ExamList'

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('department, year')
    .eq('id', user!.id)
    .single()

  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const { data: myResults } = await supabase
    .from('results')
    .select('exam_id')
    .eq('student_id', user!.id)

  const takenExamIds = new Set(myResults?.map(r => r.exam_id) ?? [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Exams</h1>
        <p className="text-gray-500 mt-1">Browse and start exams. Filter by department and year.</p>
      </div>

      <ExamList
        exams={exams ?? []}
        takenExamIds={takenExamIds}
        defaultDepartment={profile?.department ?? ''}
        defaultYear={profile?.year ?? 0}
      />
    </div>
  )
}
