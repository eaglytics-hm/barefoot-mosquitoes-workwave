import JoiDefault, { Schema } from 'joi';
import { TableField } from '@google-cloud/bigquery';

export const Joi = JoiDefault.defaults((schema) => schema.empty('').allow(null).options({ abortEarly: false }));

type FieldType = { validationSchema: Schema; tableSchema: string };

export type Field = {
    validationSchema: { [key: string]: Schema };
    tableSchema: TableField;
};

abstract class BaseField implements Field {
    name: string;
    fieldType: FieldType;
    array: boolean;

    constructor(name: string, fieldType: FieldType, array = false) {
        this.name = name;
        this.fieldType = fieldType;
        this.array = array;
    }

    get validationSchema() {
        return {
            [this.name]: this.array
                ? Joi.array().items(this.fieldType.validationSchema).sparse(true)
                : this.fieldType.validationSchema,
        };
    }
    get tableSchema() {
        return { name: this.name, type: this.fieldType.tableSchema, mode: this.array ? 'REPEATED' : 'NULLABLE' };
    }
}

export class BooleanField extends BaseField implements Field {
    constructor(name: string, array = false) {
        super(name, { validationSchema: Joi.boolean(), tableSchema: 'BOOLEAN' }, array);
    }
}

export class StringField extends BaseField implements Field {
    constructor(name: string, array = false) {
        super(name, { validationSchema: Joi.string(), tableSchema: 'STRING' }, array);
    }
}

export class Int64Field extends BaseField implements Field {
    constructor(name: string, array = false) {
        super(name, { validationSchema: Joi.number(), tableSchema: 'INT64' }, array);
    }
}

export class NumericField extends BaseField implements Field {
    constructor(name: string, array = false) {
        super(name, { validationSchema: Joi.number(), tableSchema: 'NUMERIC' }, array);
    }
}

export class DateTimeField extends BaseField implements Field {
    constructor(name: string, array = false) {
        super(
            name,
            {
                validationSchema: Joi.custom((value: string | undefined) => {
                    return value ? value : null;
                }),
                tableSchema: 'TIMESTAMP',
            },
            array,
        );
    }
}

export class RecordField implements Field {
    name: string;
    fields: Field[];
    array: boolean;

    constructor(name: string, fields: Field[], array = false) {
        this.name = name;
        this.fields = fields;
        this.array = array;
    }

    get validationSchema() {
        const recordSchema = Joi.object(Object.assign({}, ...this.fields.map((field) => field.validationSchema)));
        return {
            [this.name]: this.array ? Joi.array().items(recordSchema) : recordSchema,
        };
    }
    get tableSchema() {
        return {
            name: this.name,
            type: 'RECORD',
            mode: this.array ? 'REPEATED' : 'NULLABLE',
            fields: this.fields.map((field) => field.tableSchema),
        };
    }
}
