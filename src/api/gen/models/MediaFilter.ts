/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentMediaType } from "./ContentMediaType";
import type { MediaOwnerType } from "./MediaOwnerType";
/**
 * Фильтр для поиска медиа
 */
export type MediaFilter = {
  type?: ContentMediaType;
  ownerType?: MediaOwnerType;
  ownerId?: string;
  search?: string;
  tags?: Array<string>;
};
