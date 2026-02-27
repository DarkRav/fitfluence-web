/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Унифицированная модель ошибки API
 */
export type ErrorResponse = {
  /**
   * Время возникновения ошибки
   */
  timestamp: string;
  /**
   * HTTP статус-код ошибки
   */
  status: number;
  /**
   * Краткое описание ошибки
   */
  error: string;
  /**
   * Подробное сообщение об ошибке
   */
  message: string;
  /**
   * Путь запроса
   */
  path: string;
};
