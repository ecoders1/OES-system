import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ExamRunner from '@/components/ExamRunner'

export default async function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if already taken
  const { data: existingResult } = await supabase
    .from('results')
    .select('id')
    .eq('student_id', user!.id)
    .eq('exam_id', id)
    .single()

  if (existingResult) redirect(`/student/results/${existingResult.id}`)

  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!exam) notFound()

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', id)
    .order('order_number', { ascending: true })

  if (!questions || questions.length === 0) notFound()

  return (
    <ExamRunner
      exam={exam}
      questions={questions}
      studentId={user!.id}
    />
  )
}
