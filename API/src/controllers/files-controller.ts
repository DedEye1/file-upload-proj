import type { Response, Request, NextFunction } from 'express';
import sc from 'http-status-codes';
import path from 'path';

import type MetadataDTO from '../dto/metadata-dto.js';
import err_dto from '../dto/error-dto.js'
import mh from '../classes/metadata-handler.js';
import type FilesPageDTO from '../dto/files-page-dto.js';

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
      const dataDTO: MetadataDTO = {
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

  /**
   * Функция для обработки GET с query
   */
  public async getFilesQuery(req: Request, res: Response) {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const offset: number = (page - 1) * limit;

    const metadataArr: MetadataDTO[] = await mh.getMetadataArr();
    const items: MetadataDTO[] = metadataArr.slice(offset, offset + limit);

    const fpDTO: FilesPageDTO = {
      items: items,
      page: page,
      limit: limit,
      total: metadataArr.length
    }

    res.status(sc.StatusCodes.OK).json(fpDTO);
  }

  public deleteFilesByID(req: Request, res: Response) {
    const id = req.params.id;
  }
}