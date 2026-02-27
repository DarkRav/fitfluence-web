"use client";

import { z } from "zod";
import {
  createMuscle,
  deleteMuscle,
  searchMuscles,
  updateMuscle,
  type MuscleGroupValue,
  type MuscleRecord,
} from "@/api/muscles";
import { ReferenceCrudPage, type ReferenceCrudConfig } from "@/features/reference";

type MuscleFormValues = {
  code: string;
  name: string;
  muscleGroup: string;
  description: string;
};

const NO_MUSCLE_GROUP_VALUE = "__NONE__";

const MUSCLE_GROUP_OPTIONS: Array<{ value: MuscleGroupValue; label: string }> = [
  { value: "BACK", label: "Спина" },
  { value: "CHEST", label: "Грудь" },
  { value: "LEGS", label: "Ноги" },
  { value: "SHOULDERS", label: "Плечи" },
  { value: "ARMS", label: "Руки" },
  { value: "ABS", label: "Пресс" },
];

const muscleGroupSchema = z.union([
  z.literal(NO_MUSCLE_GROUP_VALUE),
  z.enum(["BACK", "CHEST", "LEGS", "SHOULDERS", "ARMS", "ABS"]),
]);

const muscleFormSchema = z.object({
  code: z.string().trim().min(1, "Укажите код"),
  name: z.string().trim().min(1, "Укажите название"),
  muscleGroup: muscleGroupSchema,
  description: z.string(),
});

function toMuscleGroupValue(value: string): MuscleGroupValue | undefined {
  return MUSCLE_GROUP_OPTIONS.some((option) => option.value === value)
    ? (value as MuscleGroupValue)
    : undefined;
}

function renderGroup(value?: MuscleGroupValue): string {
  return MUSCLE_GROUP_OPTIONS.find((option) => option.value === value)?.label ?? "-";
}

const musclesConfig: ReferenceCrudConfig<MuscleRecord, MuscleFormValues> = {
  queryKey: "muscles",
  title: "Справочник мышц",
  subtitle: "Создание, редактирование и удаление мышечных групп.",
  searchPlaceholder: "Поиск по коду, названию или описанию",
  createButtonLabel: "Создать мышцу",
  createDialogTitle: "Создание мышцы",
  editDialogTitle: "Редактирование мышцы",
  deleteDialogTitle: "Удалить мышцу",
  deleteDialogDescription: (item) =>
    `Мышца «${item.name}» будет удалена без возможности восстановления.`,
  columns: [
    {
      key: "code",
      label: "Код",
      className: "font-mono text-xs",
      render: (item) => item.code,
    },
    {
      key: "name",
      label: "Название",
      render: (item) => item.name,
    },
    {
      key: "group",
      label: "Группа",
      render: (item) => renderGroup(item.muscleGroup),
    },
    {
      key: "description",
      label: "Описание",
      className: "max-w-[320px] truncate",
      render: (item) => item.description || "-",
    },
    {
      key: "media",
      label: "Медиа",
      className: "text-right",
      render: (item) => item.mediaCount,
    },
  ],
  schema: muscleFormSchema,
  fields: [
    {
      type: "text",
      name: "code",
      label: "Код",
      placeholder: "Например, latissimus-dorsi",
      disabledInEdit: true,
    },
    {
      type: "text",
      name: "name",
      label: "Название",
      placeholder: "Широчайшая мышца спины",
    },
    {
      type: "select",
      name: "muscleGroup",
      label: "Группа",
      placeholder: "Выберите группу",
      options: [
        { value: NO_MUSCLE_GROUP_VALUE, label: "Не выбрано" },
        ...MUSCLE_GROUP_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      ],
    },
    {
      type: "textarea",
      name: "description",
      label: "Описание",
      placeholder: "Краткое описание мышцы",
    },
  ],
  createDefaultValues: () => ({
    code: "",
    name: "",
    muscleGroup: NO_MUSCLE_GROUP_VALUE,
    description: "",
  }),
  mapItemToValues: (item) => ({
    code: item.code,
    name: item.name,
    muscleGroup: item.muscleGroup ?? NO_MUSCLE_GROUP_VALUE,
    description: item.description ?? "",
  }),
  search: ({ page, size, search }) => searchMuscles({ page, size, search }),
  create: (values) =>
    createMuscle({
      code: values.code,
      name: values.name,
      muscleGroup: toMuscleGroupValue(values.muscleGroup),
      description: values.description || undefined,
    }),
  update: (id, values) =>
    updateMuscle(id, {
      name: values.name,
      muscleGroup: toMuscleGroupValue(values.muscleGroup),
      description: values.description || undefined,
    }),
  remove: (id) => deleteMuscle(id),
  getCreatedMessage: () => "Мышца успешно создана.",
  getUpdatedMessage: () => "Изменения сохранены.",
  getDeletedMessage: () => "Мышца удалена.",
};

export function MusclesReferencePage() {
  return <ReferenceCrudPage config={musclesConfig} />;
}
