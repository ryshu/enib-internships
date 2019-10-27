import express from 'express';

import * as CASCtrl from './ctrl';

const router = express.Router();

router.get('/profile', CASCtrl.getProfile);

export default router;
