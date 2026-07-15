'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Exam } from '@/lib/types'
import Link from 'next/link'

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Business Administration',
  'Mathematics',
  'Physics',
]

interface Props {
  exam?: Exam
}

export default function ExamForm({ exam }: Props) {
  const router = useRouter()
  const isEdit = !!exam

  const [formData, setFormData] = useState({
    title: exam?.title ?? '',
    description: exam?.description ?? '',
    department: exam?.department ?? '',
    year: String(exam?.year ?? 1),
    duration_minutes: String(exam?.duration_minutes ?? 60),
    total_marks: String(exam?.total_marks ?? 100),
    passing_marks: String(exam?.passing_marks ?? 50),
    is_active: exam?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      title: formData.title,
      description: formData.description,
      department: formData.department,
      year: parseInt(formData.year),
      duration_minutes: parseInt(formData.duration_minutes),
      total_marks: parseInt(formData.total_marks),
      passing_marks: parseInt(formData.passing_marks),
      is_active: formData.is_active,
      created_by: user!.id,
    }

    let error_
    let examId = exam?.id

    if (isEdit) {
      const { error: err } = await supabase
        .from('exams')
        .update(payload)
        .eq('id', exam!.id)
      error_ = err
    } else {
      const { data, error: err } = await supabase
        .from('exams')
        .insert(payload)
        .select('id')
        .single()
      error_ = err
      examId = data?.id
    }

    if (error_) {
      setError(error_.message)
      setLoading(false)
      return
    }

    if (!isEdit && examId) {
      router.push(`/admin/exams/${examId}/questions`)
    } else {
      router.push('/admin/exams')
    }
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/admin/exams" className="text-blue-600 text-sm hover:underline">← Back to Exams</Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Mid-Term Exam — Computer Networks"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Briefly describe the exam scope and topics covered."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min)</label>
              <input
                name="duration_minutes"
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Marks</label>
              <input
                name="total_marks"
                type="number"
                min="1"
                value={formData.total_marks}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing Marks</label>
              <input
                name="passing_marks"
                type="number"
                min="1"
                value={formData.passing_marks}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active (visible to students)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Exam' : 'Create Exam & Add Questions →'}
            </button>
            <Link href="/admin/exams" className="bg-white text-gray-600 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
