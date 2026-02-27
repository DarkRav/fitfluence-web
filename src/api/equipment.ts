import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  EquipmentService,
  type CreateEquipmentRequest,
  type Equipment,
  type EquipmentCategory,
  type UpdateEquipmentRequest,
} from "@/api/gen";

configureOpenApiClient();

export type EquipmentRecord = {
  id: string;
  code: string;
  name: string;
  category: EquipmentCategory;
  mediaCount: number;
};

export type EquipmentCategoryValue = EquipmentCategory;

export type EquipmentPageResult = {
  items: EquipmentRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type EquipmentSearchParams = {
  search?: string;
  page?: number;
  size?: number;
};

export type CreateEquipmentPayload = {
  code: string;
  name: string;
  category: EquipmentCategory;
};

export type UpdateEquipmentPayload = {
  name?: string;
  category?: EquipmentCategory;
};

const DEFAULT_PAGE_SIZE = 20;

function mapEquipment(item: Equipment): EquipmentRecord {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    mediaCount: item.media?.length ?? 0,
  };
}

function normalizeCreatePayload(payload: CreateEquipmentPayload): CreateEquipmentRequest {
  return {
    code: payload.code.trim(),
    name: payload.name.trim(),
    category: payload.category,
  };
}

function normalizeUpdatePayload(payload: UpdateEquipmentPayload): UpdateEquipmentRequest {
  return {
    name: payload.name?.trim() || undefined,
    category: payload.category,
  };
}

export async function searchEquipment(
  params: EquipmentSearchParams,
): Promise<ApiResult<EquipmentPageResult>> {
  const result = await toApiResult(
    EquipmentService.equipmentSearch({
      requestBody: {
        filter: params.search?.trim()
          ? {
              search: params.search.trim(),
            }
          : undefined,
        page: params.page ?? 0,
        size: params.size ?? DEFAULT_PAGE_SIZE,
      },
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: {
      items: (result.data.content ?? []).map(mapEquipment),
      page: result.data.metadata.page,
      size: result.data.metadata.size,
      totalElements: result.data.metadata.totalElements,
      totalPages: result.data.metadata.totalPages,
    },
  };
}

export async function createEquipment(
  payload: CreateEquipmentPayload,
): Promise<ApiResult<EquipmentRecord>> {
  const result = await toApiResult(
    EquipmentService.equipmentPost({
      requestBody: normalizeCreatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapEquipment(result.data),
  };
}

export async function updateEquipment(
  id: string,
  payload: UpdateEquipmentPayload,
): Promise<ApiResult<EquipmentRecord>> {
  const result = await toApiResult(
    EquipmentService.equipmentEquipmentIdPatch({
      equipmentId: id,
      requestBody: normalizeUpdatePayload(payload),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapEquipment(result.data),
  };
}

export async function deleteEquipment(id: string): Promise<ApiResult<void>> {
  const result = await toApiResult(
    EquipmentService.equipmentEquipmentIdDelete({
      equipmentId: id,
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

export async function getEquipment(id: string): Promise<ApiResult<EquipmentRecord>> {
  const result = await toApiResult(
    EquipmentService.equipmentEquipmentIdGet({
      equipmentId: id,
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapEquipment(result.data),
  };
}
