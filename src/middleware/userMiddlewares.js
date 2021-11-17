import Ajv from 'ajv';
import createUserSchema from './schemas/CreateUser.schema.json';
import modifyUserSchema from './schemas/ModifyUser.schema.json';

const ajv = new Ajv();

const createUserValidator = ajv.compile(createUserSchema);
const modifyUserValidator = ajv.compile(modifyUserSchema);

/** @type {import('express').RequestHandler} */
export const createUserJsonValidator = (req, res, next) => {
    const validationResult = createUserValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/** @type {import('express').RequestHandler} */
export const modifyUserJsonValidator = (req, res, next) => {
    const validationResult = modifyUserValidator(req.body.user);
    if (validationResult) return next();
    res.sendStatus(400);
};