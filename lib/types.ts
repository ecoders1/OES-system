export type UserRole = 'student' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  department: string | null
  year: number | null
  created_at: string
}

export interface Exam {
  id: string
  title: string
  description: string
  department: string
  year: number
  duration_minutes: number
  total_marks: number
  passing_marks: number
  is_active: boolean
  created_by: string
  created_at: string
}

export interface Question {
  id: string
  exam_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  marks: number
  order_number: number
}

export interface Result {
  id: string
  student_id: string
  exam_id: string
  score: number
  total_marks: number
  percentage: number
  passed: boolean
  answers: Record<string, string>
  time_taken_seconds: number
  submitted_at: string
  exam?: Exam
  student?: Profile
}

export type AnswerMap = Record<string, 'A' | 'B' | 'C' | 'D'>
