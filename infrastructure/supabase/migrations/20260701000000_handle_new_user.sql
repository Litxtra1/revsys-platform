-- ============================================================================
-- Revsys AI — New Merchant Provisioning
-- On signup, auto-create the Merchant record plus an owning Organization
-- and membership row (Manual II: Organization now, single-merchant in V1).
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_org_id uuid;
begin
  insert into public.merchants (id, email, created_by)
  values (new.id, new.email, new.id);

  insert into public.organizations (name, slug, owner_id, created_by)
  values (
    coalesce(nullif(split_part(new.email, '@', 1), ''), 'My Organization'),
    'org-' || replace(new.id::text, '-', ''),
    new.id,
    new.id
  )
  returning id into new_org_id;

  insert into public.organization_members (organization_id, merchant_id, role, created_by)
  values (new_org_id, new.id, 'owner', new.id);

  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();
