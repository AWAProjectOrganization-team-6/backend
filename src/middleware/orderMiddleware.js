import Ajv from 'ajv';
import createOrderSchema from './schemas/order/CreateOrder.schema.json';
import modifyOrderSchema from './schemas/order/ModifyOrder.schema.json';

const ajv = new Ajv();

const createOrderValidator = ajv.compile(createOrderSchema);
const modifyOrderValidator = ajv.compile(modifyOrderSchema);

/** @type {import('express').RequestHandler} */
export const createOrderJsonValidator = (req, res, next) => {
    const validationResult = createOrderValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/** @type {import('express').RequestHandler} */
export const modifyOrderJsonValidator = (req, res, next) => {
    const validationResult = modifyOrderValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};
