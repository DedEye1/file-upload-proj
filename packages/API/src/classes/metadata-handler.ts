import fs from 'fs/promises';

import MetadataDTO from '../dto/metadata-dto';
import pd from './program-data'

/**
 * Класс обработки файла files.json
 */
export default class MetadataHandler {
  private static metadataArr: MetadataDTO[];

  /**
   * Автоматически добавляет метаданные в files.json
   */
  public static async append(metadata: MetadataDTO) {
    await this.loadFromDisk();
    this.metadataArr.push(metadata);
    await this.saveToDisk();
  }

  /**
   * Автоматически удаляет метаданные из files.json по id
   */
  public static async deleteByID(id: string): Promise<boolean> {
    await this.loadFromDisk();
    const index: number = this.metadataArr.findIndex(val => val.id === id);
    if (index === -1) return false;
    this.metadataArr.splice(index, 1);
    await this.saveToDisk();
    return true;
  }

  /**
   * Получает загруженный массив метаданных
   */
  public static async getMetadataArr(): Promise<MetadataDTO[]> {
    await this.loadFromDisk();
    return this.metadataArr;
  }

  /**
   * Получает метаданные по ID из загруженного массива
   */
  public static async getMetadataByID(id: string): Promise<MetadataDTO | undefined> {
    await this.loadFromDisk();
    return this.metadataArr.find((val, ind, obj) => val.id === id);
  }

  /**
   * Загружает с диска массив метаданных в поле metadataArr
   */
  private static async loadFromDisk() {
    try {
      const metadataStr: string = (await fs.readFile(pd.dataPath)).toString();
      this.metadataArr = JSON.parse(metadataStr);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.log('Отсутствует files.json');
      } else if (err instanceof SyntaxError) {
        console.log('Ошибка парсинга files.json');
      }
      this.metadataArr = [];
    }
  }

  /**
   * Сохраняет на диск массив метеданных в файл files.json, создаёт папку data/ при необходимости
   */
  private static async saveToDisk() {
    await fs.mkdir(pd.dataDir, { recursive: true });
    const data: string = JSON.stringify(this.metadataArr, null, 2);
    await fs.writeFile(pd.dataPath, data);
  }
}