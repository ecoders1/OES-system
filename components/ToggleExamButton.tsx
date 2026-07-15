'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  examId: string
  isActive: boolean
}

export default function ToggleExamButton({ examId, isActive }: Props) {
  const [active, setActive] = useState(isActive)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('exams')
      .update({ is_active: !active })
      .eq('id', examId)

    if (!error) {
      setActive(!active)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all disabled:opacity-60 ${
        active
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {loading ? '...' : active ? 'Active' : 'Inactive'}
    </button>
  )
}
