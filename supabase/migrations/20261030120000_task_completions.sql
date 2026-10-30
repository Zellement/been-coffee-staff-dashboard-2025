-- Task completions, moved out of Contentful so ticking off a task no longer
-- costs Management API calls and publishes.
--
-- entry_id is the Contentful entry that was completed: a taskInstance
-- (daily / routine), a setDayTask or a singleTask.

create table if not exists public.task_completions (
    id bigint generated always as identity primary key,
    entry_id text not null,
    content_type text not null,
    location_id text,
    employee_id text,
    completed_by text,
    task_name text,
    minutes integer not null default 0,
    user_id uuid not null default auth.uid() references auth.users (id),
    completed_at timestamptz not null default now()
);

comment on column public.task_completions.entry_id is
    'Contentful entry ID of the completed taskInstance, setDayTask or singleTask.';
comment on column public.task_completions.employee_id is
    'Contentful employee entry ID of the person who completed it.';
comment on column public.task_completions.minutes is
    'Minutes logged towards the staff leaderboard; 0 if the task has none.';

create index if not exists task_completions_entry_completed_idx
    on public.task_completions (entry_id, completed_at desc);

create index if not exists task_completions_minutes_idx
    on public.task_completions (completed_at desc)
    where minutes > 0;

-- Latest completion per entry. security_invoker so the table's RLS applies
create or replace view public.latest_task_completions
with (security_invoker = true) as
select distinct on (entry_id)
    entry_id,
    completed_at,
    completed_by
from public.task_completions
order by entry_id, completed_at desc;

alter table public.task_completions enable row level security;

drop policy if exists "Staff can read task completions"
    on public.task_completions;
create policy "Staff can read task completions"
    on public.task_completions
    for select
    to authenticated
    using (true);

drop policy if exists "Staff can log their own task completions"
    on public.task_completions;
create policy "Staff can log their own task completions"
    on public.task_completions
    for insert
    to authenticated
    with check (user_id = auth.uid());
