'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'

export default function AdminNav({ user }: { user: Profile | null }) {
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/exams', label: 'Exams' },
    { href: '/admin/students', label: 'Students' },
    { href: '/admin/results', label: 'Results' },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">OES</span>
              </div>
              <span className="hidden sm:block text-sm font-semibold text-gray-700">Admin Panel</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="text-sm font-medium text-gray-900">{user?.full_name}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex gap-1 pb-2 overflow-x-auto">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
