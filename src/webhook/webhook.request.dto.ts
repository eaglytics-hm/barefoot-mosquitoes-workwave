import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export type WebhookRequestBody = {
    EntityType: string;
    EntityId: number;
    Url: string;
    TenantId: string;
};

export interface WebhookRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: WebhookRequestBody;
}

export const WebhookRequestBodySchema = Joi.object<WebhookRequestBody>({
    EntityType: Joi.string(),
    EntityId: Joi.number(),
    Url: Joi.string(),
    TenantId: Joi.string(),
});
