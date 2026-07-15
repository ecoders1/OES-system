'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Exam, Question, AnswerMap } from '@/lib/types'

interface Props {
  exam: Exam
  questions: Question[]
  studentId: string
}

export default function ExamRunner({ exam, questions, studentId }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  const submitExam = useCallback(async (finalAnswers: AnswerMap) => {
    if (submitting) return
    setSubmitting(true)

    const supabase = createClient()
    const timeTaken = exam.duration_minutes * 60 - timeLeft

    // Calculate score
    let score = 0
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.correct_answer) {
        score += q.marks
      }
    })

    const percentage = Math.round((score / exam.total_marks) * 100)
    const passed = score >= exam.passing_marks

    const { data, error } = await supabase
      .from('results')
      .insert({
        student_id: studentId,
        exam_id: exam.id,
        score,
        total_marks: exam.total_marks,
        percentage,
        passed,
        answers: finalAnswers,
        time_taken_seconds: timeTaken,
      })
      .select('id')
      .single()

    if (!error && data) {
      router.push(`/student/results/${data.id}`)
    }
  }, [exam, questions, studentId, submitting, timeLeft, router])

  // Timer countdown
  useEffect(() => {
    if (!started) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          submitExam(answers)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [started, answers, submitExam])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleAnswer = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  const timerColor = timeLeft < 60 ? 'text-red-600' : timeLeft < 300 ? 'text-orange-500' : 'text-gray-900'

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h1>
          <p className="text-gray-500 mb-8">{exam.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xl font-bold text-gray-900">{exam.duration_minutes} min</div>
              <div className="text-sm text-gray-500">Time Limit</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xl font-bold text-gray-900">{exam.total_marks}</div>
              <div className="text-sm text-gray-500">Total Marks</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xl font-bold text-gray-900">{exam.passing_marks}</div>
              <div className="text-sm text-gray-500">Passing Marks</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-8">
            <p className="text-yellow-800 text-sm font-medium mb-1">⚠️ Important Instructions</p>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Each question has one correct answer (A, B, C, or D)</li>
              <li>• The exam auto-submits when time runs out</li>
              <li>• You cannot retake this exam once submitted</li>
              <li>• Navigate between questions using the question grid</li>
            </ul>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Exam →
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">{exam.title}</h2>
          <div className="text-sm text-gray-500">{answeredCount}/{questions.length} answered</div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-bold tabular-nums ${timerColor}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => submitExam(answers)}
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Question */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Q{currentQ + 1}
            </span>
            <span className="text-gray-400 text-sm">of {questions.length}</span>
            <span className="ml-auto text-xs text-gray-400">{question.marks} mark{question.marks !== 1 ? 's' : ''}</span>
          </div>

          <p className="text-gray-900 font-medium text-lg mb-6 leading-relaxed">
            {question.question_text}
          </p>

          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map(opt => {
              const text = question[`option_${opt.toLowerCase()}` as keyof Question] as string
              const selected = answers[question.id] === opt
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(question.id, opt)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center flex-shrink-0 ${
                    selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {opt}
                  </span>
                  <span className="text-sm">{text}</span>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
              disabled={currentQ === questions.length - 1}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Question Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-fit">
          <div className="text-sm font-medium text-gray-700 mb-3">Questions</div>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, idx) => {
              const answered = !!answers[q.id]
              const isCurrent = idx === currentQ
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(idx)}
                  className={`w-full aspect-square rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : answered
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div> Answered ({answeredCount})
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded bg-gray-100"></div> Not answered ({questions.length - answeredCount})
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
