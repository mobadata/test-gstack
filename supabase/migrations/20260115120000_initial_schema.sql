-- Schéma initial MVP — gstack-instagram (cf. ARCHITECTURE.md §4)
-- RLS par auth.uid() = user_id sur toutes les tables métier.

begin;

create type public.draft_status as enum (
  'pending_review',
  'edited',
  'rejected',
  'approved',
  'sent',
  'failed'
);

create table public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  external_ig_user_id text not null,
  username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, external_ig_user_id)
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  instagram_account_id uuid not null references public.instagram_accounts (id) on delete cascade,
  external_media_id text not null,
  caption text,
  permalink text,
  synced_at timestamptz not null default now(),
  unique (instagram_account_id, external_media_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  external_comment_id text not null,
  author_username text,
  message text not null,
  commented_at timestamptz,
  created_at timestamptz not null default now(),
  unique (media_id, external_comment_id)
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  comment_id uuid not null references public.comments (id) on delete cascade,
  status public.draft_status not null default 'pending_review',
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (comment_id)
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  draft_id uuid references public.drafts (id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_instagram_accounts_user on public.instagram_accounts (user_id);
create index idx_media_user on public.media (user_id);
create index idx_media_account on public.media (instagram_account_id);
create index idx_comments_user on public.comments (user_id);
create index idx_comments_media on public.comments (media_id);
create index idx_drafts_user_status on public.drafts (user_id, status);
create index idx_audit_log_user_created on public.audit_log (user_id, created_at desc);

alter table public.instagram_accounts enable row level security;
alter table public.media enable row level security;
alter table public.comments enable row level security;
alter table public.drafts enable row level security;
alter table public.audit_log enable row level security;

create policy instagram_accounts_is_owner on public.instagram_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy media_is_owner on public.media
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy comments_is_owner on public.comments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy drafts_is_owner on public.drafts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy audit_log_is_owner on public.audit_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

commit;
