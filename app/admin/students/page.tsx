import { createClient } from '@/lib/supabase/server'

export default async function AdminStudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  // Get result counts per student
  const { data: resultCounts } = await supabase
    .from('results')
    .select('student_id')

  const countMap: Record<string, number> = {}
  resultCounts?.forEach(r => {
    countMap[r.student_id] = (countMap[r.student_id] ?? 0) + 1
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-500 mt-1">{students?.length ?? 0} registered students</p>
      </div>

      {students && students.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Exams Taken</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.full_name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{student.full_name}</div>
                          <div className="text-xs text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.department ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Year {student.year ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{countMap[student.id] ?? 0}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No students registered</h3>
          <p className="text-gray-500">Students will appear here once they sign up.</p>
        </div>
      )}
    </div>
  )
}
