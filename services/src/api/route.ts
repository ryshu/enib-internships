import express from 'express';

import businessesRouter from './routers/businesses.route';
import campaignsRouter from './routers/campaigns.route';
import internshipsRouter from './routers/internships.route';
import internshipTypesRouter from './routers/internship.types.route';
import studentsRouter from './routers/students.route';
import filesRouter from './routers/files.route';
import mentoringPropositionsRouter from './routers/mentoring.propositions.route';
import mentorsRouter from './routers/mentors.route';

import casRouter from '../auth/cas/route';

import { getStatistics } from './controllers/statistics.ctrl';

const router = express.Router();

router.use('/businesses', businessesRouter);
router.use('/campaigns', campaignsRouter);
router.use('/internships', internshipsRouter);
router.use('/internshipTypes', internshipTypesRouter);
router.use('/students', studentsRouter);
router.use('/mentors', mentorsRouter);
router.use('/files', filesRouter);
router.use('/mentoringPropositions', mentoringPropositionsRouter);

router.get('/statistics', getStatistics);

router.use('/cas', casRouter);

export default router;
