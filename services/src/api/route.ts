import express from 'express';

import businessesRouter from './routers/businesses.route';
import campaignsRouter from './routers/campaigns.route';
import mockUserSystem from '../mock/route';

const router = express.Router();

router.use('/businesses', businessesRouter);
router.use('/campaigns', campaignsRouter);
router.use(mockUserSystem);

export default router;
