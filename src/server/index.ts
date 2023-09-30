import compression from 'compression';
import express, { Express } from 'express';
import path from 'path';

import apiRouter from './routes/api';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST: string = process.env.HOST || 'localhost';
const DATABASE_URL: string | undefined = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Environment variable for database was not set.');
}

const app: Express = express();

/* MIDDLEWARE */
app.use(express.json());
app.use(compression());

/* STATIC SERVER */
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.resolve(__dirname, './../client')));
}

/* ROUTES */
app.use('/api', apiRouter);

/* INIT SERVER */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, () => console.log(`Server listening on http://${HOST}:${PORT}`));
}

export default app;
