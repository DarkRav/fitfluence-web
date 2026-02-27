import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  ProgressionPoliciesService,
  type CreateProgressionPolicyRequest,
  type ProgressionPoliciesSearchRequest,
  type ProgressionPolicy,
  type ProgressionPolicyOwnerType,
  type ProgressionPolicyStatus,
  type ProgressionPolicyType,
  type UpdateProgressionPolicyRequest,
} from "@/api/gen";

configureOpenApiClient();

const DEFAULT_PAGE_SIZE = 20;

export type AdminProgressionPolicyType = ProgressionPolicyType;
export type AdminProgressionPolicyStatus = ProgressionPolicyStatus;
export type AdminProgressionPolicyOwnerType = ProgressionPolicyOwnerType;

export type ProgressionPolicyRecord = {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: AdminProgressionPolicyType;
  params: Record<string, unknown>;
  status: AdminProgressionPolicyStatus;
  ownerType: AdminProgressionPolicyOwnerType;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProgressionPoliciesPageResult = {
  items: ProgressionPolicyRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminProgressionSearchParams = {
  page: number;
  size: number;
  search?: string;
  type?: AdminProgressionPolicyType;
  status?: AdminProgressionPolicyStatus;
  ownerType?: AdminProgressionPolicyOwnerType;
};

export type CreateAdminProgressionPolicyPayload = {
  code: string;
  name: string;
  description?: string;
  type: AdminProgressionPolicyType;
  params?: Record<string, unknown>;
  status?: AdminProgressionPolicyStatus;
  ownerType?: AdminProgressionPolicyOwnerType;
  ownerId?: string;
};

export type UpdateAdminProgressionPolicyPayload = {
  code?: string;
  name?: string;
  description?: string;
  type?: AdminProgressionPolicyType;
  params?: Record<string, unknown>;
  status?: AdminProgressionPolicyStatus;
};

function mapPolicy(item: ProgressionPolicy): ProgressionPolicyRecord {
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
  params: AdminProgressionSearchParams,
): ProgressionPoliciesSearchRequest {
  return {
    page: params.page,
    size: params.size || DEFAULT_PAGE_SIZE,
    filter: {
      search: params.search?.trim() || undefined,
      type: params.type,
      status: params.status,
      ownerType: params.ownerType,
    },
  };
}

function normalizeCreatePayload(
  payload: CreateAdminProgressionPolicyPayload,
): CreateProgressionPolicyRequest {
  return {
    code: payload.code.trim(),
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    type: payload.type,
    params: payload.params,
    status: payload.status,
    ownerType: payload.ownerType,
    ownerId: payload.ownerId?.trim() || undefined,
  };
}

function normalizeUpdatePayload(
  payload: UpdateAdminProgressionPolicyPayload,
): UpdateProgressionPolicyRequest {
  return {
    code: payload.code?.trim() || undefined,
    name: payload.name?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    type: payload.type,
    params: payload.params,
    status: payload.status,
  };
}

export async function searchAdminProgressionPolicies(
  params: AdminProgressionSearchParams,
): Promise<ApiResult<ProgressionPoliciesPageResult>> {
  const result = await toApiResult(
    ProgressionPoliciesService.adminProgressionPoliciesSearchPost({
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

export async function createAdminProgressionPolicy(
  payload: CreateAdminProgressionPolicyPayload,
): Promise<ApiResult<ProgressionPolicyRecord>> {
  const result = await toApiResult(
    ProgressionPoliciesService.adminProgressionPoliciesPost({
      requestBody: normalizeCreatePayload(payload),
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

export async function getAdminProgressionPolicy(
  id: string,
): Promise<ApiResult<ProgressionPolicyRecord>> {
  const result = await toApiResult(
    ProgressionPoliciesService.adminProgressionPoliciesIdGet({
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

export async function updateAdminProgressionPolicy(
  id: string,
  payload: UpdateAdminProgressionPolicyPayload,
): Promise<ApiResult<ProgressionPolicyRecord>> {
  const result = await toApiResult(
    ProgressionPoliciesService.adminProgressionPoliciesIdPatch({
      id,
      requestBody: normalizeUpdatePayload(payload),
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

export async function deleteAdminProgressionPolicy(id: string): Promise<ApiResult<void>> {
  const result = await toApiResult(
    ProgressionPoliciesService.adminProgressionPoliciesIdDelete({
      id,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: undefined,
  };
}
