import Ajv from 'ajv';
import createOrderSchema from './schemas/order/CreateOrder.schema.json';

const ajv = new Ajv();

const createOrderValidator = ajv.compile(createOrderSchema);

/** @type {import('express').RequestHandler} */
export const createOrderJsonValidator = (req, res, next) => {
    const validationResult = createOrderValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};
