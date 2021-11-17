import { Router as _router } from 'express';
import { createUserJsonValidator, modifyUserJsonValidator } from '../middleware/userMiddlewares';
import { model } from '../models/userModel';


const router = _router();

/**
 * Get all users from database
 */
router.get('/', async (req, res) => {
    var dbResult = await model.getUsers();
    res.status(200).json(dbResult);
});

/**
 * Get single user by id
 */
router.get('/:id', async (req, res) => {
    var [user] = await model.getUser(req.params.id);
    res.status(200).json(user);
});

/**
 * Get users addresses
 */
router.get('/address/:userId', async (req, res) => {
    var [addresses] = await model.getUserAddresses(req.params.userId);
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
 * Login with user
 */
router.get('/login/:username', async (req, res) => {
    var [credentials] = await model.getUserCredentials(req.params.username);
    res.status(200).json(credentials);
});

/**
 * Create new user
 */
router.post('/user', createUserJsonValidator, async (req, res) => {
    try {
        var [newUser] = await model.createUser(req.body);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json(error.message);
        console.log(error);
    }
});

/**
 * Edit user information
 */
router.put('/user', modifyUserJsonValidator, async (req, res) => {
    try {
        var [editedUser] = await model.modifyUser(req.body.userId, req.body.user);
        res.status(200).json(editedUser);
    } catch (error) {
        res.status(400).json(error.message);
        console.log(error);
    }
});

export default router;
