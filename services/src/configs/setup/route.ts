import express from 'express';

const router = express.Router();

/**
 * API routes.
 */
import apiRoute from '../../api/route';

router.use(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`, apiRoute);

export default router;
