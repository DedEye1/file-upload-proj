/**
 * Класс передачи метаданных файла
 */
export default class MetadataDTO {
  public id: string;
  public originalName: string;
  public storedName: string;
  public mime: string;
  public size: number;
  public createdAt: string;

  public constructor();
  public constructor(id: string, originalName: string, storedName: string, mime: string, size: number, createdAt: string);

  public constructor(
    id?: string,
    originalName?: string,
    storedName?: string,
    mime?: string,
    size?: number,
    createdAt?: string
  ) {
    this.id = id ?? '';
    this.originalName = originalName ?? '';
    this.storedName = storedName ?? '';
    this.mime = mime ?? '';
    this.size = size ?? 0;
    this.createdAt = createdAt ?? '';
  }
}