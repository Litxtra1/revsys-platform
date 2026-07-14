-- ============================================================================
-- Revsys AI — Leak Difficulty & Estimated Fix Time (Revenue Command Center)
-- Additive columns supporting the Revenue Workspace / Recovery Queue views.
-- ============================================================================

alter table public.revenue_leaks
  add column difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  add column estimated_fix_minutes integer check (estimated_fix_minutes >= 0);
