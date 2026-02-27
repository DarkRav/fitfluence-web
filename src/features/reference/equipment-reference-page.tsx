"use client";

import { z } from "zod";
import {
  createEquipment,
  deleteEquipment,
  searchEquipment,
  updateEquipment,
  type EquipmentCategoryValue,
  type EquipmentRecord,
} from "@/api/equipment";
import { ReferenceCrudPage, type ReferenceCrudConfig } from "@/features/reference";

type EquipmentFormValues = {
  code: string;
  name: string;
  category: string;
  mediaId: string;
};

const EQUIPMENT_CATEGORY_OPTIONS: Array<{ value: EquipmentCategoryValue; label: string }> = [
  { value: "FREE_WEIGHT", label: "Свободный вес" },
  { value: "MACHINE", label: "Тренажер" },
  { value: "BODYWEIGHT", label: "Вес тела" },
  { value: "BAND", label: "Эспандер" },
  { value: "CARDIO", label: "Кардио" },
];

const equipmentCategorySchema = z.enum(["FREE_WEIGHT", "MACHINE", "BODYWEIGHT", "BAND", "CARDIO"]);

const equipmentFormSchema = z.object({
  code: z.string().trim().min(1, "Укажите код"),
  name: z.string().trim().min(1, "Укажите название"),
  category: equipmentCategorySchema,
  mediaId: z.string(),
});

function renderCategory(value: EquipmentCategoryValue): string {
  return EQUIPMENT_CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

const equipmentConfig: ReferenceCrudConfig<EquipmentRecord, EquipmentFormValues> = {
  queryKey: "equipment",
  title: "Справочник оборудования",
  subtitle: "Управление инвентарем и категориями оборудования.",
  searchPlaceholder: "Поиск по названию",
  createButtonLabel: "Создать оборудование",
  createDialogTitle: "Создание оборудования",
  editDialogTitle: "Редактирование оборудования",
  deleteDialogTitle: "Удалить оборудование",
  deleteDialogDescription: (item) =>
    `Оборудование «${item.name}» будет удалено без возможности восстановления.`,
  columns: [
    {
      key: "name",
      label: "Название",
      render: (item) => item.name,
    },
    {
      key: "category",
      label: "Категория",
      render: (item) => renderCategory(item.category),
    },
    {
      key: "media",
      label: "Медиа",
      className: "text-right",
      render: (item) => item.mediaCount,
    },
  ],
  schema: equipmentFormSchema,
  fields: [
    {
      type: "text",
      name: "code",
      label: "Код",
      placeholder: "Например, kettlebell",
      disabledInEdit: true,
    },
    {
      type: "text",
      name: "name",
      label: "Название",
      placeholder: "Гиря",
    },
    {
      type: "select",
      name: "category",
      label: "Категория",
      placeholder: "Выберите категорию",
      options: EQUIPMENT_CATEGORY_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    },
    {
      type: "media",
      name: "mediaId",
      label: "Медиа",
    },
  ],
  createDefaultValues: () => ({
    code: "",
    name: "",
    category: "FREE_WEIGHT",
    mediaId: "",
  }),
  mapItemToValues: (item) => ({
    code: item.code,
    name: item.name,
    category: item.category,
    mediaId: item.mediaIds[0] ?? "",
  }),
  search: ({ page, size, search }) => searchEquipment({ page, size, search }),
  create: (values) =>
    createEquipment({
      code: values.code,
      name: values.name,
      category: values.category as EquipmentCategoryValue,
      mediaIds: values.mediaId ? [values.mediaId] : [],
    }),
  update: (id, values) =>
    updateEquipment(id, {
      name: values.name,
      category: values.category as EquipmentCategoryValue,
      mediaIds: values.mediaId ? [values.mediaId] : [],
    }),
  remove: (id) => deleteEquipment(id),
  getCreatedMessage: () => "Оборудование успешно создано.",
  getUpdatedMessage: () => "Изменения сохранены.",
  getDeletedMessage: () => "Оборудование удалено.",
};

export function EquipmentReferencePage() {
  return <ReferenceCrudPage config={equipmentConfig} />;
}
