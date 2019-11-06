import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import InternshipTypes from '../../models/InternshipTypes';
import Internships from '../../models/Internships';
import Campaigns from '../../models/Campaigns';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

/**
 * GET /internshipTypes
 * Used to GET all internship types
 */
export const getInternshipTypes = (req: Request, res: Response, next: NextFunction): void => {
    InternshipTypes.findAll()
        .then((it) => {
            if (checkArrayContent(it, next)) {
                return res.send(it);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internshipTypes
 * Used to create a new internship type entry
 */
export const postInternshipType = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const internship: IInternshipTypeEntity = {
        label: req.body.label,
    };

    InternshipTypes.create(internship)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internshipTypes/:id
 * Used to select a internship type by ID
 */
export const getInternshipType = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id)
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /internshipTypes/:id
 * Used to update internship type values
 */
export const putInternshipType = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id)
        .then((it) => {
            if (!checkContent(it, next)) {
                return undefined;
            }

            if (req.body.label) {
                it.set('label', req.body.label);
            }

            return it.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /internshipTypes/:id
 * Used to remove a internship type from database
 */
export const deleteInternshipType = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /internshipTypes/:id/internships
 * Used to select an internships type by ID and return list of internships link to it
 */
export const getInternshipTypeInternships = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id, {
        include: [{ model: Internships, as: 'internships' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.internships);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internshipTypes/:id/internships/:internship_id/link
 * Used to link internship types to internships
 */
export const linkInternshipTypeInternship = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addInternship(Number(req.params.internship_id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internshipTypes/:id/campaigns
 * Used to select an campaigns type by ID and return list of campaigns link to it
 */
export const getInternshipTypeCampaigns = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id, {
        include: [{ model: Campaigns, as: 'campaigns' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.campaigns);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internshipTypes/:id/campaigns/:campaign_id/link
 * Used to link campaign types to campaigns
 */
export const linkInternshipTypeCampaign = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipTypes.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addCampaign(Number(req.params.campaign_id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
