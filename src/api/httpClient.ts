import { ApiError } from "@/api/gen/core/ApiError";
import { OpenAPI } from "@/api/gen/core/OpenAPI";
import type { ErrorResponse } from "@/api/gen/models/ErrorResponse";
import { getApiAccessToken } from "@/api/auth-token";

export type ApiErrorKind =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "server";

export type NormalizedApiError = {
  kind: ApiErrorKind;
  status?: number;
  message: string;
  details?: ErrorResponse;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: NormalizedApiError;
    };

const resolveBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl && baseUrl.length > 0 ? baseUrl : "http://localhost:9876";
};

export function configureOpenApiClient(): void {
  OpenAPI.BASE = resolveBaseUrl();
  OpenAPI.TOKEN = async () => getApiAccessToken() ?? "";
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof ApiError) {
    const details = error.body as ErrorResponse | undefined;
    const status = error.status;

    if (status === 401) {
      return {
        kind: "unauthorized",
        status,
        message: details?.message ?? "Необходима авторизация",
        details,
      };
    }

    if (status === 403) {
      return {
        kind: "forbidden",
        status,
        message: details?.message ?? "Недостаточно прав",
        details,
      };
    }

    if (status === 404) {
      return {
        kind: "not_found",
        status,
        message: details?.message ?? "Ресурс не найден",
        details,
      };
    }

    if (status >= 400 && status < 500) {
      return {
        kind: "validation",
        status,
        message: details?.message ?? "Некорректный запрос",
        details,
      };
    }

    return { kind: "server", status, message: details?.message ?? "Ошибка сервера", details };
  }

  if (error instanceof Error) {
    return { kind: "network", message: error.message };
  }

  return { kind: "network", message: "Неизвестная ошибка сети" };
}

export async function toApiResult<T>(request: Promise<T>): Promise<ApiResult<T>> {
  try {
    const data = await request;
    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeApiError(error),
    };
  }
}
