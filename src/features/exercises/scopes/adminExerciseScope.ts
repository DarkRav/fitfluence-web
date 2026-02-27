import {
  createAdminExercise,
  deleteAdminExercise,
  searchAdminExercises,
  updateAdminExercise,
} from "@/api/adminExercises";
import { listEquipmentOptions, listMuscleOptions } from "@/api/referenceData";
import type { ExercisesCrudScopeConfig } from "@/features/exercises/types";

export const adminExerciseScope: ExercisesCrudScopeConfig = {
  scope: "admin",
  title: "Упражнения",
  subtitle: "Базовая библиотека упражнений, доступная для кастомных тренировок пользователей.",
  searchPlaceholder: "Поиск по названию или коду",
  createButtonLabel: "Создать упражнение",
  queryKeyPrefix: ["exercises", "admin"],
  api: {
    search: searchAdminExercises,
    create: createAdminExercise,
    update: updateAdminExercise,
    remove: deleteAdminExercise,
  },
  references: {
    loadMuscles: listMuscleOptions,
    loadEquipment: listEquipmentOptions,
  },
  messages: {
    created: "Упражнение создано.",
    updated: "Упражнение обновлено.",
    deleted: "Упражнение удалено из базовой библиотеки.",
  },
  deleteDialog: {
    title: "Архивировать упражнение",
    description: (item) => `Упражнение «${item.name}» будет удалено из базовой библиотеки.`,
  },
};
