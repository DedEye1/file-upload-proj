import fs from 'fs/promises';
import path from 'path';

import type MetadataDTO from '../dto/metadata-dto.js';

/**
 * Класс обработки файла files.json
 */
export default class MetadataHandler {
  private static metadataArr: MetadataDTO[];
  private static readonly dataDir: string = 'data';
  private static readonly dataFile: string = 'files.json';
  private static readonly dataPath: string = path.join(this.dataDir, this.dataFile);

  /**
   * Автоматически добавляет метаданные в files.json
   */
  public static async append(metadata: MetadataDTO) {
    await this.loadFromDisk();
    this.metadataArr.push(metadata);
    await this.saveToDisk();
  }

  /**
   * Загружает с диска массив метаданных в поле metadataArr
   */
  private static async loadFromDisk() {
    try {
      const metadataStr: string = (await fs.readFile(this.dataPath)).toString();
      this.metadataArr = JSON.parse(metadataStr);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.log('Создание нового files.json');
      } else if (err instanceof SyntaxError) {
        console.log('Ошибка парсинга files.json, будет создан новый');
      }
      this.metadataArr = [];
    }
  }

  /**
   * Сохраняет на диск массив метеданных в файл files.json, создаёт папку data/ при необходимости
   */
  private static async saveToDisk() {
    await fs.mkdir(this.dataDir, { recursive: true });
    const data: string = JSON.stringify(this.metadataArr, null, 2);
    await fs.writeFile(this.dataPath, data);
  }
}