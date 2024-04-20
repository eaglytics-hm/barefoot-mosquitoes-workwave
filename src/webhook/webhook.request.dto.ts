import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

import { TenantEnum } from '../workwave/tenant.enum';

export type WebhookRequestBody = {
    EntityType: string;
    EntityId: number;
    Url: string;
};

export type WebhookRequestParam = {
    tenant: TenantEnum;
};

export interface WebhookRequest extends ValidatedRequestSchema {
    [ContainerTypes.Params]: WebhookRequestParam;
    [ContainerTypes.Body]: WebhookRequestBody;
}

export const WebhookRequestParamSchema = Joi.object<WebhookRequestParam>({
    tenant: Joi.string().valid(...Object.values(TenantEnum)),
});

export const WebhookRequestBodySchema = Joi.object<WebhookRequestBody>({
    EntityType: Joi.string(),
    EntityId: Joi.number(),
    Url: Joi.string(),
});
