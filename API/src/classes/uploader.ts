import multer, { type FileFilterCallback, type Multer, type StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';

import pd from './program-data.js'

/**
 * Класс настройки multer
 */
export default class Uploader {
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

  public static uploader: Multer = multer({
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
}