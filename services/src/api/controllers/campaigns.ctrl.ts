import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import Campaigns from '../../models/Campaigns';
import MentoringPropositions from '../../models/MentoringPropositions';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { paginate } from '../helpers/pagination.helper';

/**
 * GET /campaigns
 * Used to GET all campaigns
 */
export const getCampaigns = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max: number;
    Campaigns.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Campaigns.findAll(paginate({ page, limit }));
        })
        .then((campaigns) => {
            if (checkArrayContent(campaigns, next)) {
                return res.send({
                    page,
                    data: campaigns,
                    length: campaigns.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /campaignss
 * Used to create a new campaign entry
 */
export const postCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const campaign: ICampaignEntity = {
        name: req.body.name,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        semester: req.body.semester,
        maxProposition: req.body.maxProposition,
    };

    Campaigns.create(campaign)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id
 * Used to select a campaign by ID
 */
export const getCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id, {
        include: [{ model: MentoringPropositions, as: 'propositions' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /campaigns/:id
 * Used to update campaign values
 */
export const putCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then((campaign) => {
            if (!checkContent(campaign, next)) {
                return undefined;
            }
            if (req.body.name) {
                campaign.set('name', req.body.name);
            }
            if (req.body.startAt) {
                campaign.set('startAt', req.body.startAt);
            }
            if (req.body.endAt) {
                campaign.set('endAt', req.body.endAt);
            }
            if (req.body.semester) {
                campaign.set('semester', req.body.semester);
            }
            if (req.body.maxProposition) {
                campaign.set('maxProposition', req.body.maxProposition);
            }
            return campaign.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /campaigns/:id
 * Used to remove a campaign from database
 */
export const deleteCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /campaigns/:id/mentoringPropositions
 * Used to get all mentoringPropositions of a campaign
 */
export const getCampaignMentoringPropositions = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id, {
        include: [{ model: MentoringPropositions, as: 'propositions' }],
    })
        .then(async (val) => {
            if (checkContent(val, next)) {
                return res.send(val.propositions);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/mentoringPropositions/:mentoring_proposition_id/link
 * Used to link a mentoring propositions with a campaign
 */
export const linkCampaignMentoringPropositions = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addProposition(Number(req.params.mentoring_proposition_id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
