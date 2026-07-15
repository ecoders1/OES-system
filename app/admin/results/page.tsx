import { createClient } from '@/lib/supabase/server'

export default async function AdminResultsPage() {
  const supabase = await createClient()

  const { data: results } = await supabase
    .from('results')
    .select('*, exam:exams(title, department, year), student:profiles(full_name, email)')
    .order('submitted_at', { ascending: false })

  const passedCount = results?.filter(r => r.passed).length ?? 0
  const totalCount = results?.length ?? 0
  const avgScore = totalCount > 0
    ? Math.round((results?.reduce((s, r) => s + r.percentage, 0) ?? 0) / totalCount)
    : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
        <p className="text-gray-500 mt-1">All student submissions</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          <div className="text-sm text-gray-500">Total Submissions</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {totalCount ? Math.round((passedCount / totalCount) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-500">Pass Rate</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{avgScore}%</div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
      </div>

      {results && results.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map(result => {
                  const exam = result.exam as { title: string; department: string; year: number }
                  const student = result.student as { full_name: string; email: string }
                  const mins = Math.floor(result.time_taken_seconds / 60)
                  const secs = result.time_taken_seconds % 60
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 text-sm">{student?.full_name}</div>
                        <div className="text-xs text-gray-400">{student?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{exam?.title}</div>
                        <div className="text-xs text-gray-400">{exam?.department} · Y{exam?.year}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{result.score}/{result.total_marks}</div>
                        <div className="text-xs text-gray-400">{result.percentage}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{mins}m {secs}s</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(result.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No results yet</h3>
          <p className="text-gray-500">Results will appear here once students take exams.</p>
        </div>
      )}
    </div>
  )
}
