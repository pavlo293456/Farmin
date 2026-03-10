-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Vendors table
create table if not exists vendors (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now(),

  -- Profile
  business_name text not null,
  bio           text,
  photo_url     text,

  -- Products
  products      text[] default '{}',

  -- This week
  this_week     text,

  -- Markets they attend
  markets       jsonb default '[]',
  -- Shape: [{ market_id: string, market_name: string, dates: string }]

  -- Links
  instagram     text,
  website       text,

  -- Gallery (array of image URLs)
  gallery       text[] default '{}',

  -- Status
  is_published  boolean default false
);

-- One vendor profile per user
create unique index if not exists vendors_user_id_idx on vendors(user_id);

-- Row Level Security
alter table vendors enable row level security;

-- Anyone can read published vendors
create policy "Public can view published vendors"
  on vendors for select
  using (is_published = true);

-- Users can read their own vendor profile (even unpublished)
create policy "Vendors can view own profile"
  on vendors for select
  using (auth.uid() = user_id);

-- Users can insert their own profile
create policy "Vendors can create own profile"
  on vendors for insert
  with check (auth.uid() = user_id);

-- Users can update their own profile
create policy "Vendors can update own profile"
  on vendors for update
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger vendors_updated_at
  before update on vendors
  for each row execute function update_updated_at();
