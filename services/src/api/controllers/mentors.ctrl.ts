import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';
import sequelize from 'sequelize';

// Import mentors ORM class
import Campaigns from '../../models/Campaigns';
import Internships from '../../models/Internships';
import Mentors from '../../models/Mentors';
import MentoringPropositions from '../../models/MentoringPropositions';

// Factorization methods to handle errors
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { paginate } from '../helpers/pagination.helper';

import { isMentorRole } from '../../utils/type';

import cache from '../../statistics/singleton';

/**
 * GET /mentors
 * Used to GET all mentors
 */

export const getMentors = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrieve all mentors from database
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max: number;
    Mentors.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Mentors.findAll(paginate({ page, limit }));
        })
        .then((mentors) => {
            if (checkArrayContent(mentors, next)) {
                return res.send({
                    page,
                    data: mentors,
                    length: mentors.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /mentors
 * Used to create a new mentor entry
 */
export const postMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Get all data, we aren't afraid of having wrong data because we validate them before
    const mentor: IMentorEntity = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role && isMentorRole(req.body.role) ? req.body.role : 'default',
    };

    // Insert mentor in database
    Mentors.create(mentor)
        .then((created) => {
            cache.addMentor();
            return res.send(created);
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id
 * Used to select a mentors by ID
 */
export const getMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Select mentor by ID into database
    Mentors.findByPk(req.params.id)
        .then((val) => {
            // Check if we have content, and if so return it
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /mentors/:id
 * Used to update mentor values
 */
export const putMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then((mentor) => {
            if (!checkContent(mentor, next)) {
                return undefined;
            }

            if (req.body.firstName) {
                mentor.set('firstName', req.body.firstName);
            }
            if (req.body.lastName) {
                mentor.set('lastName', req.body.lastName);
            }
            if (req.body.email) {
                mentor.set('email', req.body.email);
            }
            if (req.body.role && isMentorRole(req.body.role)) {
                mentor.set('role', req.body.role);
            }

            return mentor.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /mentors/:id
 * Used to remove a mentor from database
 */
export const deleteMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then(async (val) => {
            if (val) {
                // Remove from stats
                const campaigns = await val.getCampaigns();
                campaigns.forEach((c) => {
                    cache.unlinkMentor(c.id);
                });
                cache.removeMentor();
                return val.destroy();
            }
            return undefined;
        }) // Call destroy on selected mentor
        .then(() => res.sendStatus(httpStatus.OK)) // Return OK status
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /mentors/:id/campaigns
 * Used to get all campaigns of a mentor
 */
export const getMentorCampaigns = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id, {
        include: [{ model: Campaigns, as: 'campaigns' }],
    })
        .then(async (val) => {
            if (checkContent(val, next)) {
                return res.send(val.campaigns);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id/campaigns/:campaign_id/link
 * Used to link a mentor with a campaign
 */
export const linkMentorCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.addCampaign(Number(req.params.campaign_id));
                    cache.linkMentor(Number(req.params.campaign_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id/propositions
 * Used to get all propositions of a mentor
 */
export const getMentorPropositions = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    const findOpts: sequelize.FindOptions = { where: { mentorId: req.params.id } };

    let max: number;
    MentoringPropositions.count(findOpts)
        .then((rowNbr) => {
            max = rowNbr;
            return MentoringPropositions.findAll(paginate({ page, limit }, findOpts));
        })
        .then(async (mps) => {
            if (checkArrayContent(mps, next)) {
                return res.send({
                    page,
                    data: mps,
                    length: mps.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id/propositions/:mentoring_proposition_id/link
 * Used to link a mentor with a campaign
 */
export const linkMentorProposition = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.addProposition(Number(req.params.mentoring_proposition_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id/internships
 * Used to get all internships of a mentor
 */
export const getMentorInternships = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    const findOpts: sequelize.FindOptions = { where: { mentorId: req.params.id } };

    let max: number;
    Internships.count(findOpts)
        .then((rowNbr) => {
            max = rowNbr;
            return Internships.findAll(paginate({ page, limit }, findOpts));
        })
        .then(async (mps) => {
            if (checkArrayContent(mps, next)) {
                return res.send({
                    page,
                    data: mps,
                    length: mps.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id/internships/:internship_id/link
 * Used to link a mentor with an internship
 */
export const linkMentorInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.addInternship(Number(req.params.internship_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
