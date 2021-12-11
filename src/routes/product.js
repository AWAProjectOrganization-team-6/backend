import { Router as _router } from 'express';
import { v4 } from 'uuid';
import { authenticateJwt } from '../middleware/authenticate';
import { createProductJsonValidator, modifyProductJsonValidator, specialOfferJsonValidator } from '../middleware/productMiddleware';
import { upload } from '../middleware/upload';
import { model } from '../models/productModel';
import { model as restauratnModel } from '../models/restaurantModel';
import { cloudinary } from '../cloudinary';

const router = _router();

// Product routes \/
/**
 * Get all product in the database.
 */
router.get('/', async (req, res) => {
    const products = await model.getProducts();
    res.send(products);
});

/**
 * Create new product/s for restaurant.
 */
router.post('/', authenticateJwt, createProductJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (req.body.length === 0) return res.status(400).send('Bad request: Empty array');
    const [restaurant] = await restauratnModel.getRestaurant(req.body[0].restaurant_id);
    if (!restaurant) return res.status(404).send('Not found: Retaurant was not found in database');
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    try {
        const newProducts = await model.createProduct(req.body);
        res.json(newProducts);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

/**
 * Add images to products
 * @link https://github.com/AWAProjectOrganization-team-6/backend/wiki/Product#upload-product-images
 */
router.post('/upload', authenticateJwt, upload.array('productImages'), async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const restaurantId = parseInt(req.body.restaurant, 10);

    if (user.type === 'USER') return res.sendStatus(403);
    if (!req.files) return res.sendStatus(400);
    if (restaurantId != req.body.restaurant) return res.sendStatus(400);

    console.log(req.files);
    const results = [];

    for (const file of req.files) {
        let fileId = file.originalname
            .split('.')
            .filter((_, index, arr) => index !== arr.length - 1)
            .join('.');

        fileId += '_' + v4().split('-')[0];

        const request = model.setProductImage(req.body.restaurant, { picture: fileId }, file.originalname);
        request.then((res) => {
            // eslint-disable-next-line camelcase
            if (res.count !== 0) cloudinary.uploader.upload(file.path, { public_id: fileId }).then((res) => console.log(res));
        });
        results.push(request);
    }

    const ret = (await Promise.all(results)).flat();
    console.log(ret);
    res.json(ret);
});

/**
 * Modify restaurants product/s.
 */
router.patch('/', authenticateJwt, modifyProductJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    const [restaurant] = await restauratnModel.getRestaurant(req.body.restaurant);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    try {
        const result = [];
        for (const edit in req.body.products) {
            /** @type {import('../@types/productModel').modifyProduct} */
            const product = req.body.products[edit];
            const id = product.product_id;
            delete product.product_id;
            result.push(model.modifyProduct(restaurant.restaurant_id, id, product));
        }
        res.json((await Promise.all(result)).flat());
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

/**
 * Delete product/s from restaurant.
 */
router.patch('/delete', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (typeof req.body.restaurant !== 'number') return res.sendStatus(400);
    if (!Array.isArray(req.body.products) || !req.body.products.every((val) => typeof val === 'number')) return res.sendStatus(400);

    const [restaurant] = await restauratnModel.getRestaurant(req.body.restaurant);
    if (!restaurant) return res.sendStatus(404);
    if (restaurant.user_id !== user.user_id) return res.sendStatus(403);

    const result = await model.deleteProduct(restaurant.restaurant_id, req.body.products);
    res.json(result);
});

// Speical offer routes \/
/**
 * Get all special offers
 */
router.get('/special-offers', async (req, res) => {
    const specialOffers = await model.getSpecialOffers();
    res.json(specialOffers);
});

/**
 * Create special offer entry.
 */
router.post('/special-offers', authenticateJwt, specialOfferJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type === 'USER') return res.sendStatus(403);

    try {
        const [specialOffer] = await model.createSpecialOffer(req.body);
        res.json(specialOffer);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

/**
 * Modify sepcial offer entry.
 */
router.put('/special-offers/:id', authenticateJwt, specialOfferJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type === 'USER') return res.sendStatus(403);

    const id = parseInt(req.params.id, 10);
    if (id != req.params.id) return res.sendStatus(400);

    try {
        const [edit] = await model.modifySpecialOffer(id, req.body);
        res.json(edit);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

/**
 * Delete special offer entry.
 */
router.delete('/special-offers/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type === 'USER') return res.sendStatus(403);

    const id = parseInt(req.params.id, 10);
    if (id != req.params.id) return res.sendStatus(400);

    const [result] = await model.deleteSpecialOffer(id);
    res.json(result);
});

export default router;
