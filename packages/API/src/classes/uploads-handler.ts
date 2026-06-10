import multer, { type FileFilterCallback, type Multer, type StorageEngine } from 'multer';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { v4 } from 'uuid';

import pd from './program-data'

/**
 * Класс настройки multer
 */
export default class UploadsHandler {
  private static storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(pd.uploadsDir, { recursive: true });

      cb(null, pd.uploadsDir);
    },
    filename: (req, file, cb) => {
      const ext: string = path.extname(file.originalname);
      const name: string = v4();

      cb(null, name + ext);
    }
  });

  /**
   * Поле для вызова функций multer
   */
  public static readonly uploader: Multer = multer({
    storage: this.storage,
    limits: {
      fileSize: 5 * 1024 ** 2
    },
    fileFilter: (req, file, cb: FileFilterCallback) => {
      if (pd.allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('INVALID_MIME') as any, false);
      }
    }
  });

  /**
   * Функция для удаления файла с диска
   */
  public static async deleteFile(fileName: string) {
    fileName = path.parse(fileName).base // Защита, если будет введён полный путь к файлу  
    await fsp.rm(path.join(pd.uploadsDir, fileName), { force: true })
  }
}