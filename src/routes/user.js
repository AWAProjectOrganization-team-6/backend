import { Router as _router } from 'express';
import { createUserJsonValidator, modifyUserJsonValidator } from '../middleware/userMiddlewares';
import { authenticateBasic, authenticateJwt, getPaswordHash, getToken } from '../middleware/authenticate';
import { model } from '../models/userModel';

const router = _router();

/**
 * Get single user with jwt
 */
router.get('/', authenticateJwt, (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    delete user.password;
    res.status(200).json(user);
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
 * Get users addresses with jwt
 */
router.get('/address', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    var [addresses] = await model.getUserAddresses(user.user_id);
    res.status(200).json(addresses);
});

/**
 * Get users payment information with jwt
 */
router.get('/paymentInfo', async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    var paymentInfos = await model.getUserPaymentInfo(user.user_id);
    res.status(200).json(paymentInfos);
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
        res.json({ user: newUser, token: getToken(newUser) });
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

/**
 * Edit user information
 */
router.put('/', authenticateJwt, modifyUserJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    /** @type {import('../@types/userModel').modifyUserInfo} */
    const userInfo = req.body;
    userInfo.password = await getPaswordHash(userInfo.password);

    try {
        var [editedUser] = await model.modifyUser(user.user_id, userInfo);
        res.json(editedUser);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

export default router;
