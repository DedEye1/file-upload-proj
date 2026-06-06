import type { Response, Request, NextFunction } from 'express';
import sc from 'http-status-codes';
import path from 'path';

import type Metadata from '../dto/metadata-dto.js';
import err_dto from '../dto/error-dto.js'
import mh from '../classes/metadata-handler.js';

/**
 * Класс-контроллер запросов к файлам
 * Реализует CRUD - Create, Read, Update (однако как таковой отсутствует), Delete операции
 */
export default class FilesController {
  /**
   * Враппер multer
   */
  public postFilesWrapper(uploader: (req: Request, res: Response, next: NextFunction) => void) {
    return async (req: Request, res: Response, next: NextFunction) => {
      uploader(req, res, async (err) => {
        await this.validateMulter(req, res, err);
      });
    };
  }
  /**
   * Функция валидации файла, обработанным multer
   */
  private async validateMulter(req: Request, res: Response, err: any) {
    // Файл, полученный от multer
    const file: Express.Multer.File | undefined = req.file;

    let errDTO: err_dto = new err_dto();
    // Обработка ошибок внутри multer
    if (err) {
      if (err.message === 'INVALID_MIME') {
        errDTO = { error: 'Неправильный тип файла', code: err.message };
      } else if (err.code === 'LIMIT_FILE_SIZE') {
        errDTO = { error: 'Файл слишком большой', code: 'FILE_TOO_LARGE' };
      } else {
        errDTO = { error: 'Неизвестная ошибка', code: 'UNKNOWN_ERR' };
      }
      console.log(`Ошибка ${errDTO.code}`);
      res.status(sc.StatusCodes.BAD_REQUEST).json(errDTO);
      // Проверка на отсутствие файла
    } else if (!file) {
      errDTO = { error: 'Файл не был предоставлен', code: 'FILE_REQUIRED' };
      console.log('Ошибка FILE_REQUIRED');
      res.status(sc.StatusCodes.BAD_REQUEST).json(errDTO);
      // Создание и запись метаданных в files.json
    } else {
      const dataDTO: Metadata = {
        id: path.parse(file.filename).name,
        originalName: file.originalname,
        storedName: file.filename,
        mime: file.mimetype,
        size: file.size,
        createdAt: new Date().toISOString()
      }

      console.log(`Принят файл ${dataDTO.originalName}`);
      await mh.append(dataDTO);
      res.status(sc.StatusCodes.CREATED).json(dataDTO);
    }
  }

  public getFilesByID(req: Request, res: Response) {
    const id = req.params.id;
  }

  public getFilesQuery(req: Request, res: Response) {
    const page = req.query.page;
    const limit = req.query.limit;
  }

  public deleteFilesByID(req: Request, res: Response) {
    const id = req.params.id;
  }
}