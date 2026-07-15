import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OES - Online Exam System',
  description: 'A modern online examination platform for students and administrators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
