import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: results } = await supabase
    .from('results')
    .select('*, exam:exams(title)')
    .eq('student_id', user!.id)
    .order('submitted_at', { ascending: false })
    .limit(5)

  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .eq('is_active', true)
    .eq('department', profile?.department || '')
    .order('created_at', { ascending: false })
    .limit(3)

  const totalExams = results?.length ?? 0
  const passed = results?.filter(r => r.passed).length ?? 0
  const avgScore = totalExams > 0
    ? Math.round((results?.reduce((sum, r) => sum + r.percentage, 0) ?? 0) / totalExams)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Student'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {profile?.department} — Year {profile?.year}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="text-3xl font-bold text-blue-600">{totalExams}</div>
          <div className="text-gray-500 text-sm mt-1">Exams Taken</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="text-3xl font-bold text-green-600">{passed}</div>
          <div className="text-gray-500 text-sm mt-1">Exams Passed</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="text-3xl font-bold text-purple-600">{avgScore}%</div>
          <div className="text-gray-500 text-sm mt-1">Average Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Exams */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Exams</h2>
            <Link href="/student/exams" className="text-blue-600 text-sm hover:underline">View all →</Link>
          </div>
          {exams && exams.length > 0 ? (
            <div className="space-y-3">
              {exams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{exam.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{exam.duration_minutes} min • {exam.total_marks} marks</div>
                  </div>
                  <Link
                    href={`/student/exams/${exam.id}`}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">No exams available for your department/year</p>
              <Link href="/student/exams" className="text-blue-600 text-sm hover:underline mt-2 inline-block">Browse all exams</Link>
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
            <Link href="/student/results" className="text-blue-600 text-sm hover:underline">View all →</Link>
          </div>
          {results && results.length > 0 ? (
            <div className="space-y-3">
              {results.map(result => (
                <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{(result.exam as { title: string })?.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {result.score}/{result.total_marks} marks
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    result.passed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {result.percentage}% {result.passed ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No exam results yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
