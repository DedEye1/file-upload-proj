import express, { type Application } from 'express';

import ul from './classes/uploader.js';
import file_control from './controllers/files-controller.js'
import pd from './classes/program-data.js'

const app: Application = express();
app.set('json spaces', 2);

const fc: file_control = new file_control();
app.post('/api/files', fc.postFilesWrapper(ul.uploader.single('file')));

app.get('/api/files', fc.getFilesQuery);

app.get('/api/files/:id', fc.getFilesByID);

app.delete('/api/files/:id', fc.deleteFilesByID);

app.listen(pd.port, () => console.log(`Запуск сервера на http://localhost:${pd.port}`));