import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';

import { APIError } from '../../utils/error';

/**
 * GET /cas/profile
 * Used to retrieve user profil after cas connection
 */
export function getProfile(req: Request, res: Response, next: NextFunction) {
    // Check if any session is defined
    if (req.session && req.session.info) {
        if (!req.session.info.role) {
            // Prevent student case to doesn't have any role returned
            req.session.info.role = 'student';
        }
        return res.send(req.session.info);
    }
    next(new APIError('Missing cas user info in given session', httpStatus.BAD_REQUEST, 11103));
}
