/**
 * Generated-style types for the Revsys AI Postgres schema.
 * Hand-authored to match infrastructure/supabase/migrations/20260630233340_initial_schema.sql
 * exactly. Once a live Supabase instance exists, this file should be regenerated with
 * `supabase gen types typescript` and diffed against this shape.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type MerchantRole = "owner" | "admin" | "member";
export type SubscriptionTier = "free" | "pro" | "enterprise";
export type PlatformType = "shopify" | "woocommerce" | "bigcommerce" | "adobe_commerce" | "other";
export type ScanType = "public" | "connected";
export type ScanStatus = "pending" | "in_progress" | "completed" | "failed";
export type PriorityLevel = "low" | "medium" | "high" | "critical";
export type SeverityLevel = "low" | "medium" | "high" | "critical";
export type RecoveryStatus = "unaddressed" | "in_progress" | "recovered" | "dismissed";
export type ImplementationStatus = "not_started" | "in_progress" | "completed" | "dismissed";
export type RecoveryPlanTaskStatus = "pending" | "in_progress" | "completed";
export type IntegrationProvider =
  "shopify" | "google_analytics" | "google_search_console" | "meta_ads" | "klaviyo";
export type IntegrationStatus = "disconnected" | "connected" | "error";
export type NotificationType =
  "scan_complete" | "revenue_leak_detected" | "recovery_progress" | "platform_update" | "alert";

export interface AuditColumns {
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
  deleted_at: string | null;
}

export interface AuditColumnsInsert {
  created_at?: string;
  updated_at?: string;
  created_by: string;
  version?: number;
  deleted_at?: string | null;
}

export interface AuditColumnsUpdate {
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  version?: number;
  deleted_at?: string | null;
}

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: MerchantRole;
          subscription_tier: SubscriptionTier;
          preferences: Json;
        } & AuditColumns;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: MerchantRole;
          subscription_tier?: SubscriptionTier;
          preferences?: Json;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: MerchantRole;
          subscription_tier?: SubscriptionTier;
          preferences?: Json;
        } & AuditColumnsUpdate;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          billing_email: string | null;
        } & AuditColumns;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          billing_email?: string | null;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          owner_id?: string;
          billing_email?: string | null;
        } & AuditColumnsUpdate;
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          merchant_id: string;
          role: MerchantRole;
        } & AuditColumns;
        Insert: {
          id?: string;
          organization_id: string;
          merchant_id: string;
          role?: MerchantRole;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          organization_id?: string;
          merchant_id?: string;
          role?: MerchantRole;
        } & AuditColumnsUpdate;
      };
      stores: {
        Row: {
          id: string;
          organization_id: string;
          merchant_id: string;
          name: string;
          domain: string;
          platform_type: PlatformType;
          industry: string | null;
          shopify_connected: boolean;
        } & AuditColumns;
        Insert: {
          id?: string;
          organization_id: string;
          merchant_id: string;
          name: string;
          domain: string;
          platform_type?: PlatformType;
          industry?: string | null;
          shopify_connected?: boolean;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          organization_id?: string;
          merchant_id?: string;
          name?: string;
          domain?: string;
          platform_type?: PlatformType;
          industry?: string | null;
          shopify_connected?: boolean;
        } & AuditColumnsUpdate;
      };
      revenue_scans: {
        Row: {
          id: string;
          store_id: string;
          scan_type: ScanType;
          status: ScanStatus;
          started_at: string | null;
          completed_at: string | null;
          confidence: number | null;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          scan_type?: ScanType;
          status?: ScanStatus;
          started_at?: string | null;
          completed_at?: string | null;
          confidence?: number | null;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          scan_type?: ScanType;
          status?: ScanStatus;
          started_at?: string | null;
          completed_at?: string | null;
          confidence?: number | null;
        } & AuditColumnsUpdate;
      };
      revenue_reports: {
        Row: {
          id: string;
          store_id: string;
          scan_id: string;
          revenue_estimate_low: number | null;
          revenue_estimate_high: number | null;
          recovery_priority: PriorityLevel | null;
          snapshot: Json;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          scan_id: string;
          revenue_estimate_low?: number | null;
          revenue_estimate_high?: number | null;
          recovery_priority?: PriorityLevel | null;
          snapshot?: Json;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          scan_id?: string;
          revenue_estimate_low?: number | null;
          revenue_estimate_high?: number | null;
          recovery_priority?: PriorityLevel | null;
          snapshot?: Json;
        } & AuditColumnsUpdate;
      };
      revenue_health: {
        Row: {
          id: string;
          store_id: string;
          overall_score: number | null;
          category_scores: Json;
          confidence: number | null;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          overall_score?: number | null;
          category_scores?: Json;
          confidence?: number | null;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          overall_score?: number | null;
          category_scores?: Json;
          confidence?: number | null;
        } & AuditColumnsUpdate;
      };
      revenue_leaks: {
        Row: {
          id: string;
          store_id: string;
          revenue_report_id: string | null;
          leak_catalog_id: string;
          category: string;
          severity: SeverityLevel;
          evidence: Json;
          estimated_revenue_loss_low: number | null;
          estimated_revenue_loss_high: number | null;
          confidence: number | null;
          recovery_status: RecoveryStatus;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          revenue_report_id?: string | null;
          leak_catalog_id: string;
          category: string;
          severity: SeverityLevel;
          evidence?: Json;
          estimated_revenue_loss_low?: number | null;
          estimated_revenue_loss_high?: number | null;
          confidence?: number | null;
          recovery_status?: RecoveryStatus;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          revenue_report_id?: string | null;
          leak_catalog_id?: string;
          category?: string;
          severity?: SeverityLevel;
          evidence?: Json;
          estimated_revenue_loss_low?: number | null;
          estimated_revenue_loss_high?: number | null;
          confidence?: number | null;
          recovery_status?: RecoveryStatus;
        } & AuditColumnsUpdate;
      };
      recommendations: {
        Row: {
          id: string;
          store_id: string;
          revenue_leak_id: string | null;
          recommendation_type: string;
          business_context: string | null;
          priority: PriorityLevel;
          expected_outcome: string | null;
          supporting_evidence: Json;
          implementation_status: ImplementationStatus;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          revenue_leak_id?: string | null;
          recommendation_type: string;
          business_context?: string | null;
          priority?: PriorityLevel;
          expected_outcome?: string | null;
          supporting_evidence?: Json;
          implementation_status?: ImplementationStatus;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          revenue_leak_id?: string | null;
          recommendation_type?: string;
          business_context?: string | null;
          priority?: PriorityLevel;
          expected_outcome?: string | null;
          supporting_evidence?: Json;
          implementation_status?: ImplementationStatus;
        } & AuditColumnsUpdate;
      };
      recovery_plans: {
        Row: {
          id: string;
          store_id: string;
          recommendation_id: string | null;
          priority: PriorityLevel;
          estimated_impact: number | null;
          progress: number;
          verified: boolean;
          completed_at: string | null;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          recommendation_id?: string | null;
          priority?: PriorityLevel;
          estimated_impact?: number | null;
          progress?: number;
          verified?: boolean;
          completed_at?: string | null;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          recommendation_id?: string | null;
          priority?: PriorityLevel;
          estimated_impact?: number | null;
          progress?: number;
          verified?: boolean;
          completed_at?: string | null;
        } & AuditColumnsUpdate;
      };
      recovery_plan_tasks: {
        Row: {
          id: string;
          recovery_plan_id: string;
          title: string;
          description: string | null;
          status: RecoveryPlanTaskStatus;
          sort_order: number;
        } & AuditColumns;
        Insert: {
          id?: string;
          recovery_plan_id: string;
          title: string;
          description?: string | null;
          status?: RecoveryPlanTaskStatus;
          sort_order?: number;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          recovery_plan_id?: string;
          title?: string;
          description?: string | null;
          status?: RecoveryPlanTaskStatus;
          sort_order?: number;
        } & AuditColumnsUpdate;
      };
      integrations: {
        Row: {
          id: string;
          store_id: string;
          provider: IntegrationProvider;
          status: IntegrationStatus;
          connected_at: string | null;
          metadata: Json;
        } & AuditColumns;
        Insert: {
          id?: string;
          store_id: string;
          provider: IntegrationProvider;
          status?: IntegrationStatus;
          connected_at?: string | null;
          metadata?: Json;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          store_id?: string;
          provider?: IntegrationProvider;
          status?: IntegrationStatus;
          connected_at?: string | null;
          metadata?: Json;
        } & AuditColumnsUpdate;
      };
      notifications: {
        Row: {
          id: string;
          merchant_id: string;
          type: NotificationType;
          title: string;
          message: string;
          read_at: string | null;
          metadata: Json;
        } & AuditColumns;
        Insert: {
          id?: string;
          merchant_id: string;
          type: NotificationType;
          title: string;
          message: string;
          read_at?: string | null;
          metadata?: Json;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          merchant_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string;
          read_at?: string | null;
          metadata?: Json;
        } & AuditColumnsUpdate;
      };
      ai_sessions: {
        Row: {
          id: string;
          merchant_id: string;
          store_id: string | null;
          engine_name: string | null;
          prompt_version: string | null;
          business_context: Json;
          reasoning_metadata: Json;
          confidence: number | null;
          generated_outputs: Json;
          audit_reference: string | null;
        } & AuditColumns;
        Insert: {
          id?: string;
          merchant_id: string;
          store_id?: string | null;
          engine_name?: string | null;
          prompt_version?: string | null;
          business_context?: Json;
          reasoning_metadata?: Json;
          confidence?: number | null;
          generated_outputs?: Json;
          audit_reference?: string | null;
        } & AuditColumnsInsert;
        Update: {
          id?: string;
          merchant_id?: string;
          store_id?: string | null;
          engine_name?: string | null;
          prompt_version?: string | null;
          business_context?: Json;
          reasoning_metadata?: Json;
          confidence?: number | null;
          generated_outputs?: Json;
          audit_reference?: string | null;
        } & AuditColumnsUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_organization_member: {
        Args: { target_organization_id: string };
        Returns: boolean;
      };
      is_store_accessible: {
        Args: { target_store_id: string };
        Returns: boolean;
      };
      is_recovery_plan_accessible: {
        Args: { target_recovery_plan_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
};
