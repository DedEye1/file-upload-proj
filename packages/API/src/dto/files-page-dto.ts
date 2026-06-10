import MetadataDTO from './metadata-dto'

/**
 * Класс передачи страниц метаданных
 */
export default class FilesPageDTO {
  public items: MetadataDTO[];
  public page: number;
  public limit: number;
  public total: number;

  public constructor();
  public constructor(items: MetadataDTO[], page: number, limit: number, total: number);

  public constructor(items?: MetadataDTO[], page?: number, limit?: number, total?: number) {
    this.items = items ?? [];
    this.page = page ?? 1;
    this.limit = limit ?? 10;
    this.total = total ?? 0;
  }
}