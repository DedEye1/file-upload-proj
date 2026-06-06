import multer, { type FileFilterCallback, type Multer, type StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';

/**
 * Класс настройки multer
 */
export default class Uploader {
  private static readonly dist: string = 'uploads';
  private static readonly allowedMimes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  private static storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(this.dist, { recursive: true });

      cb(null, this.dist);
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
      if (this.allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('INVALID_MIME') as any, false);
      }
    }
  });
}