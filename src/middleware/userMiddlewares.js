import Ajv from 'ajv';
import createUserSchema from './schemas/user/CreateUser.schema.json';
import modifyUserSchema from './schemas/user/ModifyUser.schema.json';
import createPaymentInfoSchema from './schemas/user/CreatePaymentInfo.schema.json';

const ajv = new Ajv();

const createUserValidator = ajv.compile(createUserSchema);
const modifyUserValidator = ajv.compile(modifyUserSchema);
const createPaymentInfoValidator = ajv.compile(createPaymentInfoSchema);

/**
 * Validator for validating user creation json.
 * @type {import('express').RequestHandler}
 */
export const createUserJsonValidator = (req, res, next) => {
    const validationResult = createUserValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/**
 * Validator for validating user mofication json.
 * @type {import('express').RequestHandler}
 */
export const modifyUserJsonValidator = (req, res, next) => {
    const validationResult = modifyUserValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/**
 * Validator for validating user mofication json.
 * @type {import('express').RequestHandler}
 */
export const createPaymentInfoJsonValidator = (req, res, next) => {
    const validationResult = createPaymentInfoValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};
