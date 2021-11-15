import { Router as _router } from 'express';
import { model } from '../models/userModel';

const router = _router();


router.get('/user', async (req, res) => {
    var dbResult = await model.getUsers();
    res.status(200).send(dbResult);
});

router.get('/user/:id', async (req, res) => {
    var [user] = await model.getUser(req.params.id);
    res.status(200).send(user);
});

router.get('/address/:userId', async (req, res) => {
    var dbResult = await model.getUserAddresses(req.params.userId);
    res.status(200).send(dbResult);
});

export default router;