import type { Response, Request, NextFunction } from 'express';
import sc from 'http-status-codes';
import path from 'path';

import MetadataDTO from '../dto/metadata-dto.js';
import ErrorDTO from '../dto/error-dto.js';
import FilesPageDTO from '../dto/files-page-dto.js';
import err_dto from '../dto/error-dto.js'

import mh from '../classes/metadata-handler.js';
import uh from '../classes/uploads-handler.js';
import pd from '../classes/program-data.js';

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
      console.error(`Ошибка ${errDTO.code}`);
      res.status(sc.StatusCodes.BAD_REQUEST).json(errDTO);
      // Проверка на отсутствие файла
    } else if (!file) {
      errDTO = { error: 'Файл не был предоставлен', code: 'FILE_REQUIRED' };
      console.error(`Ошибка ${errDTO.code}`);
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

  /**
   * Функция для обработки GET по id
   */
  public async getFilesByID(req: Request, res: Response) {
    let id: string = req.params.id as string;
    id = path.parse(id ?? '').name; // Убрать расширение запроса, если таковое присутствует
    const metadata: MetadataDTO | undefined = await mh.getMetadataByID(id);
    let errDTO: ErrorDTO;

    // Проверка присутствия метаданных
    if (metadata) {
      const options = {
        root: process.cwd(),
        headers: {
          'Content-Type': metadata.mime
        }
      };

      res.sendFile(path.join(pd.uploadsDir, metadata.storedName), options, (err) => {
        if (err && !res.headersSent) {
          errDTO = { error: 'Неизвестная ошибка', code: 'UNKNOWN_ERR' };
          console.error(`Ошибка ${errDTO.code}`);
          res.status(sc.StatusCodes.BAD_REQUEST).json(errDTO);
        }
      });
    } else {
      errDTO = { error: 'Запись о файле отсутствует', code: 'NOT_FOUND' };
      console.error(`Ошибка ${errDTO.code}`);
      res.status(sc.StatusCodes.NOT_FOUND).json(errDTO);
    }
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

  /**
   * Функция для обработки DELETE по id
   */
  public async deleteFilesByID(req: Request, res: Response) {
    let id = req.params.id as string;
    id = path.parse(id ?? '').name; // Убрать расширение запроса, если таковое присутствует
    const metadata: MetadataDTO | undefined = await mh.getMetadataByID(id);
    // Проверка присутствия метаданных
    if (metadata) {
      await mh.deleteByID(metadata.id);
      await uh.deleteFile(metadata.storedName);
      console.log(`Удалён файл ${metadata.storedName}`);
      res.sendStatus(sc.StatusCodes.NO_CONTENT);
    } else {
      console.error(`Ошибка ${sc.StatusCodes.NOT_FOUND}`);
      res.sendStatus(sc.StatusCodes.NOT_FOUND);
    }
  }
}