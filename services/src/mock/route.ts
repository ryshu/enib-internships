import express from 'express';
import * as api from './api';

const router = express.Router();

router.get('/roles', api.getRoles);
router.get('/routes', api.getRoutes);
router.get('/users', api.getUsers);
router.get('/users/:username', api.getUserByName);

router.post('/users/login', api.login);
router.post('/users/logout', api.logout);
router.post('/users/info', api.getUserInfo);

router.put('/roles/:id', api.updateRole);
router.put('/users/:username', api.updateUser);

router.delete('/roles/:id', api.deleteRole);
router.delete('/users/:username', api.deleteUser);

export default router;
