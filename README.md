# OES – Online Exam System

A modern, full-stack online examination platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

## Features

### Student
- Register and login with Supabase Auth
- View available exams (filter by department and year)
- Take MCQ exams with real-time countdown timer
- Auto-submit when time expires
- See instant results with answer review

### Admin
- Secure admin dashboard
- Create, edit, delete, and activate/deactivate exams
- Add and manage MCQ questions per exam
- View all registered students
- View all exam results with pass rates and averages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/oes-app.git
cd oes-app
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create an admin user

1. Register normally via `/auth/register`
2. In Supabase SQL Editor run:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Database Schema

```
profiles     - User accounts (students and admins)
exams        - Exam metadata (title, department, year, duration, marks)
questions    - MCQ questions with 4 options and correct answer
results      - Student submissions with scores and answers
```

## Project Structure

```
oes-app/
├── app/
│   ├── page.tsx              # Home page
│   ├── auth/
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── student/
│   │   ├── page.tsx          # Student dashboard
│   │   ├── exams/            # Browse & take exams
│   │   └── results/          # View results
│   └── admin/
│       ├── page.tsx          # Admin dashboard
│       ├── exams/            # Manage exams & questions
│       ├── students/         # View students
│       └── results/          # View all results
├── components/               # Reusable UI components
├── lib/
│   ├── supabase/             # Supabase client/server helpers
│   └── types.ts              # TypeScript types
└── supabase/
    └── schema.sql            # Database schema
```
