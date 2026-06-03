import type { Response, Request } from 'express'

export default class FilesController {
  public postFiles(req: Request, res: Response) {
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