/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentMediaType } from "./ContentMediaType";
import type { MediaOwnerType } from "./MediaOwnerType";
/**
 * Медиа-файл (изображение или видео)
 */
export type Media = {
  id: string;
  type: ContentMediaType;
  url: string;
  mimeType?: string;
  tags?: Array<string>;
  createdAt?: string;
  readonly ownerType: MediaOwnerType;
  readonly ownerId: string;
  readonly ownerDisplayName?: string;
};
