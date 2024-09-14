import { NextFunction, Response, Router } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { AxiosRequestConfig } from 'axios';
import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import Joi from 'joi';

import { getLogger } from '../logging.service';
import { streamWrite } from '../bigquery-storage.service';
import { getClient } from '../workwave/auth.service';
import { validator } from '../validator';
import { WebhookRequest, WebhookRequestBody, WebhookRequestBodySchema } from './webhook.request.dto';

const logger = getLogger(__filename);

const storageClient = new Storage();
const bucket = storageClient.bucket('barefoot-mosquitoes-workwave');

const bigqueryClient = new BigQuery();
const dataset = bigqueryClient.dataset('Workwave');

type CreateWebhookModelConfig = {
    name: string;
    resolver: (id: number) => AxiosRequestConfig;
    schema: Joi.Schema;
};

export const createWebhookModel = ({ name, resolver, schema }: CreateWebhookModelConfig) => {
    const service = async ({ TenantId: tenantId, EntityId: entityId, EntityType: entityType }: WebhookRequestBody) => {
        const client = await getClient(tenantId);
        const record = await client.request(resolver(entityId)).then((response) => response.data);

        const tasks = [];
        const file = bucket.file(`tenant_id=${tenantId}/${name}/${entityId}.json`);
        const fileSave = file.save(JSON.stringify(record), { resumable: false }).then(() => {
            logger.info(`Tenant ID ${tenantId}: ${entityType} ${entityId} saved to ${file.name}`);
            return file.name;
        });
        tasks.push(fileSave);

        const { error, value } = schema.validate(record, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: true,
        });
        if (error) {
            return await Promise.all(tasks);
        }
        const writeRow = streamWrite([{ ...value, tenant_id: tenantId, _CHANGE_TYPE: 'UPSERT' }], {
            datasetId: dataset.id!,
            tableId: name,
        });
        tasks.push(writeRow);
        return await Promise.all(tasks);
    };

    const router = Router().post(
        `/${name.toLowerCase()}`,
        validator.body(WebhookRequestBodySchema),
        ({ body }: ValidatedRequest<WebhookRequest>, res: Response, next: NextFunction) => {
            service(body)
                .then((results) => res.status(200).json({ results }))
                .catch(next);
        },
    );

    return { service, router };
};
