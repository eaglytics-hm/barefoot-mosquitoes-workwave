import { Express, Handler, NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { AxiosRequestConfig } from 'axios';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';

import { getLogger } from '../logging.service';
import { getClient } from '../workwave/auth.service';
import { validator } from '../validator';
import { Joi, Field } from './schema';
import {
    WebhookRequest,
    WebhookRequestBody,
    WebhookRequestBodySchema,
    WebhookRequestParamSchema,
} from './webhook.request.dto';
import { TenantEnum } from '../workwave/tenant.enum';

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
        path: (tenant: TenantEnum, id: number) => `tenant_id=${tenant}/${name}/${id}.${format}`,
        sourceUris: (tenant: TenantEnum) => [`gs://${bucketName}/tenant_id=${tenant}/${name}/*.${format}`],
    };

    const validationSchema = Joi.object<object>(Object.assign({}, ...fields.map((field) => field.validationSchema)));
    const tableSchema = fields.map((field) => field.tableSchema);

    const service = async (tenant: TenantEnum, { EntityId: id, EntityType: type }: WebhookRequestBody) => {
        const client = await getClient(tenant);
        const file = bucket.file(storageConfig.path(tenant, id));
        const record = await client
            .request(resolver(id))
            .then((response) => validationSchema.validateAsync(response.data));
        await file.save(JSON.stringify(record), { resumable: false });
        logger.info(`${type} - ${tenant} - ${id} saved to ${file.name}`);
        return file.name;
    };

    const handlers: Handler[] = [
        validator.params(WebhookRequestParamSchema),
        validator.body(WebhookRequestBodySchema),
        ({ params, body }: ValidatedRequest<WebhookRequest>, res, next) => {
            service(params.tenant, body)
                .then((results) => res.status(200).json({ results }))
                .catch(next);
        },
    ];

    const routes: { path: string; handlers: any }[] = [
        { path: `/${name.toLowerCase()}/upsert`, handlers },
        { path: `/${name.toLowerCase()}/delete`, handlers },
    ];

    const x = (app: Express) => {
        app.post(
            '/:tenant',
            validator.params(WebhookRequestParamSchema),
            validator.body(WebhookRequestBodySchema),
            ({ params, body }: ValidatedRequest<WebhookRequest>, res, next) => {
                service(params.tenant, body)
                    .then((results) => res.status(200).json({ results }))
                    .catch(next);
            },
        );
    };

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
