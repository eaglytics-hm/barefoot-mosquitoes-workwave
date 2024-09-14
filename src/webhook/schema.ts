import JoiDefault, { ArraySchema } from 'joi';
import { DateTime } from 'luxon';

export const Joi = JoiDefault.defaults((schema) => {
    if (schema.type === 'array') {
        return (<ArraySchema>schema).allow(null).sparse();
    }
    if (schema.type === 'object') {
        return schema.allow(null);
    }
    return schema.allow(null);
});

export const BooleanField = Joi.boolean();
export const Int64Field = Joi.number().integer();
export const NumericField = Joi.number();
export const StringField = Joi.string().empty('');
export const DateTimeField = Joi.custom((value) => {
    const parsed = DateTime.fromISO(value, { zone: 'UTC' });
    return parsed.isValid ? parsed.toMillis() * 1000 : null;
});
