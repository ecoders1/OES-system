import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: results } = await supabase
    .from('results')
    .select('*, exam:exams(title, department, year)')
    .eq('student_id', user!.id)
    .order('submitted_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
        <p className="text-gray-500 mt-1">All your exam results in one place.</p>
      </div>

      {results && results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(result => {
            const exam = result.exam as { title: string; department: string; year: number }
            return (
              <Link key={result.id} href={`/student/results/${result.id}`}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exam?.title}</h3>
                      <p className="text-sm text-gray-500">{exam?.department} — Year {exam?.year}</p>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      result.passed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {result.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(result.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{result.percentage}%</span>
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-gray-400">
                    <span>{result.score}/{result.total_marks} marks</span>
                    <span>{new Date(result.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No results yet</h3>
          <p className="text-gray-500 mb-6">Take an exam to see your results here.</p>
          <Link
            href="/student/exams"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Exams
          </Link>
        </div>
      )}
    </div>
  )
}
