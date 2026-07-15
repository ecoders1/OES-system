import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">OES</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Online Exam System</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href={profile?.role === 'admin' ? '/admin' : '/student'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-3xl">OES</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Online Exam System
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            A modern, secure, and efficient platform for conducting online examinations.
            Built for students and educators alike.
          </p>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            Take exams from anywhere, anytime. Instant results, real-time timers,
            and a comprehensive admin dashboard for managing your institution&apos;s exams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href={profile?.role === 'admin' ? '/admin' : '/student'}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Exam →
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">MCQ Exams</h3>
            <p className="text-gray-500 text-sm">Take multiple-choice question exams with instant scoring and detailed result analysis.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Timer</h3>
            <p className="text-gray-500 text-sm">Each exam includes a countdown timer. Auto-submit when time runs out to ensure fairness.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-500 text-sm">Get your score immediately after submission with pass/fail status and performance breakdown.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">100%</div>
              <div className="text-blue-200 text-sm">Online & Secure</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">24/7</div>
              <div className="text-blue-200 text-sm">Available Anytime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">Instant</div>
              <div className="text-blue-200 text-sm">Result Delivery</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">OES</span>
              </div>
              <span className="text-gray-600 text-sm font-medium">Online Exam System</span>
            </div>
            <p className="text-gray-400 text-sm">© 2025 OES. Built with Next.js, Tailwind CSS & Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
