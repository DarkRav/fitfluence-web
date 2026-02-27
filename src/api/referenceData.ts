import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import { EquipmentService, MusclesService, type Equipment, type Muscle } from "@/api/gen";

configureOpenApiClient();

const MAX_REFERENCE_ITEMS = 100;

export type ReferenceOption = {
  id: string;
  code: string;
  label: string;
};

function mapMuscleOption(item: Muscle): ReferenceOption {
  return {
    id: item.id,
    code: item.code,
    label: item.name,
  };
}

function mapEquipmentOption(item: Equipment): ReferenceOption {
  return {
    id: item.id,
    code: item.code,
    label: item.name,
  };
}

export async function listMuscleOptions(search = ""): Promise<ApiResult<ReferenceOption[]>> {
  const result = await toApiResult(
    MusclesService.musclesSearch({
      requestBody: {
        page: 0,
        size: MAX_REFERENCE_ITEMS,
        filter: search.trim()
          ? {
              search: search.trim(),
            }
          : undefined,
      },
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: (result.data.content ?? []).map(mapMuscleOption),
  };
}

export async function listEquipmentOptions(search = ""): Promise<ApiResult<ReferenceOption[]>> {
  const result = await toApiResult(
    EquipmentService.equipmentSearch({
      requestBody: {
        page: 0,
        size: MAX_REFERENCE_ITEMS,
        filter: search.trim()
          ? {
              search: search.trim(),
            }
          : undefined,
      },
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: (result.data.content ?? []).map(mapEquipmentOption),
  };
}
