import express from 'express';

import businessesRouter from './routers/businesses.route';
import internshipsRouter from './routers/internships.route';
import mockUserSystem from '../mock/route';

const router = express.Router();

router.use('/businesses', businessesRouter);
router.use('/internships', internshipsRouter);
router.use(mockUserSystem);

export default router;
