import { Router as _router } from 'express';
import { createUserJsonValidator, modifyUserJsonValidator } from '../middleware/userMiddlewares';
import { model } from '../models/userModel';
import { authenticateBasic, authenticateJwt, getPaswordHash } from '../middleware/authenticate';

const router = _router();

/**
 * Get users addresses
 */
router.get('/address', authenticateJwt, async (req, res) => {
    console.log(req.user);
    var [addresses] = await model.getUserAddresses(req.user.user_id);
    res.status(200).json(addresses);
});

/**
 * Get users payment information
 */
router.get('/payment/:userId', async (req, res) => {
    var [userInfo] = await model.getUserPaymentInfo(req.params.userId);
    res.status(200).json(userInfo);
});

/**
 * Get all users from database
 */
router.get('/all', authenticateBasic, async (req, res) => {
    var dbResult = await model.getUsers();
    dbResult.forEach((user) => {
        user.password = user.password.toString();
    });
    res.status(200).json(dbResult);
});

/**
 * Get single user by id
 */
router.get('/', authenticateJwt, async (req, res) => {
    var [user] = await model.getUser(req.user.user_id);
    user.password = user.password.toString();
    res.status(200).json(user);
});

/**
 * Create new user
 */
router.post('/', createUserJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').createUserInfo} */
    const userInfo = req.body;
    userInfo.password = await getPaswordHash(userInfo.password);

    try {
        var [newUser] = await model.createUser(userInfo);
        newUser.password = newUser.password.toString();
        res.json({ user: newUser, token: sign({ userId: newUser.user_id }, 'Secret_key', { expiresIn: 600 }) });
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
});

/**
 * Edit user information
 */
router.put('/', authenticateJwt, modifyUserJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').modifyUserInfo} */
    const userInfo = req.body.user;
    userInfo.password = await getPaswordHash(userInfo.password);

    try {
        var [editedUser] = await model.modifyUser(req.body.userId, userInfo);
        res.json(editedUser);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
});

import { hash } from 'argon2';
import { sign } from 'jsonwebtoken';
router.get('/hash', async (req, res) => {
    const _hash = await hash(req.query.hash, { timeCost: 10, memoryCost: 2 ** 17, parallelism: 4 });
    res.json({ hash: _hash });
});

export default router;
