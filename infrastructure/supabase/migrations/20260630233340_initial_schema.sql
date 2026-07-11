-- ============================================================================
-- Revsys AI — Initial Schema (Sprint 0: Platform Foundation)
-- Business objects per Manual II (Business Domain & Data Model).
-- Structural foundation only — no business-rule logic, per the Sprint 0 Brief.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- SHARED: updated_at / version maintenance
-- Every business object is version-controlled per Manual II Part VI.
-- ============================================================================

create or replace function public.handle_record_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.version = old.version + 1;
  return new;
end;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Merchant: authenticated platform user. 1:1 with auth.users.
create table public.merchants (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Organization: supports future multi-user teams. V1 = single-merchant owner.
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references public.merchants (id) on delete cascade,
  billing_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Organization membership (roles), enabling future multi-user teams.
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  merchant_id uuid not null references public.merchants (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz,
  unique (organization_id, merchant_id)
);

-- Store: a connected ecommerce business.
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  merchant_id uuid not null references public.merchants (id) on delete cascade,
  name text not null,
  domain text not null,
  platform_type text not null default 'shopify'
    check (platform_type in ('shopify', 'woocommerce', 'bigcommerce', 'adobe_commerce', 'other')),
  industry text,
  shopify_connected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Revenue Scan: a completed (or in-progress) scan of a store.
create table public.revenue_scans (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  scan_type text not null default 'public' check (scan_type in ('public', 'connected')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  confidence numeric(5, 2) check (confidence >= 0 and confidence <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Revenue Report: the complete business analysis produced from a scan.
create table public.revenue_reports (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  scan_id uuid not null unique references public.revenue_scans (id) on delete cascade,
  revenue_estimate_low numeric(14, 2),
  revenue_estimate_high numeric(14, 2),
  recovery_priority text check (recovery_priority in ('low', 'medium', 'high', 'critical')),
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Revenue Health: current health score of a merchant's store.
create table public.revenue_health (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  overall_score numeric(5, 2) check (overall_score >= 0 and overall_score <= 100),
  category_scores jsonb not null default '{}'::jsonb,
  confidence numeric(5, 2) check (confidence >= 0 and confidence <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Revenue Leak: a standardized leak from the Revenue Leak Intelligence Library.
create table public.revenue_leaks (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  revenue_report_id uuid references public.revenue_reports (id) on delete cascade,
  leak_catalog_id text not null,
  category text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  evidence jsonb not null default '{}'::jsonb,
  estimated_revenue_loss_low numeric(14, 2),
  estimated_revenue_loss_high numeric(14, 2),
  confidence numeric(5, 2) check (confidence >= 0 and confidence <= 100),
  recovery_status text not null default 'unaddressed'
    check (recovery_status in ('unaddressed', 'in_progress', 'recovered', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Recommendation: an AI-generated recommendation tied to a leak.
create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  revenue_leak_id uuid references public.revenue_leaks (id) on delete cascade,
  recommendation_type text not null,
  business_context text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  expected_outcome text,
  supporting_evidence jsonb not null default '{}'::jsonb,
  implementation_status text not null default 'not_started'
    check (implementation_status in ('not_started', 'in_progress', 'completed', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Recovery Plan: an actionable plan for recovering revenue leaks.
create table public.recovery_plans (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  recommendation_id uuid references public.recommendations (id) on delete cascade,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  estimated_impact numeric(14, 2),
  progress numeric(5, 2) not null default 0 check (progress >= 0 and progress <= 100),
  verified boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Recovery Plan Task: individual tasks within a recovery plan.
create table public.recovery_plan_tasks (
  id uuid primary key default gen_random_uuid(),
  recovery_plan_id uuid not null references public.recovery_plans (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- Integration: a connected third-party platform (Shopify, GA, Meta, Klaviyo, Search Console).
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  provider text not null
    check (provider in ('shopify', 'google_analytics', 'google_search_console', 'meta_ads', 'klaviyo')),
  status text not null default 'disconnected' check (status in ('disconnected', 'connected', 'error')),
  connected_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz,
  unique (store_id, provider)
);

-- Notification: communication delivered to a merchant.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants (id) on delete cascade,
  type text not null
    check (type in ('scan_complete', 'revenue_leak_detected', 'recovery_progress', 'platform_update', 'alert')),
  title text not null,
  message text not null,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- AI Session: reasoning metadata and audit trail for AI-assisted engine runs.
create table public.ai_sessions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants (id) on delete cascade,
  store_id uuid references public.stores (id) on delete cascade,
  engine_name text,
  prompt_version text,
  business_context jsonb not null default '{}'::jsonb,
  reasoning_metadata jsonb not null default '{}'::jsonb,
  confidence numeric(5, 2) check (confidence >= 0 and confidence <= 100),
  generated_outputs jsonb not null default '{}'::jsonb,
  audit_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id),
  version integer not null default 1,
  deleted_at timestamptz
);

-- ============================================================================
-- TRIGGERS: updated_at / version maintenance
-- ============================================================================

create trigger trg_merchants_update before update on public.merchants
  for each row execute function public.handle_record_update();
create trigger trg_organizations_update before update on public.organizations
  for each row execute function public.handle_record_update();
create trigger trg_organization_members_update before update on public.organization_members
  for each row execute function public.handle_record_update();
create trigger trg_stores_update before update on public.stores
  for each row execute function public.handle_record_update();
create trigger trg_revenue_scans_update before update on public.revenue_scans
  for each row execute function public.handle_record_update();
create trigger trg_revenue_reports_update before update on public.revenue_reports
  for each row execute function public.handle_record_update();
create trigger trg_revenue_health_update before update on public.revenue_health
  for each row execute function public.handle_record_update();
create trigger trg_revenue_leaks_update before update on public.revenue_leaks
  for each row execute function public.handle_record_update();
create trigger trg_recommendations_update before update on public.recommendations
  for each row execute function public.handle_record_update();
create trigger trg_recovery_plans_update before update on public.recovery_plans
  for each row execute function public.handle_record_update();
create trigger trg_recovery_plan_tasks_update before update on public.recovery_plan_tasks
  for each row execute function public.handle_record_update();
create trigger trg_integrations_update before update on public.integrations
  for each row execute function public.handle_record_update();
create trigger trg_notifications_update before update on public.notifications
  for each row execute function public.handle_record_update();
create trigger trg_ai_sessions_update before update on public.ai_sessions
  for each row execute function public.handle_record_update();

-- ============================================================================
-- INDEXES
-- ============================================================================

create index idx_organizations_owner_id on public.organizations (owner_id);
create index idx_organization_members_organization_id on public.organization_members (organization_id);
create index idx_organization_members_merchant_id on public.organization_members (merchant_id);
create index idx_stores_organization_id on public.stores (organization_id);
create index idx_stores_merchant_id on public.stores (merchant_id);
create index idx_revenue_scans_store_id on public.revenue_scans (store_id);
create index idx_revenue_reports_store_id on public.revenue_reports (store_id);
create index idx_revenue_health_store_id on public.revenue_health (store_id);
create index idx_revenue_leaks_store_id on public.revenue_leaks (store_id);
create index idx_revenue_leaks_revenue_report_id on public.revenue_leaks (revenue_report_id);
create index idx_recommendations_store_id on public.recommendations (store_id);
create index idx_recommendations_revenue_leak_id on public.recommendations (revenue_leak_id);
create index idx_recovery_plans_store_id on public.recovery_plans (store_id);
create index idx_recovery_plans_recommendation_id on public.recovery_plans (recommendation_id);
create index idx_recovery_plan_tasks_recovery_plan_id on public.recovery_plan_tasks (recovery_plan_id);
create index idx_integrations_store_id on public.integrations (store_id);
create index idx_notifications_merchant_id on public.notifications (merchant_id);
create index idx_ai_sessions_merchant_id on public.ai_sessions (merchant_id);
create index idx_ai_sessions_store_id on public.ai_sessions (store_id);

-- ============================================================================
-- RLS: helper functions
-- Ownership flows through Organization membership (Manual II Part IV),
-- kept as reusable functions so future multi-user roles don't require
-- rewriting every table policy.
-- ============================================================================

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.merchant_id = auth.uid()
      and om.deleted_at is null
  );
$$;

create or replace function public.is_organization_owner(target_organization_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.organizations o
    where o.id = target_organization_id
      and o.owner_id = auth.uid()
  );
$$;

create or replace function public.is_store_accessible(target_store_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.stores s
    where s.id = target_store_id
      and public.is_organization_member(s.organization_id)
  );
$$;

create or replace function public.is_recovery_plan_accessible(target_recovery_plan_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.recovery_plans rp
    where rp.id = target_recovery_plan_id
      and public.is_store_accessible(rp.store_id)
  );
$$;

-- ============================================================================
-- RLS: enable on every table
-- ============================================================================

alter table public.merchants enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.stores enable row level security;
alter table public.revenue_scans enable row level security;
alter table public.revenue_reports enable row level security;
alter table public.revenue_health enable row level security;
alter table public.revenue_leaks enable row level security;
alter table public.recommendations enable row level security;
alter table public.recovery_plans enable row level security;
alter table public.recovery_plan_tasks enable row level security;
alter table public.integrations enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_sessions enable row level security;

-- ============================================================================
-- RLS: policies
-- ============================================================================

-- merchants
create policy "merchants_select_own" on public.merchants
  for select using (id = auth.uid());
create policy "merchants_insert_own" on public.merchants
  for insert with check (id = auth.uid());
create policy "merchants_update_own" on public.merchants
  for update using (id = auth.uid()) with check (id = auth.uid());

-- organizations
create policy "organizations_select_member" on public.organizations
  for select using (public.is_organization_member(id));
create policy "organizations_insert_owner" on public.organizations
  for insert with check (owner_id = auth.uid());
create policy "organizations_update_owner" on public.organizations
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- organization_members
create policy "organization_members_select_member" on public.organization_members
  for select using (public.is_organization_member(organization_id));
create policy "organization_members_insert_owner" on public.organization_members
  for insert with check (public.is_organization_owner(organization_id));
create policy "organization_members_update_owner" on public.organization_members
  for update using (public.is_organization_owner(organization_id))
  with check (public.is_organization_owner(organization_id));

-- stores
create policy "stores_select_member" on public.stores
  for select using (public.is_organization_member(organization_id));
create policy "stores_insert_member" on public.stores
  for insert with check (public.is_organization_member(organization_id));
create policy "stores_update_member" on public.stores
  for update using (public.is_organization_member(organization_id))
  with check (public.is_organization_member(organization_id));

-- revenue_scans
create policy "revenue_scans_select_member" on public.revenue_scans
  for select using (public.is_store_accessible(store_id));
create policy "revenue_scans_insert_member" on public.revenue_scans
  for insert with check (public.is_store_accessible(store_id));
create policy "revenue_scans_update_member" on public.revenue_scans
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- revenue_reports
create policy "revenue_reports_select_member" on public.revenue_reports
  for select using (public.is_store_accessible(store_id));
create policy "revenue_reports_insert_member" on public.revenue_reports
  for insert with check (public.is_store_accessible(store_id));
create policy "revenue_reports_update_member" on public.revenue_reports
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- revenue_health
create policy "revenue_health_select_member" on public.revenue_health
  for select using (public.is_store_accessible(store_id));
create policy "revenue_health_insert_member" on public.revenue_health
  for insert with check (public.is_store_accessible(store_id));
create policy "revenue_health_update_member" on public.revenue_health
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- revenue_leaks
create policy "revenue_leaks_select_member" on public.revenue_leaks
  for select using (public.is_store_accessible(store_id));
create policy "revenue_leaks_insert_member" on public.revenue_leaks
  for insert with check (public.is_store_accessible(store_id));
create policy "revenue_leaks_update_member" on public.revenue_leaks
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- recommendations
create policy "recommendations_select_member" on public.recommendations
  for select using (public.is_store_accessible(store_id));
create policy "recommendations_insert_member" on public.recommendations
  for insert with check (public.is_store_accessible(store_id));
create policy "recommendations_update_member" on public.recommendations
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- recovery_plans
create policy "recovery_plans_select_member" on public.recovery_plans
  for select using (public.is_store_accessible(store_id));
create policy "recovery_plans_insert_member" on public.recovery_plans
  for insert with check (public.is_store_accessible(store_id));
create policy "recovery_plans_update_member" on public.recovery_plans
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- recovery_plan_tasks
create policy "recovery_plan_tasks_select_member" on public.recovery_plan_tasks
  for select using (public.is_recovery_plan_accessible(recovery_plan_id));
create policy "recovery_plan_tasks_insert_member" on public.recovery_plan_tasks
  for insert with check (public.is_recovery_plan_accessible(recovery_plan_id));
create policy "recovery_plan_tasks_update_member" on public.recovery_plan_tasks
  for update using (public.is_recovery_plan_accessible(recovery_plan_id))
  with check (public.is_recovery_plan_accessible(recovery_plan_id));

-- integrations
create policy "integrations_select_member" on public.integrations
  for select using (public.is_store_accessible(store_id));
create policy "integrations_insert_member" on public.integrations
  for insert with check (public.is_store_accessible(store_id));
create policy "integrations_update_member" on public.integrations
  for update using (public.is_store_accessible(store_id))
  with check (public.is_store_accessible(store_id));

-- notifications
create policy "notifications_select_own" on public.notifications
  for select using (merchant_id = auth.uid());
create policy "notifications_insert_own" on public.notifications
  for insert with check (merchant_id = auth.uid());
create policy "notifications_update_own" on public.notifications
  for update using (merchant_id = auth.uid()) with check (merchant_id = auth.uid());

-- ai_sessions
create policy "ai_sessions_select_own" on public.ai_sessions
  for select using (merchant_id = auth.uid());
create policy "ai_sessions_insert_own" on public.ai_sessions
  for insert with check (merchant_id = auth.uid());
create policy "ai_sessions_update_own" on public.ai_sessions
  for update using (merchant_id = auth.uid()) with check (merchant_id = auth.uid());
