/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentMediaType } from "./ContentMediaType";
/**
 * Фильтр для поиска медиа
 */
export type MediaFilter = {
  type?: ContentMediaType;
  search?: string;
  tags?: Array<string>;
};
