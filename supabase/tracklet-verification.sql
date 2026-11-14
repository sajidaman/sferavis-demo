create table if not exists public.tracklet_classification_suggestions (
  tracklet_id bigint not null check (tracklet_id between 0 and 13),
  voter_id uuid not null,
  classification text not null check (char_length(btrim(classification)) between 2 and 80),
  rationale text check (rationale is null or char_length(rationale) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tracklet_id, voter_id)
);

alter table public.tracklet_classification_suggestions enable row level security;
revoke all on public.tracklet_classification_suggestions from anon, authenticated;
grant all on public.tracklet_classification_suggestions to service_role;

create or replace function public.set_tracklet_suggestion_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tracklet_suggestion_updated_at on public.tracklet_classification_suggestions;
create trigger tracklet_suggestion_updated_at
before update on public.tracklet_classification_suggestions
for each row execute function public.set_tracklet_suggestion_updated_at();
