import { Router as _router } from 'express';
import { authenticateBasic, getToken } from '../middleware/authenticate';

const router = _router();

/**
 * User login route
 */
router.post('/', authenticateBasic, (req, res) => {
    /** @type {import('../@types/userModel').userCredentials} */
    const user = req.user;
    user.password = user.password.toString();

    console.log(user);
    const token = getToken(user);
    res.json({ token });
});

router.get('/failed', (req, res) => {
    res.status(401).send('Username or password incorrect');
});

export default router;
