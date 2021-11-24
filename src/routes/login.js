import { Router as _router } from 'express';
import { sign } from 'jsonwebtoken';
import { authenticateBasic } from '../middleware/authenticate';

const router = _router();

/**
 * User login route
 */
router.post('/', authenticateBasic, (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    user.password = user.password.toString();
    console.log(user);
    const token = sign({ userId: req.user.user_id }, 'Secret_key', { expiresIn: 600 });
    res.json({ token });
});

export default router;
