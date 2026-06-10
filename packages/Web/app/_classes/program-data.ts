/**
 * Объединённый класс данных приложения
 */
export default class ProgramData {
  public static readonly apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';
}