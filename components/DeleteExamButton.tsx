'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteExamButton({ examId }: { examId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this exam and all its questions and results? This cannot be undone.')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('results').delete().eq('exam_id', examId)
    await supabase.from('questions').delete().eq('exam_id', examId)
    await supabase.from('exams').delete().eq('id', examId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 text-sm hover:underline disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  )
}
