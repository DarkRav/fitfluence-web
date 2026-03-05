import {
  addInfluencerWorkoutExercise,
  createInfluencerWorkoutTemplate,
  deleteInfluencerWorkoutExercise,
  deleteInfluencerWorkoutTemplate,
  getInfluencerWorkoutTemplate,
  reorderInfluencerWorkoutExercises,
  searchInfluencerWorkoutTemplates,
  updateInfluencerWorkoutExercise,
  updateInfluencerWorkoutTemplate,
} from "@/api/influencerWorkouts";
import { searchInfluencerExercises } from "@/api/influencerExercises";
import { searchInfluencerProgressionPolicies } from "@/api/influencerProgression";
import type { WorkoutsScopeConfig } from "@/features/workouts/types";

export const influencerWorkoutScope: WorkoutsScopeConfig = {
  scope: "influencer",
  queryKeys: {
    list: ["workouts", "influencer"],
    details: ["workout", "influencer"],
    addExercise: ["workout-add-exercise", "influencer"],
  },
  routes: {
    programDetails: (programId) => `/influencer/programs/${encodeURIComponent(programId)}`,
    workoutsList: (programId, programVersionId) =>
      `/influencer/programs/${encodeURIComponent(programId)}?tab=workouts&version=${encodeURIComponent(programVersionId)}`,
    workoutDetails: (programId, programVersionId, workoutTemplateId) =>
      `/influencer/programs/${encodeURIComponent(programId)}/workouts/${encodeURIComponent(workoutTemplateId)}?version=${encodeURIComponent(programVersionId)}`,
  },
  api: {
    listWorkouts: searchInfluencerWorkoutTemplates,
    getWorkout: getInfluencerWorkoutTemplate,
    createWorkout: createInfluencerWorkoutTemplate,
    updateWorkout: updateInfluencerWorkoutTemplate,
    deleteWorkout: deleteInfluencerWorkoutTemplate,
    searchExercises: async (params) => {
      const result = await searchInfluencerExercises(params);
      if (!result.ok) {
        return result;
      }

      return {
        ok: true,
        data: {
          items: result.data.items.map((item) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            createdByInfluencerId: item.createdByInfluencerId,
          })),
        },
      };
    },
    searchProgressionPolicies: async (params) => {
      const result = await searchInfluencerProgressionPolicies({
        page: params.page,
        size: params.size,
        search: params.search,
        status: "ACTIVE",
      });
      if (!result.ok) {
        return result;
      }

      return {
        ok: true,
        data: {
          items: result.data.items.map((item) => ({
            id: item.id,
            name: item.name,
          })),
        },
      };
    },
    addExercise: addInfluencerWorkoutExercise,
    updateExercise: updateInfluencerWorkoutExercise,
    deleteExercise: deleteInfluencerWorkoutExercise,
    reorderExercises: reorderInfluencerWorkoutExercises,
  },
};
