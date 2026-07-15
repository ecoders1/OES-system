import ExamForm from '@/components/ExamForm'

export default function NewExamPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create a new exam.</p>
      </div>
      <ExamForm />
    </div>
  )
}
