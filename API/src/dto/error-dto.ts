/**
 * Класс передачи ошибок
 */
export default class ErrorDTO {
  public error: string;
  public code: string;

  public constructor();
  public constructor(error: string, code: string);

  public constructor(error?: string, code?: string) {
    this.error = error ?? '';
    this.code = code ?? '';
  }
}