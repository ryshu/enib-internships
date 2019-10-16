import express from 'express';

import businessesRouter from './routers/businesses.route';
import campaignsRouter from './routers/campaigns.route';
import internshipsRouter from './routers/internships.route';
import studentsRouter from './routers/students.route';
import filesRouter from './routers/files.route';
import mentoringPropositionsRouter from './routers/mentoring.propositions.route';

import mockUserSystem from '../mock/route';

const router = express.Router();

router.use('/businesses', businessesRouter);
router.use('/campaigns', campaignsRouter);
router.use('/internships', internshipsRouter);
router.use('/students', studentsRouter);
router.use('/files', filesRouter);
router.use('/mentoringPropositions', mentoringPropositionsRouter);
router.use(mockUserSystem);

export default router;
