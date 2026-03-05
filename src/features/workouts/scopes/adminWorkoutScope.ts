import {
  addExerciseToAdminWorkout,
  createAdminWorkout,
  deleteAdminWorkout,
  deleteAdminWorkoutExercise,
  getAdminWorkout,
  listAdminWorkouts,
  reorderAdminWorkoutExercises,
  updateAdminWorkout,
  updateAdminWorkoutExercise,
} from "@/api/adminWorkouts";
import { searchAdminExercises } from "@/api/adminExercises";
import { searchAdminProgressionPolicies } from "@/api/adminProgression";
import type { WorkoutsScopeConfig } from "@/features/workouts/types";

export const adminWorkoutScope: WorkoutsScopeConfig = {
  scope: "admin",
  queryKeys: {
    list: ["workouts", "admin"],
    details: ["workout", "admin"],
    addExercise: ["workout-add-exercise", "admin"],
  },
  routes: {
    programDetails: (programId) => `/admin/programs/${encodeURIComponent(programId)}`,
    workoutsList: (programId, programVersionId) =>
      `/admin/programs/${encodeURIComponent(programId)}?tab=workouts&version=${encodeURIComponent(programVersionId)}`,
    workoutDetails: (programId, programVersionId, workoutTemplateId) =>
      `/admin/programs/${encodeURIComponent(programId)}/workouts/${encodeURIComponent(workoutTemplateId)}?version=${encodeURIComponent(programVersionId)}`,
  },
  api: {
    listWorkouts: listAdminWorkouts,
    getWorkout: getAdminWorkout,
    createWorkout: createAdminWorkout,
    updateWorkout: updateAdminWorkout,
    deleteWorkout: deleteAdminWorkout,
    searchExercises: async (params) => {
      const result = await searchAdminExercises(params);
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
      const result = await searchAdminProgressionPolicies({
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
    addExercise: addExerciseToAdminWorkout,
    updateExercise: updateAdminWorkoutExercise,
    deleteExercise: deleteAdminWorkoutExercise,
    reorderExercises: reorderAdminWorkoutExercises,
  },
};
