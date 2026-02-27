import type { ApiResult } from "@/api/httpClient";
import type {
  AdminProgramRecord,
  AdminProgramsPageResult,
  AdminProgramsSearchParams,
  CreateAdminProgramPayload,
  UpdateAdminProgramPayload,
} from "@/api/adminPrograms";
import type {
  AdminProgramVersionRecord,
  AdminProgramVersionsPageResult,
  AdminProgramVersionsSearchParams,
} from "@/api/adminProgramVersions";
import type {
  CreateInfluencerProgramPayload,
  InfluencerProgramRecord,
  InfluencerProgramsPageResult,
  InfluencerProgramsSearchParams,
  UpdateInfluencerProgramPayload,
} from "@/api/influencerPrograms";

export type ProgramsScope = "admin" | "influencer";

export type ProgramRecord = InfluencerProgramRecord | AdminProgramRecord;
export type ProgramsPageResult = InfluencerProgramsPageResult | AdminProgramsPageResult;

export type ProgramVersionRecord = AdminProgramVersionRecord;
export type ProgramVersionsPageResult = AdminProgramVersionsPageResult;

export type ProgramSearchParams = InfluencerProgramsSearchParams | AdminProgramsSearchParams;
export type ProgramCreatePayload = CreateInfluencerProgramPayload | CreateAdminProgramPayload;
export type ProgramUpdatePayload = UpdateInfluencerProgramPayload | UpdateAdminProgramPayload;

export type ProgramVersionSearchParams = AdminProgramVersionsSearchParams;

export type ProgramsScopeConfig = {
  scope: ProgramsScope;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  createButtonLabel: string;
  queryKeyPrefix: readonly [string, ProgramsScope];
  routes: {
    list: string;
    details: (programId: string) => string;
  };
  capabilities: {
    canCreate: boolean;
    canEdit: boolean;
    showOwner: boolean;
    showVersions: boolean;
    canPublish: boolean;
    enableStatusFilter: boolean;
  };
  api: {
    search: (params: ProgramSearchParams) => Promise<ApiResult<ProgramsPageResult>>;
    get: (programId: string) => Promise<ApiResult<ProgramRecord>>;
    update?: (
      programId: string,
      payload: ProgramUpdatePayload,
    ) => Promise<ApiResult<ProgramRecord>>;
    create?: (payload: ProgramCreatePayload) => Promise<ApiResult<ProgramRecord>>;
    searchVersions?: (
      params: ProgramVersionSearchParams,
    ) => Promise<ApiResult<ProgramVersionsPageResult>>;
    publishVersion?: (programVersionId: string) => Promise<ApiResult<ProgramVersionRecord>>;
  };
};
