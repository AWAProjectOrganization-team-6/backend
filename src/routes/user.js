import { Router as _router } from 'express';
import { createAddressJsonValidator, createPaymentInfoJsonValidator, createUserJsonValidator, modifyUserJsonValidator } from '../middleware/userMiddlewares';
import { authenticateBasic, authenticateJwt, getPaswordHash, getToken } from '../middleware/authenticate';
import { model } from '../models/userModel';

const router = _router();

// User route \/
/**
 * Get single user with jwt
 */
router.get('/@me', authenticateJwt, (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    delete user.password;
    res.json(user);
});

/**
 * Get all user's from database
 */
router.get('/all', authenticateBasic, async (req, res) => {
    /** @type {import('../@types/userModel').userCredentials} */
    const user = req.user;

    if (user.type !== 'SUPER') return res.sendStatus(403);

    var dbResult = await model.getUsers();
    dbResult.forEach((user) => {
        user.password = user.password.toString();
    });
    res.json(dbResult);
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
 * Edit current user's information
 */
router.put('/@me', authenticateJwt, modifyUserJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    if (user.type === 'SUPER') return res.sendStatus(403);

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

/**
 * Delete current user
 */
router.delete('/@me', authenticateJwt, (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    model.deleteUser(user.user_id);
    res.send('User account deleted');
});

// User address route \/
/**
 * Get user's addresses with jwt
 */
router.get('/@me/address', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    var [addresses] = await model.getUserAddresses(user.user_id);
    res.json(addresses);
});

/**
 * Add new addres for the user
 */
router.post('/@me/address', authenticateJwt, createAddressJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    /** @type {import('../@types/userModel').createAddressInfo} */
    const addressInfo = req.body;
    // eslint-disable-next-line
    addressInfo.user_id = user.user_id;

    try {
        const [newAddress] = await model.createAddress(req.body);
        res.json(newAddress);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

/**
 * Delete user's address
 */
router.delete('/@me/address/:id', authenticateJwt, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const id = parseInt(req.params.id, 10);

    if (id != req.params.id) return res.sendStatus(400);

    const [result] = await model.deleteAddress(user.user_id, id);
    res.json(result);
});

// User payment info route \/
/**
 * Get user's payment information with jwt
 */
router.get('/@me/payment-info', async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    var paymentInfos = await model.getUserPaymentInfo(user.user_id);
    res.json(paymentInfos);
});

// DEBUG
/**
 * Create payment information to for user
 */
router.post('/@me/payment-info', authenticateJwt, createPaymentInfoJsonValidator, async (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;

    /** @type {import('../@types/userModel').createPaymentInfo} */
    const paymentInfo = req.body;
    // eslint-disable-next-line camelcase
    paymentInfo.user_id = user.user_id;

    try {
        const [result] = await model.createPaymentInfo(paymentInfo);
        res.json(result);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// DEBUG
/**
 * Delete user's payment information
 */
router.delete('/@me/payment-info/:id', authenticateJwt, (req, res) => {
    /** @type {import('../@types/userModel').user} */
    const user = req.user;
    const id = parseInt(req.params.id, 10);

    if (id != req.params.id) res.sendStatus(400);

    const [result] = model.deletePaymentInfo(user.user_id, id);
    res.json(result);
});

export default router;
