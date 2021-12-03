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

export default router;
