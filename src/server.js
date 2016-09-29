import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import winston from 'winston';

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

/* Wintson logger into the console */
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
});

const server = app.listen(3001, () => {
  logger.info('Listening at http://localhost:%s 🔥', 3001);
  logger.info('ENV = ',process.env.NODE_ENV);
});
