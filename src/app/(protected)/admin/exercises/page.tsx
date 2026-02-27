"use client";

import {
  createAdminExercise,
  deleteAdminExercise,
  searchAdminExercises,
  updateAdminExercise,
} from "@/api/adminExercises";
import { listEquipmentOptions, listMuscleOptions } from "@/api/referenceData";
import { ExercisesCrudPage } from "@/features/exercises";

export default function AdminExercisesPage() {
  return (
    <ExercisesCrudPage
      scope="admin"
      title="Exercises"
      subtitle="Базовая библиотека упражнений, доступная для кастомных тренировок пользователей."
      queryKey="adminExercises"
      searchPlaceholder="Поиск по названию или коду"
      createButtonLabel="Создать упражнение"
      api={{
        search: searchAdminExercises,
        create: createAdminExercise,
        update: updateAdminExercise,
        remove: deleteAdminExercise,
      }}
      references={{
        loadMuscles: listMuscleOptions,
        loadEquipment: listEquipmentOptions,
      }}
    />
  );
}
