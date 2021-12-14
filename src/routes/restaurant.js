import { Router as _router } from 'express';
import { authenticateJwt } from '../middleware/authenticate';
import {
    createOpHoursJsonValidator,
    createRestaurantJsonValidator,
    modifyOpHoursJsonValidator,
    modifyRestaurantJsonValidator,
} from '../middleware/restaurantMiddleware';
import { model } from '../models/restaurantModel';
import { model as menuModel } from '../models/productModel';
import { upload } from '../middleware/upload';
import multer from 'multer';
import { cloudinary } from '../cloudinary';
import { v4 } from 'uuid';

const router = _router();

// TODO: Add more comments

// Restaurant routes \/
router.get('/:id/menu', async (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);

    if (restaurantId != req.params.id) return res.sendStatus(400);

    const menu = await menuModel.getProductsOfRestaurant(req.params.id);
    res.json(menu);
});

router.get('/', async (req, res) => {
    const restaurants = await model.getRestaurants();
    res.json(restaurants);
});

router.get('/search', async (req, res) => {
    console.log(req.query);

    /** @type {string[]} */
    const search = req.query.search.toLowerCase().split(' ');
    try {
        const restaurants = await model.getRestaurants();
        const ret = restaurants.filter((val) =>
            search.some(
                (searchString) =>
                    val.name.toLowerCase().includes(searchString) ||
                    val.address.toLowerCase().includes(searchString) ||
                    val.type.toLowerCase().includes(searchString)
            )
        );

        res.json(ret);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

router.post('/', authenticateJwt, createRestaurantJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    /** @type {import('../@types/restaurantModel').createRestaurantInfo} */
    const restaurant = req.body;
    if (user.type === 'USER') return res.sendStatus(403);

    try {
        // eslint-disable-next-line camelcase
        restaurant.user_id = user.user_id;
        const [newRestaurant] = await model.createRestaurant(restaurant);
        res.json(newRestaurant);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

router.post('/rate', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type !== 'USER') return res.sendStatus(403);
    if (typeof req.body.rating !== 'number') return res.sendStatus(400);
    if (typeof req.body.restaurant !== 'number') return res.sendStatus(400);

    try {
        // eslint-disable-next-line camelcase
        const [restaurant] = await model.modifyRestaurant(req.body.restaurant, { star_rating: req.body.rating });
        res.json(restaurant);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

router.post(
    '/upload',
    authenticateJwt,
    upload.single('image'),

    /** @type {import('express').RequestHandler} */
    async (req, res) => {
        /** @type {import('../@types/userModel').user} */
        const user = req.user;
        const restaurantId = parseInt(req.body.restaurant, 10);

        if (user.type === 'USER') return res.sendStatus(403);
        if (!req.file) return res.sendStatus(400);
        if (restaurantId != req.body.restaurant) return res.sendStatus(400);

        let fileId = req.file.originalname
            .split('.')
            .filter((_, index, arr) => index !== arr.length - 1)
            .join('.');

        fileId += '_' + v4().split('-')[0];

        // eslint-disable-next-line camelcase
        cloudinary.uploader.upload(req.file.path, { public_id: fileId }).then((res) => console.log(res));
        const [result] = await model.modifyRestaurant(req.body.restaurant, { picture: fileId });

        console.log(req.file);
        res.json(result);
    },
    multerError
);

/** @type {import('express').ErrorRequestHandler} */
function multerError(err, req, res, next) {
    if (res.headersSent) {
        next(err);
    }

    if (!(err instanceof multer.MulterError)) return next(err);
    console.error(err);
    if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).send('Too many images provided');
    next(err);
}

router.put('/', authenticateJwt, modifyRestaurantJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    let [restaurant] = await model.getRestaurant(req.body.restaurant);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    try {
        [restaurant] = await model.modifyRestaurant(req.body.restaurant, req.body.info);
        res.json(restaurant);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

router.delete('/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const restaurantId = parseInt(req.params.id, 10);

    if (restaurantId != req.params.id) return res.sendStatus(400);
    let [restaurant] = await model.getRestaurant(req.params.id);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id /* && user.type !== 'SUPER'*/) return res.sendStatus(403);

    [restaurant] = await model.deleteRestaurant(req.params.id);
    res.json(restaurant);
});

// Operating hours rotes \/
router.get('/:id/operating-hours', async (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);
    if (restaurantId != req.params.id) return res.sendStatus(400);

    const operatingHours = await model.getOpearatingHours(restaurantId);
    res.json(operatingHours);
});

router.post('/operating-hours', authenticateJwt, createOpHoursJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (req.body.length === 0) return res.status(400).send('Bad request: Empty array');
    const [restaurant] = await model.getRestaurant(req.body[0].restaurant_id);
    if (!restaurant) return res.status(404).send('Not found: Retaurant was not found in database');
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    try {
        const ret = await model.createOperatingHours(req.body);
        res.json(ret);
    } catch (err) {
        console.log(err);
        res.send(400).json(err.message);
    }
});

router.patch('/operating-hours', authenticateJwt, modifyOpHoursJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    const [restaurant] = await model.getRestaurant(req.body.restaurant);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    try {
        const result = [];

        for (const edit in req.body.operating_hours) {
            /** @type {import('../@types/restaurantModel').modifyOperatingHoursInfo} */
            const opHour = req.body.operating_hours[edit];
            const id = opHour.operating_hours_id;
            delete opHour.operating_hours_id;
            result.push(model.modifyOperatingHours(restaurant.restaurant_id, id, opHour));
        }
        res.json((await Promise.all(result)).flat());
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

router.patch('/operating-hours/delete', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (typeof req.body.restaurant !== 'number') return res.sendStatus(400);
    if (!Array.isArray(req.body.operating_hours) || !req.body.operating_hours.every((val) => typeof val === 'number')) return res.sendStatus(400);

    const [restaurant] = await model.getRestaurant(req.body.restaurant);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    var result = await model.deleteOperatingHours(restaurant.restaurant_id, req.body.operating_hours);
    res.json(result);
});

export default router;
