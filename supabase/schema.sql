-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query).

create table if not exists public.skin_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  skin_type text not null,
  concern text not null,
  midday_feel text not null,
  spf_usage text not null,
  complexity text not null,
  routine jsonb not null
);

alter table public.skin_profiles enable row level security;

-- Anyone using the public anon key can submit a quiz result...
create policy "Allow anonymous inserts"
  on public.skin_profiles
  for insert
  to anon
  with check (true);

-- ...but nobody can read, update, or delete rows with that key.
-- Query results from the Supabase dashboard (Table Editor / SQL Editor),
-- which uses your account's elevated access, not the anon key.
