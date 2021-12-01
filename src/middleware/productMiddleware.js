import Ajv from 'ajv';
import createProductSchema from './schemas/product/CreateProduct.schema.json';
import modifyProductSchema from './schemas/product/ModifyProduct.schema.json';
import specialOfferSchema from './schemas/product/CreateModifySpecialOffer.schema.json';

const ajv = new Ajv();

const createProductValidator = ajv.compile(createProductSchema);
const modifyProductValidator = ajv.compile(modifyProductSchema);
const specialOfferValidator = ajv.compile(specialOfferSchema);

/**
 * @type {import('express').RequestHandler}
 */
export const createProductJsonValidator = (req, res, next) => {
    const validationResult = createProductValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/**
 * @type {import('express').RequestHandler}
 */
export const modifyProductJsonValidator = (req, res, next) => {
    const validationResult = modifyProductValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/**
 * @type {import('express').RequestHandler}
 */
export const specialOfferJsonValidator = (req, res, next) => {
    const validationResult = specialOfferValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};
