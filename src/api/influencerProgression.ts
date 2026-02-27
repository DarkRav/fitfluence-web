import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProgressionPoliciesService,
  type ProgressionPoliciesSearchRequest,
  type ProgressionPolicy,
  type ProgressionPolicyStatus,
  type ProgressionPolicyType,
} from "@/api/gen";

configureOpenApiClient();

const DEFAULT_PAGE_SIZE = 20;

export type InfluencerProgressionPolicyType = ProgressionPolicyType;
export type InfluencerProgressionPolicyStatus = ProgressionPolicyStatus;

export type InfluencerProgressionPolicyRecord = {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: InfluencerProgressionPolicyType;
  params: Record<string, unknown>;
  status: InfluencerProgressionPolicyStatus;
  ownerType: "ADMIN" | "INFLUENCER";
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InfluencerProgressionPoliciesPageResult = {
  items: InfluencerProgressionPolicyRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type InfluencerProgressionSearchParams = {
  page: number;
  size: number;
  search?: string;
  type?: InfluencerProgressionPolicyType;
  status?: InfluencerProgressionPolicyStatus;
};

function mapPolicy(item: ProgressionPolicy): InfluencerProgressionPolicyRecord {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description,
    type: item.type,
    params: (item.params as Record<string, unknown>) ?? {},
    status: item.status,
    ownerType: item.ownerType,
    ownerId: item.ownerId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function buildSearchRequest(
  params: InfluencerProgressionSearchParams,
): ProgressionPoliciesSearchRequest {
  return {
    page: params.page,
    size: params.size || DEFAULT_PAGE_SIZE,
    filter: {
      search: params.search?.trim() || undefined,
      type: params.type,
      status: params.status,
    },
  };
}

export async function searchInfluencerProgressionPolicies(
  params: InfluencerProgressionSearchParams,
): Promise<ApiResult<InfluencerProgressionPoliciesPageResult>> {
  const result = await toApiResult(
    ProgressionPoliciesService.influencerProgressionPoliciesSearchPost({
      requestBody: buildSearchRequest(params),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: {
      items: (result.data.content ?? []).map(mapPolicy),
      page: result.data.metadata.page,
      size: result.data.metadata.size,
      totalElements: result.data.metadata.totalElements,
      totalPages: result.data.metadata.totalPages,
    },
  };
}

export async function getInfluencerProgressionPolicy(
  id: string,
): Promise<ApiResult<InfluencerProgressionPolicyRecord>> {
  const result = await toApiResult(
    ProgressionPoliciesService.influencerProgressionPoliciesIdGet({
      id,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapPolicy(result.data),
  };
}
