import { Handler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { AxiosRequestConfig } from 'axios';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';

import { getLogger } from '../logging.service';
import { getClient } from '../workwave/auth.service';
import { validator } from '../validator';
import { Joi, Field } from './schema';
import { WebhookRequest, WebhookRequestBody } from './webhook.request.dto';

const logger = getLogger(__filename);

const storageClient = new Storage();
const bucket = storageClient.bucket('barefoot-mosquitoes-workwave');

const bigqueryClient = new BigQuery();
const dataset = bigqueryClient.dataset('Workwave');

type CreateWebhookModelConfig = {
    name: string;
    resolver: (id: number) => AxiosRequestConfig;
    fields: Field[];
};

export const createWebhookModel = ({ name, resolver, fields }: CreateWebhookModelConfig) => {
    const bucketName = bucket.name;
    const format = 'json';
    const storageConfig = {
        path: (id: number) => `${name}/${id}.${format}`,
        sourceUris: [`gs://${bucketName}/${name}/*.${format}`],
    };

    const validationSchema = Joi.object<object>(Object.assign({}, ...fields.map((field) => field.validationSchema)));
    const tableSchema = fields.map((field) => field.tableSchema);

    const service = async ({ EntityId: id, EntityType: type }: WebhookRequestBody) => {
        const client = await getClient();
        const file = bucket.file(storageConfig.path(id));
        const record = await client
            .request(resolver(id))
            .then((response) => validationSchema.validateAsync(response.data));
        await file.save(JSON.stringify(record), { resumable: false });
        logger.info(`${type} - ${id} saved to ${file.name}`);
        return file.name;
    };

    const handlers: Handler[] = [
        validator.body(validationSchema),
        ({ body }: ValidatedRequest<WebhookRequest>, res, next) => {
            service(body)
                .then((results) => res.status(200).json({ results }))
                .catch(next);
        },
    ];

    const routes: { path: string; handlers: Handler[] }[] = [
        { path: `/${name.toLowerCase()}/upsert`, handlers },
        { path: `/${name.toLowerCase()}/delete`, handlers },
    ];

    const bootstrap = async () => {
        if (!(await dataset.exists().then(([result]) => result))) {
            await dataset.create();
        }

        const table = dataset.table(name);
        const tableName = `${table.dataset.id}.${table.id}`;

        if (await table.exists().then(([response]) => response)) {
            logger.debug(`Replacing table ${tableName}`);
            await table.delete();
        }

        await table.create({
            schema: tableSchema,
            externalDataConfiguration: {
                sourceUris: storageConfig.sourceUris,
                sourceFormat: 'NEWLINE_DELIMITED_JSON',
                ignoreUnknownValues: true,
            },
        });
        logger.debug(`Table ${tableName} created`);
    };

    return {
        path: `/${name.toLowerCase()}`,
        service,
        routes,
        bootstrap,
    };
};
