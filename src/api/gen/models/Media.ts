/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentMediaType } from "./ContentMediaType";
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
};
