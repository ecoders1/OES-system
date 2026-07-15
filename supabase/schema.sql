-- ================================================
-- OES - Online Exam System Database Schema
-- Run this in Supabase SQL Editor
-- ================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  department text,
  year integer,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, department, year)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'department',
    (new.raw_user_meta_data->>'year')::integer
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================
-- EXAMS TABLE
-- ================================================
create table public.exams (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  department text not null,
  year integer not null,
  duration_minutes integer not null default 60,
  total_marks integer not null default 100,
  passing_marks integer not null default 50,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.exams enable row level security;

-- Exams policies
create policy "Anyone can view active exams"
  on public.exams for select
  using (is_active = true or (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ));

create policy "Admins can insert exams"
  on public.exams for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update exams"
  on public.exams for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can delete exams"
  on public.exams for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ================================================
-- QUESTIONS TABLE
-- ================================================
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  marks integer not null default 1,
  order_number integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;

-- Questions policies
create policy "Authenticated users can view questions"
  on public.questions for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage questions"
  on public.questions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ================================================
-- RESULTS TABLE
-- ================================================
create table public.results (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  score integer not null default 0,
  total_marks integer not null default 0,
  percentage integer not null default 0,
  passed boolean not null default false,
  answers jsonb not null default '{}',
  time_taken_seconds integer not null default 0,
  submitted_at timestamptz not null default now(),
  unique(student_id, exam_id)
);

alter table public.results enable row level security;

-- Results policies
create policy "Students can view their own results"
  on public.results for select
  using (auth.uid() = student_id);

create policy "Students can insert their own results"
  on public.results for insert
  with check (auth.uid() = student_id);

create policy "Admins can view all results"
  on public.results for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ================================================
-- SAMPLE ADMIN USER
-- To create an admin, sign up normally then run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ================================================

-- ================================================
-- SAMPLE DATA (optional - for testing)
-- ================================================

-- Example: After creating an admin user, insert a sample exam:
-- INSERT INTO public.exams (title, description, department, year, duration_minutes, total_marks, passing_marks, created_by)
-- VALUES ('Sample CS Exam', 'Introduction to Computer Science', 'Computer Science', 1, 30, 10, 5, 'YOUR_ADMIN_USER_ID');
