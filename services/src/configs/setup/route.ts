import express from 'express';

const router = express.Router();

/**
 * API routes.
 */
import apiRoute from '../../api/route';

import cas from './cas';

router.use(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`, cas.block, apiRoute);

export default router;
