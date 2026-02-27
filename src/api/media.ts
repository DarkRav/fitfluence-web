import { getApiAccessToken } from "@/api/auth-token";
import {
  configureOpenApiClient,
  normalizeApiError,
  toApiResult,
  type ApiResult,
} from "@/api/httpClient";
import {
  InfluencerCabinetService,
  MediaService,
  type ContentMediaType,
  type Media,
  type MediaSearchRequest,
} from "@/api/gen";

configureOpenApiClient();

export type MediaRole = "ADMIN" | "INFLUENCER";

export type MediaRecord = {
  id: string;
  type: ContentMediaType;
  url: string;
  mimeType?: string;
  tags: string[];
  createdAt?: string;
  owner?: string;
};

export type MediaPageResult = {
  items: MediaRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type MediaSearchParams = {
  search?: string;
  type?: ContentMediaType;
  tags?: string[];
  page?: number;
  size?: number;
};

export type UploadMediaOptions = {
  role: MediaRole;
  onProgress?: (percent: number) => void;
};

const DEFAULT_PAGE_SIZE = 20;

function resolveBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl && baseUrl.length > 0 ? baseUrl : "http://localhost:9876";
}

function resolveMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${resolveBaseUrl()}${normalizedPath}`;
}

function mapMedia(media: Media): MediaRecord {
  return {
    id: media.id,
    type: media.type,
    url: resolveMediaUrl(media.url),
    mimeType: media.mimeType,
    tags: media.tags ?? [],
    createdAt: media.createdAt,
  };
}

function mapMediaPage(result: {
  content?: Media[];
  metadata: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}): MediaPageResult {
  return {
    items: (result.content ?? []).map(mapMedia),
    page: result.metadata.page,
    size: result.metadata.size,
    totalElements: result.metadata.totalElements,
    totalPages: result.metadata.totalPages,
  };
}

function buildSearchRequest(params: MediaSearchParams): MediaSearchRequest {
  return {
    filter:
      params.search || params.type || (params.tags && params.tags.length > 0)
        ? {
            search: params.search,
            type: params.type,
            tags: params.tags,
          }
        : undefined,
    page: params.page ?? 0,
    size: params.size ?? DEFAULT_PAGE_SIZE,
  };
}

function inferMediaType(file: File): ContentMediaType {
  return file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
}

export async function searchAdminMedia(
  params: MediaSearchParams,
): Promise<ApiResult<MediaPageResult>> {
  const result = await toApiResult(
    MediaService.mediaSearch({
      requestBody: buildSearchRequest(params),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMediaPage(result.data),
  };
}

export async function searchInfluencerMedia(
  params: MediaSearchParams,
): Promise<ApiResult<MediaPageResult>> {
  const result = await toApiResult(
    InfluencerCabinetService.influencerMediaSearchPost({
      requestBody: buildSearchRequest(params),
    }),
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMediaPage(result.data),
  };
}

export async function uploadMedia(
  file: File,
  options: UploadMediaOptions,
): Promise<ApiResult<MediaRecord>> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", file);

    if (options.role === "ADMIN") {
      formData.append("type", inferMediaType(file));
      if (file.type) {
        formData.append("mimeType", file.type);
      }
    }

    const request = new XMLHttpRequest();
    request.open(
      "POST",
      options.role === "ADMIN"
        ? `${resolveBaseUrl()}/v1/admin/media`
        : `${resolveBaseUrl()}/v1/influencer/media`,
    );

    const token = getApiAccessToken();
    if (token) {
      request.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable || !options.onProgress) {
        return;
      }

      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      options.onProgress(percent);
    };

    request.onerror = () => {
      resolve({
        ok: false,
        error: normalizeApiError(new Error("Сетевая ошибка при загрузке файла")),
      });
    };

    request.onload = () => {
      const isSuccess = request.status >= 200 && request.status < 300;
      if (!isSuccess) {
        const message = request.statusText || "Ошибка загрузки";
        resolve({
          ok: false,
          error: normalizeApiError(new Error(message)),
        });
        return;
      }

      try {
        const parsed = JSON.parse(request.responseText) as Media;
        options.onProgress?.(100);
        resolve({
          ok: true,
          data: mapMedia(parsed),
        });
      } catch (error) {
        resolve({
          ok: false,
          error: normalizeApiError(error),
        });
      }
    };

    request.send(formData);
  });
}

export async function getMediaById(
  id: string,
  role: MediaRole = "ADMIN",
): Promise<ApiResult<MediaRecord>> {
  if (role === "INFLUENCER") {
    return {
      ok: false,
      error: {
        kind: "not_found",
        message: "Эндпоинт получения медиа по ID недоступен для роли INFLUENCER",
      },
    };
  }

  const result = await toApiResult(MediaService.mediaMediaIdGet({ mediaId: id }));
  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: mapMedia(result.data),
  };
}
