import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import moment from 'moment';
import httpStatus from 'http-status-codes';
import sequelize from 'sequelize';

import Campaigns from '../../models/Campaigns';
import MentoringPropositions from '../../models/MentoringPropositions';
import InternshipTypes from '../../models/InternshipTypes';
import Internships from '../../models/Internships';
import Mentors from '../../models/Mentors';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { paginate } from '../helpers/pagination.helper';

import { APIError } from '../../utils/error';

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

    Campaigns.findAll({ include: [{ model: InternshipTypes, as: 'category' }] })
        .then((campaigns) => {
            if (checkArrayContent(campaigns, next)) {
                return res.send(campaigns);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /campaignss
 * Used to create a new campaign entry
 */
export const postCampaign = async (req: Request, res: Response, next: NextFunction) => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const campaign: ICampaignEntity = {
        name: req.body.name,
        startAt: !req.body.startAt ? null : moment(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment(req.body.endAt).valueOf(),
        description: req.body.description,
        semester: req.body.semester,
        maxProposition: req.body.maxProposition ? req.body.maxProposition : 0,
    };

    try {
        const category = await InternshipTypes.findByPk(req.body.category_id);
        if (!category) {
            next(
                new APIError(
                    `Couldn't find given category in database`,
                    httpStatus.BAD_REQUEST,
                    11103,
                ),
            );
            return;
        }

        const created = await Campaigns.create(campaign);
        await created.setCategory(category);

        res.send(created);
    } catch (error) {
        UNPROCESSABLE_ENTITY(next, error);
    }
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
        include: [
            { model: MentoringPropositions, as: 'propositions' },
            { model: InternshipTypes, as: 'category' },
        ],
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
        .then(async (campaign) => {
            if (!checkContent(campaign, next)) {
                return undefined;
            }
            if (req.body.name) {
                campaign.set('name', req.body.name);
            }
            if (req.body.description) {
                campaign.set('description', req.body.description);
            }
            if (req.body.startAt) {
                campaign.set(
                    'startAt',
                    req.body.startAt === 0 ? null : moment(req.body.startAt).valueOf(),
                );
            }
            if (req.body.endAt) {
                campaign.set(
                    'endAt',
                    req.body.endAt === 0 ? null : moment(req.body.endAt).valueOf(),
                );
            }
            if (req.body.semester) {
                campaign.set('semester', req.body.semester);
            }
            if (req.body.maxProposition !== undefined) {
                campaign.set(
                    'maxProposition',
                    req.body.maxProposition ? req.body.maxProposition : 0,
                );
            }

            if (req.body.category_id !== undefined && !Number.isNaN(Number(req.body.category_id))) {
                try {
                    const category = await InternshipTypes.findByPk(req.body.category_id);
                    if (!category) {
                        return undefined;
                    }

                    await campaign.setCategory(category);
                } catch (error) {
                    UNPROCESSABLE_ENTITY(next, error);
                    return undefined;
                }
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

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    const findOpts: sequelize.FindOptions = { where: { campaignId: req.params.id } };

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

/**
 * GET /campaigns/:id/availableInternships
 * Used to get all availableInternships of a campaign
 */
export const getAvailableCampaignInternships = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    const findOpts: sequelize.FindOptions = { where: { availableCampaignId: req.params.id } };

    let max: number;
    Internships.count(findOpts)
        .then((rowNbr) => {
            max = rowNbr;
            return Internships.findAll(paginate({ page, limit }, findOpts));
        })
        .then(async (internships) => {
            if (checkArrayContent(internships, next)) {
                return res.send({
                    page,
                    data: internships,
                    length: internships.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/availableInternships/:availableInternships_id/link
 * Used to link an internship with an availableCampaign
 */
export const linkAvailableCampaignInternships = (
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
                try {
                    await val.addAvailableInternship(Number(req.params.internship_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/validatedInternships
 * Used to get all validatedInternships of a campaign
 */
export const getValidatedCampaignInternships = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    const findOpts: sequelize.FindOptions = { where: { validatedCampaignId: req.params.id } };

    let max: number;
    Internships.count(findOpts)
        .then((rowNbr) => {
            max = rowNbr;
            return Internships.findAll(paginate({ page, limit }, findOpts));
        })
        .then(async (internships) => {
            if (checkArrayContent(internships, next)) {
                return res.send({
                    page,
                    data: internships,
                    length: internships.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/validatedCampaigns/:internship_id/link
 * Used to link an internship with a ValidatedCampaign
 */
export const linkValidatedCampaignInternships = (
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
                try {
                    await val.addValidatedInternship(Number(req.params.internship_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/mentors
 * Used to get all mentors of a campaign
 */
export const getCampaignMentors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    const findOpts: sequelize.FindOptions = {
        include: [{ model: Campaigns, as: 'campaigns', attributes: [], duplicating: false }],
        where: { '$campaigns.id$': req.params.id },
    };

    let max: number;
    Mentors.count(findOpts)
        .then((rowNbr) => {
            max = rowNbr;
            return Mentors.findAll(paginate({ page, limit }, findOpts));
        })
        .then(async (mentors) => {
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
 * GET /campaigns/:id/mentors/:mentor_id/link
 * Used to link a mentor with a campaign
 */
export const linkCampaignMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.addMentor(Number(req.params.mentor_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/internshipTypes
 * Used to select a campaign by ID and return his category
 */
export const getCampaignInternshipType = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id, { include: [{ model: InternshipTypes, as: 'category' }] })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.category);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /campaigns/:id/internshipTypes/:internship_type_id/link
 * Used to create a link between campaigns and internshipsTypes
 */
export const linkCampaignInternshipType = (
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
                try {
                    await val.setCategory(Number(req.params.internship_type_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
