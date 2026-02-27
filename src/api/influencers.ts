import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import { InfluencersService, type InfluencersSearchRequest } from "@/api/gen";

configureOpenApiClient();

export type InfluencerOption = {
  id: string;
  displayName: string;
};

export type SearchInfluencerOptionsParams = {
  search?: string;
  page?: number;
  size?: number;
};

function buildSearchRequest(params: SearchInfluencerOptionsParams): InfluencersSearchRequest {
  return {
    page: params.page ?? 0,
    size: params.size ?? 20,
    filter: {
      search: params.search?.trim() || undefined,
    },
  };
}

export async function searchInfluencerOptions(
  params: SearchInfluencerOptionsParams,
): Promise<ApiResult<InfluencerOption[]>> {
  const result = await toApiResult(
    InfluencersService.influencersSearchPost({
      requestBody: buildSearchRequest(params),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: (result.data.content ?? []).map((item) => ({
      id: item.id,
      displayName: item.displayName,
    })),
  };
}
