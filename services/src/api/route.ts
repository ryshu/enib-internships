import express from 'express';

import businessesRouter from './routers/businesses.route';
import studentsRouter from './routers/students.route';
import mockUserSystem from '../mock/route';

const router = express.Router();

router.use('/businesses', businessesRouter);
router.use('/students', studentsRouter);
router.use(mockUserSystem);

export default router;
