import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ExamForm from '@/components/ExamForm'

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()

  if (!exam) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Exam</h1>
        <p className="text-gray-500 mt-1">Update exam details below.</p>
      </div>
      <ExamForm exam={exam} />
    </div>
  )
}
