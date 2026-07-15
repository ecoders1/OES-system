'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Exam } from '@/lib/types'

const DEPARTMENTS = [
  'All',
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
  exams: Exam[]
  takenExamIds: Set<string>
  defaultDepartment: string
  defaultYear: number
}

export default function ExamList({ exams, takenExamIds, defaultDepartment, defaultYear }: Props) {
  const [filterDept, setFilterDept] = useState(defaultDepartment || 'All')
  const [filterYear, setFilterYear] = useState(defaultYear ? String(defaultYear) : 'All')

  const filtered = exams.filter(exam => {
    const deptMatch = filterDept === 'All' || exam.department === filterDept
    const yearMatch = filterYear === 'All' || String(exam.year) === filterYear
    return deptMatch && yearMatch
  })

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Department:</label>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Year:</label>
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} exams</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(exam => {
            const taken = takenExamIds.has(exam.id)
            return (
              <div key={exam.id} className={`bg-white rounded-2xl border shadow-sm p-6 ${taken ? 'border-green-100 opacity-75' : 'border-gray-100 hover:shadow-md'} transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {taken && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Completed</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{exam.title}</h3>
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">{exam.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{exam.department}</span>
                  <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full">Year {exam.year}</span>
                  <span className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full">{exam.duration_minutes} min</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{exam.total_marks} marks</span>
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  Pass: {exam.passing_marks}/{exam.total_marks} ({Math.round((exam.passing_marks / exam.total_marks) * 100)}%)
                </div>

                {taken ? (
                  <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                    Already Taken
                  </button>
                ) : (
                  <Link
                    href={`/student/exams/${exam.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Exam →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No exams found</h3>
          <p className="text-gray-500">Try changing the filters to see available exams.</p>
        </div>
      )}
    </div>
  )
}
