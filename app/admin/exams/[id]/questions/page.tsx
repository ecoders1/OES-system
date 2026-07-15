import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import QuestionManager from '@/components/QuestionManager'

export default async function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()

  if (!exam) notFound()

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', id)
    .order('order_number', { ascending: true })

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/exams" className="text-blue-600 text-sm hover:underline">← Back to Exams</Link>
      </div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-500 mt-1">{exam.title} · {questions?.length ?? 0} questions</p>
        </div>
      </div>

      <QuestionManager examId={id} initialQuestions={questions ?? []} />
    </div>
  )
}
