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
