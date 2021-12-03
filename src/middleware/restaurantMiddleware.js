import Ajv from 'ajv';
import createModifyRestaurantSchema from './schemas/restaurant/CreateModifyRestaurant.schema.json';
import createOperatingHoursSchema from './schemas/restaurant/CreateOperatingHours.schema.json';
import modifyOperatingHoursSchema from './schemas/restaurant/ModifyOperatingHours.schema.json';

const ajv = new Ajv();

const restaurantInfoValidator = ajv.compile(createModifyRestaurantSchema);
const createOpHoursValidator = ajv.compile(createOperatingHoursSchema);
const modifyOpHoursValidator = ajv.compile(modifyOperatingHoursSchema);

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

/** @type {import('express').RequestHandler} */
export const createOpHoursJsonValidator = (req, res, next) => {
    const validationResult = createOpHoursValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

/** @type {import('express').RequestHandler} */
export const modifyOpHoursJsonValidator = (req, res, next) => {
    const validationResult = modifyOpHoursValidator(req.body);
    if (validationResult) return next();
    res.sendStatus(400);
};

// TODO: Comment this file
