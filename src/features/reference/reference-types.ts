import type { ApiResult } from "@/api/httpClient";
import type { ReactNode } from "react";
import type { z } from "zod";

export type ReferenceListResult<TItem> = {
  items: TItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ReferenceColumn<TItem> = {
  key: string;
  label: string;
  render: (item: TItem) => ReactNode;
  className?: string;
};

type BaseField<TValues extends Record<string, string>> = {
  name: keyof TValues & string;
  label: string;
  placeholder?: string;
  disabledInEdit?: boolean;
};

export type ReferenceTextField<TValues extends Record<string, string>> = BaseField<TValues> & {
  type: "text" | "textarea";
};

export type ReferenceSelectField<TValues extends Record<string, string>> = BaseField<TValues> & {
  type: "select";
  options: Array<{
    label: string;
    value: string;
  }>;
};

export type ReferenceMediaField<TValues extends Record<string, string>> = BaseField<TValues> & {
  type: "media";
};

export type ReferenceFormField<TValues extends Record<string, string>> =
  | ReferenceTextField<TValues>
  | ReferenceSelectField<TValues>
  | ReferenceMediaField<TValues>;

export type ReferenceCrudConfig<
  TItem extends { id: string },
  TValues extends Record<string, string>,
> = {
  queryKey: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  createButtonLabel: string;
  createDialogTitle: string;
  editDialogTitle: string;
  deleteDialogTitle: string;
  deleteDialogDescription: (item: TItem) => string;
  columns: ReferenceColumn<TItem>[];
  schema: z.ZodTypeAny;
  fields: ReferenceFormField<TValues>[];
  createDefaultValues: () => TValues;
  mapItemToValues: (item: TItem) => TValues;
  search: (params: {
    page: number;
    size: number;
    search: string;
  }) => Promise<ApiResult<ReferenceListResult<TItem>>>;
  create: (values: TValues) => Promise<ApiResult<TItem>>;
  update: (id: string, values: TValues) => Promise<ApiResult<TItem>>;
  remove: (id: string) => Promise<ApiResult<void>>;
  getCreatedMessage: () => string;
  getUpdatedMessage: () => string;
  getDeletedMessage: () => string;
};
