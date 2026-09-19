-- たびプラン: Supabase の SQL Editor に貼り付けて実行してください

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  destination text not null check (char_length(destination) between 1 and 60),
  start_date date,
  end_date date,
  budget_yen integer check (budget_yen >= 0),
  description text check (char_length(description) <= 2000),
  itinerary text check (char_length(itinerary) <= 5000),
  created_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);
create index plans_created_at_idx on public.plans (created_at desc);

create table public.likes (
  plan_id uuid not null references public.plans(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (plan_id, user_id)
);

-- サインアップ時にプロフィールを自動作成
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.likes enable row level security;

create policy "profiles are public" on public.profiles for select using (true);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

create policy "plans are public" on public.plans for select using (true);
create policy "insert own plan" on public.plans for insert with check (auth.uid() = user_id);
create policy "update own plan" on public.plans for update using (auth.uid() = user_id);
create policy "delete own plan" on public.plans for delete using (auth.uid() = user_id);

create policy "likes are public" on public.likes for select using (true);
create policy "like as myself" on public.likes for insert with check (auth.uid() = user_id);
create policy "unlike my own like" on public.likes for delete using (auth.uid() = user_id);
