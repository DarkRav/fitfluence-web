import { configureOpenApiClient, toApiResult, type ApiResult } from "@/api/httpClient";
import {
  AthleteTrainingService,
  MeService,
  ProfilesService,
  PublicProgramsService,
  type MeResponse,
  type PagedProgramResponse,
  type ProgramsSearchRequest,
  type WorkoutSearchRequest,
} from "@/api/gen";

configureOpenApiClient();

export const api = {
  me: {
    async get(): Promise<ApiResult<MeResponse>> {
      return toApiResult(MeService.meGet());
    },
  },
  programs: {
    async featured(): Promise<ApiResult<PagedProgramResponse>> {
      return toApiResult(PublicProgramsService.publicProgramsFeaturedGet({}));
    },
    async search(request?: ProgramsSearchRequest) {
      return toApiResult(PublicProgramsService.programsPublishedSearch({ requestBody: request }));
    },
  },
  workouts: {
    async search(request: WorkoutSearchRequest) {
      return toApiResult(
        AthleteTrainingService.athleteWorkoutsSearchPost({ requestBody: request }),
      );
    },
  },
  profiles: {
    athleteGet() {
      return toApiResult(ProfilesService.athleteProfileGet());
    },
  },
};

export type { ApiResult };
export type { ErrorResponse } from "@/api/gen";
export * from "@/api/gen";
