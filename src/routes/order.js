import { Router as _router } from 'express';
import { model } from '../models/orederModel';
import { model as restaurantModel } from '../models/restaurantModel';
import { authenticateJwt } from '../middleware/authenticate';
import { createOrderJsonValidator } from '../middleware/orderMiddleware';

const router = _router();

/**
 * Get users orders and products of thous orders
 */
router.get('/@me', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type !== 'USER') return res.sendStatus(403);

    const orders = await model.getUserOrders(user.user_id);

    const tmp = [];

    for (const order of orders) {
        tmp.push(
            model.getOrderProducts(order.order_id).then((val) => {
                order.products = val;
            })
        );
    }

    await Promise.all(tmp);
    res.json(orders);
});

router.get('/restaurants/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const restaurantId = parseInt(req.params.id, 10);

    if (restaurantId != req.params.id) return res.status(400).send('Bad request: Bad id argument');
    const [restaurant] = await restaurantModel.getRestaurant(restaurantId);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    const orders = await model.getRestaurantOrders(restaurant.restaurant_id);
    const tmp = [];

    for (const order of orders) {
        tmp.push(
            model.getOrderProducts(order.order_id).then((val) => {
                order.products = val;
            })
        );
    }

    await Promise.all(tmp);
    res.json(orders);
});

router.post('/', authenticateJwt, createOrderJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type !== 'USER') res.sendStatus(403);

    /** @type {any[]} */
    const products = req.body.products;
    delete req.body.products;

    const [order] = await model.createOrder(req.body);

    for (let item of products) {
        // eslint-disable-next-line camelcase
        item = { order_id: order.order_id, product_id: item };
    }

    const orderProducts = await model.createOrderProduct(products);
    order.products = orderProducts;
    res.json(order);
});

router.patch('/updateStatus', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const orderId = req.body.orderId;

    if (user.type === 'USER') return res.sendStatus(403);
    const [order] = await model.getOrder(orderId);
    const [restaurant] = await restaurantModel.getRestaurant(order.restaurant_id);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    delete req.body.orderId;

    const [modifyedOrder] = await model.modifyOrder(order.order_id, req.body);
    res.json(modifyedOrder);
});

router.post('/received/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const orderId = parseInt(req.params.id, 10);

    if (user.type !== 'USER') return res.sendStatus(403);
    if (orderId !== req.params.id) return res.sendStatus(400);
    const [order] = await model.getOrder(orderId);
    if (order.user_id !== user.user_id) res.sendStatus(403);

    const [modifyedOrder] = await model.modifyOrder(order.order_id, { status: 'RECEIVED' });
    res.json(modifyedOrder);
});

router.delete('/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const orderId = parseInt(req.params.id, 10);

    if (user.type !== 'USER') res.sendStatus(403);
    if (orderId !== req.params.id) return res.sendStatus(400);
    const [order] = await model.getOrder(orderId);
    if (order.user_id !== user.user_id) return res.sendStatus(403);

    const [result] = await model.deleteOrder(order.order_id);
    res.json(result);
});

export default router;
