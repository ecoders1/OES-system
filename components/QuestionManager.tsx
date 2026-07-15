'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Question } from '@/lib/types'

interface Props {
  examId: string
  initialQuestions: Question[]
}

const emptyQuestion = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A' as 'A' | 'B' | 'C' | 'D',
  marks: 1,
}

export default function QuestionManager({ examId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ ...emptyQuestion })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const openNew = () => {
    setFormData({ ...emptyQuestion })
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  const openEdit = (q: Question) => {
    setFormData({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      marks: q.marks,
    })
    setEditingId(q.id)
    setShowForm(true)
    setError('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    if (editingId) {
      const { error: err, data } = await supabase
        .from('questions')
        .update({
          question_text: formData.question_text,
          option_a: formData.option_a,
          option_b: formData.option_b,
          option_c: formData.option_c,
          option_d: formData.option_d,
          correct_answer: formData.correct_answer,
          marks: formData.marks,
        })
        .eq('id', editingId)
        .select('*')
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setQuestions(prev => prev.map(q => q.id === editingId ? data : q))
    } else {
      const { error: err, data } = await supabase
        .from('questions')
        .insert({
          exam_id: examId,
          question_text: formData.question_text,
          option_a: formData.option_a,
          option_b: formData.option_b,
          option_c: formData.option_c,
          option_d: formData.option_d,
          correct_answer: formData.correct_answer,
          marks: formData.marks,
          order_number: questions.length + 1,
        })
        .select('*')
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setQuestions(prev => [...prev, data])
    }

    setShowForm(false)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return
    const supabase = createClient()
    const { error: err } = await supabase.from('questions').delete().eq('id', id)
    if (!err) setQuestions(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div>
      {/* Question List */}
      <div className="space-y-3 mb-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full h-fit flex-shrink-0">
                  Q{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm mb-2">{q.question_text}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => {
                      const text = q[`option_${opt.toLowerCase()}` as keyof Question] as string
                      const isCorrect = q.correct_answer === opt
                      return (
                        <div key={opt} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${isCorrect ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-500'}`}>
                          <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{opt}</span>
                          <span className="truncate">{text}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{q.marks} mark{q.marks !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(q)} className="text-blue-600 text-xs hover:underline">Edit</button>
                <button onClick={() => handleDelete(q.id)} className="text-red-500 text-xs hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">❓</div>
            <p className="text-sm">No questions yet. Add your first question.</p>
          </div>
        )}
      </div>

      {!showForm && (
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          + Add Question
        </button>
      )}

      {/* Question Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-6 mt-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Question' : 'Add New Question'}
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Question Text</label>
              <textarea
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map(opt => (
                <div key={opt}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Option {opt}</label>
                  <input
                    name={`option_${opt.toLowerCase()}`}
                    value={formData[`option_${opt.toLowerCase()}` as keyof typeof formData] as string}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${opt}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Correct Answer</label>
                <select
                  name="correct_answer"
                  value={formData.correct_answer}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marks</label>
                <input
                  name="marks"
                  type="number"
                  min="1"
                  value={formData.marks}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving...' : editingId ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white text-gray-600 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
