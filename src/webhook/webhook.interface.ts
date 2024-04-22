import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { AxiosRequestConfig } from 'axios';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';

import { getLogger } from '../logging.service';
import { getClient } from '../workwave/auth.service';
import { tokenCollection } from '../workwave/token.repository';
import { validator } from '../validator';
import { Joi, Field } from './schema';
import { WebhookRequest, WebhookRequestBody, WebhookRequestBodySchema } from './webhook.request.dto';

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
        path: (tenantId: string, entityId: number) => `tenant_id=${tenantId}/${name}/${entityId}.${format}`,
        sourceUris: (tenantId: string) => `gs://${bucketName}/tenant_id=${tenantId}/${name}/*.${format}`,
        sourceUriPrefix: `gs://${bucketName}/{tenant_id:INT64}`,
    };

    const validationSchema = Joi.object<object>(Object.assign({}, ...fields.map((field) => field.validationSchema)));
    const tableSchema = fields.map((field) => field.tableSchema);

    const service = async ({ TenantId: tenantId, EntityId: entityId, EntityType: entityType }: WebhookRequestBody) => {
        const client = await getClient(tenantId);
        const file = bucket.file(storageConfig.path(tenantId, entityId));
        const record = await client
            .request(resolver(entityId))
            .then((response) => validationSchema.validateAsync(response.data));
        await file.save(JSON.stringify(record), { resumable: false });
        logger.info(`Tenant ID ${tenantId}: ${entityType} ${entityId} saved to ${file.name}`);
        return file.name;
    };

    const handler = ({ body }: ValidatedRequest<WebhookRequest>, res: Response, next: NextFunction) => {
        service(body)
            .then((results) => res.status(200).json({ results }))
            .catch(next);
    };

    const routes = [
        { path: `/${name.toLowerCase()}/upsert`, handlers: [validator.body(WebhookRequestBodySchema), handler] },
        { path: `/${name.toLowerCase()}/delete`, handlers: [validator.body(WebhookRequestBodySchema), handler] },
    ];

    const bootstrap = async () => {
        if (!(await dataset.exists().then(([result]) => result))) {
            await dataset.create();
        }

        const table = dataset.table(`${name}`);
        const tableName = `${table.dataset.id}.${table.id}`;

        if (await table.exists().then(([response]) => response)) {
            logger.debug(`Replacing table ${tableName}`);
            await table.delete();
        }

        const tenantIds = await tokenCollection
            .listDocuments()
            .then((docRefs) => docRefs.map((docRef) => <string>docRef.id));

        await table.create({
            schema: tableSchema,
            externalDataConfiguration: {
                sourceUris: tenantIds.map(storageConfig.sourceUris),
                sourceFormat: 'NEWLINE_DELIMITED_JSON',
                ignoreUnknownValues: true,
                hivePartitioningOptions: {
                    mode: 'CUSTOM',
                    sourceUriPrefix: storageConfig.sourceUriPrefix,
                },
            },
        });
        logger.debug(`Table ${tableName} created`);
    };

    return { service, routes, bootstrap };
};
