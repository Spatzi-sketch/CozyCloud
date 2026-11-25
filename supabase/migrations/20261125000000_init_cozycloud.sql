-- Cozy Cloud initial schema
-- Run this in Supabase SQL Editor or via Supabase CLI migrations.

create extension if not exists pgcrypto;

-- Enum-like status via check constraint for simplicity
create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text not null,
  product_slug text not null,
  product_name text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'notified', 'unsubscribed')),
  consent_given_at timestamptz not null,
  consent_text text not null,
  confirm_token_hash text,
  confirm_token_expires_at timestamptz,
  confirmed_at timestamptz,
  notified_at timestamptz,
  unsubscribed_at timestamptz,
  unsubscribe_token_hash text,
  source_ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent duplicate active signups for the same product+email.
-- We enforce uniqueness on (product_slug, email_normalized) overall and handle
-- re-subscribe/unsubscribe transitions in application logic.
create unique index if not exists waitlist_entries_product_email_uidx
  on public.waitlist_entries (product_slug, email_normalized);

create index if not exists waitlist_entries_product_slug_idx
  on public.waitlist_entries (product_slug);

create index if not exists waitlist_entries_status_idx
  on public.waitlist_entries (status);

create index if not exists waitlist_entries_confirm_token_hash_idx
  on public.waitlist_entries (confirm_token_hash);

create index if not exists waitlist_entries_unsubscribe_token_hash_idx
  on public.waitlist_entries (unsubscribe_token_hash);

create table if not exists public.restock_send_logs (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  product_name text not null,
  admin_email text not null,
  recipient_count int not null default 0,
  sent_count int not null default 0,
  failed_count int not null default 0,
  status text not null default 'started' check (status in ('started', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists restock_send_logs_product_slug_idx
  on public.restock_send_logs (product_slug);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_waitlist_entries_updated_at on public.waitlist_entries;
create trigger set_waitlist_entries_updated_at
before update on public.waitlist_entries
for each row execute function public.set_updated_at();

-- Row Level Security: lock down by default.
-- The website uses the SUPABASE_SERVICE_ROLE_KEY only on the server for DB operations.
-- No anon/authenticated policies are created, so direct client access is denied.
alter table public.waitlist_entries enable row level security;
alter table public.restock_send_logs enable row level security;

-- Explicitly revoke direct access from anon/authenticated roles.
revoke all on table public.waitlist_entries from anon, authenticated;
revoke all on table public.restock_send_logs from anon, authenticated;

-- Service role retains access (bypasses RLS by default in Supabase).
grant all on table public.waitlist_entries to service_role;
grant all on table public.restock_send_logs to service_role;
