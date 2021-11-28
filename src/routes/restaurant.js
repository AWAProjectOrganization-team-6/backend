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

const router = _router();

// Restaurant routes \/
router.get('/:id/menu', async (req, res) => {
    const menu = await menuModel.getProductsOfRestaurant(req.params.id);
    res.json(menu);
});

router.get('/', async (req, res) => {
    const restaurants = await model.getRestaurants();
    res.json(restaurants);
});

router.post('/', authenticateJwt, createRestaurantJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    /** @type {import('../@types/restaurantModel').createRestaurantInfo} */
    const restaurant = req.body;
    if (user.type === 'USER') return res.sendStatus(403);

    try {
        // eslint-disable-next-line
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

    // eslint-disable-next-line camelcase
    const [restaurant] = await model.modifyRestaurant(req.body.restaurant, { star_rating: req.body.rating });
    res.json(restaurant);
});

router.put('/', authenticateJwt, modifyRestaurantJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    let [restaurant] = await model.getRestaurant(req.body.restaurant);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    [restaurant] = await model.modifyRestaurant(req.body.restaurant, req.body.info);
    res.json(restaurant);
});

// TODO: Add json verification as json schema
router.delete('/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (req.params.id !== 'number') return res.sendStatus(400);
    let [restaurant] = await model.getRestaurant(req.params.id);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id /* && user.type !== 'SUPER'*/) return res.sendStatus(403);

    [restaurant] = await model.deleteRestaurant(req.params.id);
    res.json(restaurant);
});

// Operating hours rotes \/
router.get('/:id/operating-hours', async (req, res) => {
    if (typeof req.params.id !== 'number') return res.sendStatus(400);
    const operatingHours = await model.getOpearatingHours(req.params.id);
    res.json(operatingHours);
});

router.post('/operating-hours', authenticateJwt, createOpHoursJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    const [restaurant] = await model.getRestaurant(req.body[0].restaurant_id);
    if (!restaurant) return res.sendStatus(404);
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
        res.status(400).json(err);
    }
});

// TODO: Add json verification as json schema
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
