import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: result } = await supabase
    .from('results')
    .select('*, exam:exams(*)')
    .eq('id', id)
    .eq('student_id', user!.id)
    .single()

  if (!result) notFound()

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', result.exam_id)
    .order('order_number', { ascending: true })

  const exam = result.exam as { title: string; department: string; year: number; passing_marks: number }
  const answers = result.answers as Record<string, string>
  const minutes = Math.floor(result.time_taken_seconds / 60)
  const seconds = result.time_taken_seconds % 60

  return (
    <div>
      <div className="mb-6">
        <Link href="/student/results" className="text-blue-600 text-sm hover:underline">← Back to Results</Link>
      </div>

      {/* Result Summary */}
      <div className={`rounded-2xl p-8 mb-8 text-white ${result.passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-4xl font-bold mb-1">{result.passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}</div>
            <div className="text-xl font-semibold opacity-90">{exam?.title}</div>
            <div className="text-sm opacity-75 mt-1">{exam?.department} — Year {exam?.year}</div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold">{result.percentage}%</div>
            <div className="text-sm opacity-80">{result.score}/{result.total_marks} marks</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{result.score}</div>
            <div className="text-xs opacity-80">Score</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{result.total_marks}</div>
            <div className="text-xs opacity-80">Total</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{exam?.passing_marks}</div>
            <div className="text-xs opacity-80">Pass Mark</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{minutes}m {seconds}s</div>
            <div className="text-xs opacity-80">Time Taken</div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Answer Review</h2>
        <div className="space-y-6">
          {questions?.map((q, idx) => {
            const studentAnswer = answers[q.id]
            const isCorrect = studentAnswer === q.correct_answer
            const notAnswered = !studentAnswer

            return (
              <div key={q.id} className={`p-5 rounded-xl border-2 ${
                notAnswered ? 'border-gray-200 bg-gray-50' :
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    notAnswered ? 'bg-gray-200 text-gray-600' :
                    isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                  }`}>
                    Q{idx + 1}
                  </span>
                  <p className="text-gray-900 font-medium text-sm">{q.question_text}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const optText = q[`option_${opt.toLowerCase()}` as keyof typeof q] as string
                    const isCorrectOpt = q.correct_answer === opt
                    const isStudentOpt = studentAnswer === opt

                    return (
                      <div key={opt} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        isCorrectOpt ? 'bg-green-100 text-green-800 font-medium' :
                        isStudentOpt && !isCorrectOpt ? 'bg-red-100 text-red-800 line-through' :
                        'text-gray-600'
                      }`}>
                        <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                          isCorrectOpt ? 'bg-green-500 text-white' :
                          isStudentOpt && !isCorrectOpt ? 'bg-red-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>{opt}</span>
                        {optText}
                      </div>
                    )
                  })}
                </div>

                <div className="ml-8 mt-2 text-xs text-gray-500">
                  {notAnswered ? '⚠️ Not answered' :
                    isCorrect ? `✓ Correct (+${q.marks} marks)` :
                    `✗ Your answer: ${studentAnswer} | Correct: ${q.correct_answer}`
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/student/exams" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
          Take Another Exam
        </Link>
        <Link href="/student" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Dashboard
        </Link>
      </div>
    </div>
  )
}
