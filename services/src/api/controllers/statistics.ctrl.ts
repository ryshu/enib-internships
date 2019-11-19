import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { BAD_REQUEST_VALIDATOR, checkContent } from '../helpers/global.helper';

import cache from '../../statistics/singleton';

/**
 * GET /statistics
 * Used to GET internships statistics
 */
export const getStatistics = async (_req: Request, res: Response, _next: NextFunction) => {
    return res.send(cache.statistics);
};

/**
 * GET /campaigns/:id/statistics
 * Used to GET a campaign statistics
 */
export const getCampaignStatistics = async (req: Request, res: Response, next: NextFunction) => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const stat = cache.getCampaign(Number(req.params.id));
    if (checkContent(stat, next)) {
        return res.send(stat);
    }
};
