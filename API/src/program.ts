import express from 'express';
import dotenv from 'dotenv';

import FilesController from './controllers/files-controller.js'

dotenv.config();
let port = process.env.API_PORT ?? "4000";

const app: express.Application = express();
let fc = new FilesController();

app.post('/api/files', fc.postFiles);

app.get('/api/files', fc.getFilesQuery);

app.get('/api/files/:id', fc.getFilesByID);

app.delete('/api/files/:id', fc.deleteFilesByID);

app.listen(port);