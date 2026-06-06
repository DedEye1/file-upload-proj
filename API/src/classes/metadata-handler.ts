import fs from 'fs/promises';

import type MetadataDTO from '../dto/metadata-dto.js';
import pd from './program-data.js'

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

  public static async getMetadataArr(): Promise<MetadataDTO[]> {
    await this.loadFromDisk();
    return this.metadataArr;
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