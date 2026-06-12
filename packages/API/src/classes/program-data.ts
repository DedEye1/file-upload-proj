import dotenv from 'dotenv';
import path from 'path';

// Загрузка .env
dotenv.config();

/**
 * Объединённый класс данных приложения
 */
export default class ProgramData {
  public static readonly port = process.env.API_PORT ?? "4001";
  public static readonly uploadsDir = process.env.UPL_DIR ?? 'uploads';
  public static readonly dataDir = process.env.META_DIR ?? 'data';
  public static readonly dataFile = process.env.META_FILE ?? 'files.json';
  public static readonly dataPath = path.join(ProgramData.dataDir, ProgramData.dataFile);
  public static readonly allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
}