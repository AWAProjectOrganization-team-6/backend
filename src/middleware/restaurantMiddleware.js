import Ajv from 'ajv';
import createModifyRestaurantSchema from './schemas/CreateModifyRestaurant.schema.json';

const ajv = new Ajv();

const restaurantInfoValidator = ajv.compile(createModifyRestaurantSchema);

/**
 * @type {import('express').RequestHandler}
 */
export const createRestaurantJsonValidator = (req, res, next) => {
    const validationResult = restaurantInfoValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/**
 * @type {import('express').RequestHandler}
 */
export const modifyRestaurantJsonValidator = (req, res, next) => {
    const validationResult = restaurantInfoValidator(req.body.info);
    const idValidation = typeof req.body.restaurant === 'number';
    if (validationResult && idValidation) return next();
    res.sendStatus(400);
};
