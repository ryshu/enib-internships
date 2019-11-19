import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import MentoringPropositions from '../../models/MentoringPropositions';
import Campaigns from '../../models/Campaigns';
import Mentors from '../../models/Mentors';
import Internships from '../../models/Internships';

import { paginate } from '../helpers/pagination.helper';
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

import cache from '../../statistics/singleton';

/**
 * GET /mentoringPropositions
 * Used to GET all mentoringPropositions
 */
export const getMentoringPropositions = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max: number;
    MentoringPropositions.count()
        .then((rowNbr) => {
            max = rowNbr;
            return MentoringPropositions.findAll(paginate({ page, limit }));
        })
        .then((mentoringPropositions) => {
            if (checkArrayContent(mentoringPropositions, next)) {
                return res.send({
                    page,
                    data: mentoringPropositions,
                    length: mentoringPropositions.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropositions
 * Used to create a new mentoringProposition entry
 */
export const postMentoringProposition = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const mentoringProposition: IMentoringPropositionEntity = {
        comment: req.body.comment,
    };

    MentoringPropositions.create(mentoringProposition)
        .then((created) => {
            cache.addProposition();
            return res.send(created);
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentoringPropositions/:id
 * Used to select a mentoringProposition by ID
 */
export const getMentoringProposition = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id, {
        include: [{ model: Campaigns, as: 'campaign' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /mentoringPropositions/:id
 * Used to update mentoringProposition values
 */
export const putMentoringProposition = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id)
        .then((mentoringProposition) => {
            if (!checkContent(mentoringProposition, next)) {
                return undefined;
            }

            if (req.body.comment) {
                mentoringProposition.set('comment', req.body.comment);
            }

            return mentoringProposition.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /mentoringPropositions/:id
 * Used to remove a mentoringProposition from database
 */
export const deleteMentoringProposition = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id)
        .then((val) => {
            if (val) {
                cache.removeProposition((val.campaign as number) || undefined);
                return val.destroy();
            }
            return undefined;
        })
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /mentoringPropostions/:id/campaigns
 * Used to select a mentoring propositions by ID and return his campaign
 */
export const getMentoringPropositionCampaigns = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id, {
        include: [{ model: Campaigns, as: 'campaign' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.campaign);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropostions/:id/campaigns/:campaign_id/link
 * Used to create a link between mentoring propositions and campaign
 */
export const linkMentoringPropositionCampaign = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.setCampaign(Number(req.params.campaign_id));
                    cache.linkProposition(Number(req.params.campaign_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentoringPropostions/:id/mentors
 * Used to select a mentoring propositions by ID and return his mentor
 */
export const getMentoringPropositionMentor = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id, {
        include: [{ model: Mentors, as: 'mentor' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.mentor);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropostions/:id/mentors/:mentor_id/link
 * Used to create a link between mentoring propositions and mentor
 */
export const linkMentoringPropositionMentor = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.setMentor(Number(req.params.mentor_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentoringPropostions/:id/internship
 * Used to select a mentoring propositions by ID and return his internship
 */
export const getMentoringPropositionInternship = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id, {
        include: [{ model: Internships, as: 'internship' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.internship);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropostions/:id/internships/:internship_id/link
 * Used to create a link between mentoring propositions and internship
 */
export const linkMentoringPropositionInternship = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentoringPropositions.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.setInternship(Number(req.params.internship_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
