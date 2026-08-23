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

-- Catalog of skincare product categories and what each one does.
-- Mirrors the content on the /products page.
create table if not exists public.skincare_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  step int not null,
  slug text not null unique,
  title text not null,
  description text not null
);

alter table public.skincare_products enable row level security;

-- This is reference/catalog data, not user data, so anyone with the
-- anon key can read it. Nobody can insert, update, or delete with that key.
create policy "Allow public read access"
  on public.skincare_products
  for select
  to anon
  using (true);

insert into public.skincare_products (step, slug, title, description) values
  (1, 'cleansers', 'Cleansers', 'Wash away dirt, oil, and sunscreen without stripping your skin. The first step in every routine, morning and night.'),
  (2, 'oil-cleansers', 'Oil cleansers', 'A first-cleanse step that melts away sunscreen and makeup before your regular cleanser goes to work.'),
  (3, 'toners', 'Toners', 'A light, alcohol-free liquid that removes residue and preps skin to absorb the treatments that follow.'),
  (4, 'serums-treatments', 'Serums & treatments', 'Concentrated formulas — vitamin C, retinol, niacinamide, and more — targeted at specific concerns like acne, dullness, or aging.'),
  (5, 'eye-creams', 'Eye creams', 'Lightweight, targeted hydration for the delicate skin around the eyes.'),
  (6, 'moisturizers', 'Moisturizers', 'Lock in hydration and support your skin barrier. Formulated lighter for oily skin, richer for dry skin.'),
  (7, 'facial-oils', 'Facial oils', 'An optional finishing layer that seals in moisturizer and softens skin overnight.'),
  (8, 'spf', 'SPF', 'Broad-spectrum sun protection — the single most impactful step for keeping your skin healthy long-term.')
on conflict (slug) do nothing;

-- Newsletter signups from the form on every page.
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  email text not null unique
);

alter table public.subscribers enable row level security;

-- Anyone using the public anon key can sign up for the newsletter...
create policy "Allow anonymous inserts"
  on public.subscribers
  for insert
  to anon
  with check (true);

-- ...but nobody can read, update, or delete rows with that key.
-- The admin dashboard (/admin) uses the service role key, which bypasses
-- RLS entirely, so no anon select/update/delete policies are needed here.

-- Profile row for every authenticated user (Google OAuth via Supabase Auth).
-- Row is auto-created by the handle_new_user trigger below when a new
-- auth.users row is inserted, so no client-side insert policy is needed.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read and update only their own profile row. The update policy
-- technically allows a user to send a role value, but the only write path
-- (the settings page's server action) never sets role — promoting someone
-- to admin is a manual edit in the Supabase Table Editor.
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile row (role defaults to 'user') whenever a new
-- Supabase Auth user signs up. Google's provider populates given_name/
-- family_name directly; fall back to splitting full_name/name on the
-- first space if only a combined name is present.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := new.raw_user_meta_data;
  full_name text := coalesce(meta ->> 'full_name', meta ->> 'name');
  first_name text := meta ->> 'given_name';
  last_name text := meta ->> 'family_name';
begin
  if first_name is null and full_name is not null then
    first_name := split_part(full_name, ' ', 1);
    last_name := nullif(trim(substring(full_name from position(' ' in full_name))), '');
  end if;

  insert into public.profiles (id, first_name, last_name)
  values (new.id, first_name, last_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public profile fields, shown at /u/[username]. avatar_url holds whichever
-- photo is currently active — seeded from the Google account photo on
-- sign-up, replaceable with an upload, and resettable back to the Google
-- photo. All of it is writable through the existing "Users can update their
-- own profile" policy above, so no new RLS policies are needed here.
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists website_url text;
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists tiktok_url text;
alter table public.profiles add column if not exists avatar_url text;

-- Case-insensitive uniqueness so "JaneDoe" and "janedoe" can't both exist.
create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

-- Keep usernames to a predictable, URL-safe shape.
alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,20}$');

-- Backfill avatar_url for profiles created before this column existed, from
-- whatever photo Google supplied at sign-up.
update public.profiles p
set avatar_url = coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture')
from auth.users u
where p.id = u.id and p.avatar_url is null;

-- Re-seed new profiles with their Google photo as the initial avatar.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := new.raw_user_meta_data;
  full_name text := coalesce(meta ->> 'full_name', meta ->> 'name');
  first_name text := meta ->> 'given_name';
  last_name text := meta ->> 'family_name';
  avatar_url text := coalesce(meta ->> 'avatar_url', meta ->> 'picture');
begin
  if first_name is null and full_name is not null then
    first_name := split_part(full_name, ' ', 1);
    last_name := nullif(trim(substring(full_name from position(' ' in full_name))), '');
  end if;

  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (new.id, first_name, last_name, avatar_url)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Storage bucket for user-uploaded avatars. Public so avatar images can be
-- shown on the public profile page without signed URLs; each user may only
-- write inside their own "<user id>/..." folder.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Link skin_profiles to the signed-in user who took the quiz, so the
-- outcome can be shown back on their account and the AM/PM routine can be
-- edited afterward. Anonymous quiz takers (no session) still get a row
-- with user_id null, matching the existing anon-insert-only behavior.
alter table public.skin_profiles add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- One profile per user: retaking the quiz overwrites the existing row via
-- upsert instead of piling up duplicates. A plain (non-partial) unique
-- constraint is required here, not a partial index — Postgres only infers
-- partial indexes for ON CONFLICT targets when the same predicate is
-- repeated in the conflict clause, which Supabase's .upsert() doesn't do.
-- A plain unique constraint still allows any number of anonymous rows
-- (user_id null), since Postgres treats NULL as distinct from every other
-- NULL for uniqueness purposes.
alter table public.skin_profiles drop constraint if exists skin_profiles_user_id_key;
alter table public.skin_profiles add constraint skin_profiles_user_id_key unique (user_id);

-- Signed-in users can save and read back their own quiz result. The
-- existing "Allow anonymous inserts" policy above is unaffected — it still
-- lets signed-out visitors take the quiz, just with no way to read the row
-- back (matching current behavior).
drop policy if exists "Users can view their own skin profile" on public.skin_profiles;
create policy "Users can view their own skin profile"
  on public.skin_profiles
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can insert their own skin profile" on public.skin_profiles;
create policy "Users can insert their own skin profile"
  on public.skin_profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can update their own skin profile" on public.skin_profiles;
create policy "Users can update their own skin profile"
  on public.skin_profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
