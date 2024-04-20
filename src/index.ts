import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { isObject } from 'lodash';
import Joi from 'joi';

import { getLogger } from './logging.service';
import { Invoice } from './webhook/invoice/invoice';

const logger = getLogger(__filename);

const app = express();

app.use(bodyParser.json());

app.use(({ method, path, body }, res, next) => {
    logger.info({ method, path, body });
    res.once('finish', () => {
        logger.info({ method, path, body, status: res.statusCode });
    });
    next();
});

Invoice.routes.forEach(({ path, middlewares, handler }) => app.post(path, ...middlewares, handler));

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isObject(error) && 'error' in error && Joi.isError(error.error)) {
        logger.warn({ error: error.error });
        res.status(400).json({ error: error.error });
        return;
    }

    logger.error({ error });
    res.status(500).json({ error });
});

app.listen(8080);
