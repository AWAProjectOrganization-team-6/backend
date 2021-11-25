import { Router as _router } from 'express';
import { authenticateJwt } from '../middleware/authenticate';
import { createRestaurantJsonValidator, modifyRestaurantJsonValidator } from '../middleware/restaurantMiddleware';
import { model } from '../models/restaurantModel';
import { model as menuModel } from '../models/productModel';

const router = _router();

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
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    [restaurant] = await model.modifyRestaurant(req.body.restaurant, req.body.info);
    res.json(restaurant);
});

router.delete('/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    let [restaurant] = await model.getRestaurant(req.params.id);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id /* && user.type !== 'SUPER'*/) return res.sendStatus(403);

    [restaurant] = await model.deleteRestaurant(req.params.id);
    res.json(restaurant);
});

export default router;
