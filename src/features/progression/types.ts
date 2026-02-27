import type { ApiResult } from "@/api/httpClient";
import type {
  AdminProgressionPolicyOwnerType,
  AdminProgressionPolicyStatus,
  AdminProgressionPolicyType,
  CreateAdminProgressionPolicyPayload,
  ProgressionPoliciesPageResult,
  ProgressionPolicyRecord,
  UpdateAdminProgressionPolicyPayload,
} from "@/api/adminProgression";
import type {
  InfluencerProgressionPoliciesPageResult,
  InfluencerProgressionPolicyRecord,
} from "@/api/influencerProgression";

export type ProgressionScope = "admin" | "influencer";

export type ProgressionRecord = ProgressionPolicyRecord | InfluencerProgressionPolicyRecord;
export type ProgressionPageResult =
  | ProgressionPoliciesPageResult
  | InfluencerProgressionPoliciesPageResult;

export type ProgressionSearchFilters = {
  type?: AdminProgressionPolicyType;
  status?: AdminProgressionPolicyStatus;
  ownerType?: AdminProgressionPolicyOwnerType;
};

export type ProgressionSearchInput = {
  page: number;
  size: number;
  search?: string;
  filters: ProgressionSearchFilters;
};

export type ProgressionFormPayload =
  | CreateAdminProgressionPolicyPayload
  | UpdateAdminProgressionPolicyPayload;

export type ProgressionScopeConfig = {
  scope: ProgressionScope;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  createButtonLabel: string;
  queryKeyPrefix: readonly ["progression", ProgressionScope];
  capabilities: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canFilterOwnerType: boolean;
    showOwnerColumns: boolean;
  };
  api: {
    search: (input: ProgressionSearchInput) => Promise<ApiResult<ProgressionPageResult>>;
    get: (id: string) => Promise<ApiResult<ProgressionRecord>>;
    create?: (
      payload: CreateAdminProgressionPolicyPayload,
    ) => Promise<ApiResult<ProgressionRecord>>;
    update?: (
      id: string,
      payload: UpdateAdminProgressionPolicyPayload,
    ) => Promise<ApiResult<ProgressionRecord>>;
    remove?: (id: string) => Promise<ApiResult<void>>;
  };
};
