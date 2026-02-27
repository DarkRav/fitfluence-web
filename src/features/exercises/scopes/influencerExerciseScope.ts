import {
  createInfluencerExercise,
  deleteInfluencerExercise,
  searchInfluencerExercises,
  updateInfluencerExercise,
} from "@/api/influencerExercises";
import {
  listInfluencerEquipmentOptions,
  listInfluencerMuscleOptions,
} from "@/api/influencerReferenceData";
import type { ExercisesCrudScopeConfig } from "@/features/exercises/types";

export const influencerExerciseScope: ExercisesCrudScopeConfig = {
  scope: "influencer",
  title: "Мои упражнения",
  subtitle: "Личная библиотека упражнений инфлюэнсера.",
  searchPlaceholder: "Поиск по названию или коду",
  createButtonLabel: "Создать упражнение",
  queryKeyPrefix: ["exercises", "influencer"],
  api: {
    search: searchInfluencerExercises,
    create: createInfluencerExercise,
    update: updateInfluencerExercise,
    remove: deleteInfluencerExercise,
  },
  references: {
    loadMuscles: listInfluencerMuscleOptions,
    loadEquipment: listInfluencerEquipmentOptions,
  },
  messages: {
    created: "Упражнение создано.",
    updated: "Упражнение обновлено.",
    deleted: "Упражнение удалено из вашей библиотеки.",
  },
  deleteDialog: {
    title: "Удалить упражнение",
    description: (item) => `Упражнение «${item.name}» будет удалено из вашей библиотеки.`,
  },
};
