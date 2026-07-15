import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: totalExams }, { count: totalStudents }, { count: totalResults }] = await Promise.all([
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('results').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentResults } = await supabase
    .from('results')
    .select('*, exam:exams(title), student:profiles(full_name)')
    .order('submitted_at', { ascending: false })
    .limit(8)

  const { data: recentExams } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage exams, students, and results</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          + New Exam
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalExams ?? 0}</div>
              <div className="text-gray-500 text-xs">Total Exams</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalStudents ?? 0}</div>
              <div className="text-gray-500 text-xs">Registered Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalResults ?? 0}</div>
              <div className="text-gray-500 text-xs">Exams Taken</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Exams</h2>
            <Link href="/admin/exams" className="text-blue-600 text-sm hover:underline">Manage →</Link>
          </div>
          {recentExams && recentExams.length > 0 ? (
            <div className="space-y-3">
              {recentExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{exam.title}</div>
                    <div className="text-xs text-gray-500">{exam.department} · Year {exam.year}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${exam.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {exam.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Link href={`/admin/exams/${exam.id}`} className="text-blue-600 text-xs hover:underline">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No exams created yet</p>
              <Link href="/admin/exams/new" className="text-blue-600 text-sm hover:underline mt-2 inline-block">Create one →</Link>
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
            <Link href="/admin/results" className="text-blue-600 text-sm hover:underline">View all →</Link>
          </div>
          {recentResults && recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map(result => {
                const exam = result.exam as { title: string }
                const student = result.student as { full_name: string }
                return (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{student?.full_name}</div>
                      <div className="text-xs text-gray-500">{exam?.title}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {result.percentage}%
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
