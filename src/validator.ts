import { createValidator } from 'express-joi-validation';

export const validator = createValidator({ passError: true, joi: { stripUnknown: true } });
