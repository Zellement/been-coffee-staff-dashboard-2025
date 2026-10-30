-- Make room for the task history copied over from Contentful's employee
-- taskHistory field. Those entries never recorded which task instance was
-- completed, so entry_id has to allow nulls, and source marks where each
-- row came from.

alter table public.task_completions
    alter column entry_id drop not null;

alter table public.task_completions
    add column if not exists source text not null default 'dashboard';

comment on column public.task_completions.source is
    'dashboard for completions logged by the app; contentful for history copied from employee.taskHistory.';

-- Rows with no entry can't be the latest completion of anything
create or replace view public.latest_task_completions
with (security_invoker = true) as
select distinct on (entry_id)
    entry_id,
    completed_at,
    completed_by
from public.task_completions
where entry_id is not null
order by entry_id, completed_at desc;

-- Keep the table small. The leaderboard only needs the current pay period
-- (62 days covers it), but each task's latest completion is always kept so
-- rarely done routine tasks (quarterly, yearly) still show when they were
-- last done.
create or replace function public.prune_task_completions()
returns void
language sql
as $$
    delete from public.task_completions as tc
    where tc.completed_at < now() - interval '62 days'
      and (
          tc.entry_id is null
          or exists (
              select 1
              from public.task_completions as newer
              where newer.entry_id = tc.entry_id
                and newer.completed_at > tc.completed_at
          )
      );
$$;

-- Only the scheduled job should run it, not the API
revoke execute on function public.prune_task_completions()
    from public, anon, authenticated;

create extension if not exists pg_cron;

-- Nightly at 03:00 UTC; scheduling again under the same name replaces it
select cron.schedule(
    'prune-task-completions',
    '0 3 * * *',
    $$select public.prune_task_completions()$$
);
