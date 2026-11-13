-- Bootstrap an empty Supabase project. Existing installations should compare
-- their schema first. A pre-existing table makes this transaction roll back.
begin;
create table public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  device text not null,
  updated_at timestamptz not null default now()
);
alter table public.progress enable row level security;
revoke all on public.progress from public, anon, authenticated;
grant select, insert, update on public.progress to authenticated;
create policy progress_read on public.progress for select to authenticated
  using (user_id = (select auth.uid()));
create policy progress_create on public.progress for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy progress_update on public.progress for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
alter publication supabase_realtime add table public.progress;
commit;
