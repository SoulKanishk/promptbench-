-- Optional cloud persistence. The app works fully on localStorage without this;
-- run this in the Supabase SQL editor only if you want cross-device sync.

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  folder text not null default 'general',
  content text not null,
  variants jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prompt_runs (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references prompts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  variant_label text,
  model text not null,
  input text,
  output text,
  latency_ms integer,
  tokens integer,
  error text,
  created_at timestamptz not null default now()
);

alter table prompts enable row level security;
alter table prompt_runs enable row level security;

create policy "Users manage their own prompts" on prompts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own runs" on prompt_runs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
