import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteExamButton from '@/components/DeleteExamButton'
import ToggleExamButton from '@/components/ToggleExamButton'

export default async function AdminExamsPage() {
  const supabase = await createClient()

  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Exams</h1>
          <p className="text-gray-500 mt-1">{exams?.length ?? 0} total exams</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          + New Exam
        </Link>
      </div>

      {exams && exams.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department / Year</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exams.map(exam => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{exam.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{exam.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{exam.department} · Year {exam.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{exam.duration_minutes} min</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{exam.total_marks} ({exam.passing_marks} to pass)</td>
                    <td className="px-6 py-4">
                      <ToggleExamButton examId={exam.id} isActive={exam.is_active} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/exams/${exam.id}`} className="text-blue-600 text-sm hover:underline">Edit</Link>
                        <Link href={`/admin/exams/${exam.id}/questions`} className="text-green-600 text-sm hover:underline">Questions</Link>
                        <DeleteExamButton examId={exam.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No exams yet</h3>
          <p className="text-gray-500 mb-6">Create your first exam to get started.</p>
          <Link
            href="/admin/exams/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Create Exam
          </Link>
        </div>
      )}
    </div>
  )
}
