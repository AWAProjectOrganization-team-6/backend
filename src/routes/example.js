import { Router as _router } from 'express';

const router = _router();

/**
 * Example route to demonstrate how to create routes for the API.
 */
router.get('/example', (req, res) => {
    res.status(200).send('<h1>Example route</h1>');
});

export default router;