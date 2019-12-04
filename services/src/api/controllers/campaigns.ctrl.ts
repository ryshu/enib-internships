import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import moment from 'moment';
import httpStatus from 'http-status-codes';

import CampaignModel from '../../models/campaigns.model';
import MentoringPropositionModel from '../../models/mentoring.proposition.model';
import MentorModel from '../../models/mentor.model';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { generateGetInternships } from '../helpers/internships.helper';

import { ICampaignEntity } from '../../declarations/campaign';

import { fullCopyInternshipType } from '../processors/internship.type.proc';
import { fullCopyMentoringProposition } from '../processors/mentoring.proposition.proc';
import { fullCopyInternship } from '../processors/internship.proc';
import { fullCopyMentor } from '../processors/mentor.proc';

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

    const { archived } = req.query;

    CampaignModel.getCampaigns({ archived })
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
        description: req.body.description,
        category: fullCopyInternshipType(req.body.category),

        semester: req.body.semester,
        maxProposition: req.body.maxProposition ? req.body.maxProposition : 0,

        isPublish: req.body.isPublish,

        startAt: !req.body.startAt ? null : moment(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment(req.body.endAt).valueOf(),

        propositions:
            req.body.propositions && Array.isArray(req.body.propositions)
                ? req.body.propositions.map((p: any) => fullCopyMentoringProposition(p))
                : [],
        availableInternships:
            req.body.availableInternships && Array.isArray(req.body.availableInternships)
                ? req.body.availableInternships.map((p: any) => fullCopyInternship(p))
                : [],
        validatedInternships:
            req.body.validatedInternships && Array.isArray(req.body.validatedInternships)
                ? req.body.validatedInternships.map((p: any) => fullCopyInternship(p))
                : [],
        mentors:
            req.body.mentors && Array.isArray(req.body.mentors)
                ? req.body.mentors.map((p: any) => fullCopyMentor(p))
                : [],
    };

    let categoryId: number;
    if (!campaign.category) {
        // No category to create, check if we have any category id provide
        if (
            req.body.category &&
            req.body.category.id &&
            !Number.isNaN(Number(req.body.category.id))
        ) {
            categoryId = Number(req.body.category.id);
        } else {
            return next(new APIError('No category provide, please provide a category', 400, 12000));
        }
    }

    CampaignModel.createCampaign(campaign)
        .then(async (created) => {
            if (checkContent(created, next)) {
                // If category is given using an id, link internship to category before send reply
                const updated = await CampaignModel.linkToCategory(created.id, categoryId);
                if (updated.isPublish) {
                    // If campaign is publish, launch campaign
                    await CampaignModel.launchCampaign(updated.id, req.session.socketId);
                    return res.status(httpStatus.ACCEPTED).send({ status: httpStatus.ACCEPTED });
                } else {
                    return res.send(updated);
                }
            }
        })
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

    CampaignModel.getCampaign(Number(req.params.id), req.query.archived)
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
    CampaignModel.updateCampaign(Number(req.params.id), req.body)
        .then((updated) => (checkContent(updated, next) ? res.send(updated) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
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

    CampaignModel.removeCampaign(Number(req.params.id))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
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
    const { page = 1, limit = 20, includes, archived } = req.query;

    MentoringPropositionModel.getMentoringPropositions(
        { campaignId: Number(req.params.id), includes, archived },
        { page, limit },
    )
        .then(async (mps) => (checkContent(mps, next) ? res.send(mps) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /campaigns/:id/mentoringPropositions/:mentoring_proposition_id/link
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

    CampaignModel.linkToProposition(
        Number(req.params.id),
        Number(req.params.mentoring_proposition_id),
    )
        .then((campaign) => (checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/availableInternships
 * Used to get all availableInternships of a campaign
 *
 * @notice This controller is generated using generateGetInternships method
 * which is used to avoid repeat internship code through application
 */
export const getAvailableCampaignInternships = generateGetInternships('availableCampaignId');

/**
 * POST /campaigns/:id/availableInternships/:availableInternships_id/link
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

    CampaignModel.linkToAvailableInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((campaign) => (checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/validatedInternships
 * Used to get all validatedInternships of a campaign
 */
export const getValidatedCampaignInternships = generateGetInternships('validatedCampaignId');

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

    CampaignModel.linkToValidatedInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((campaign) => (checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/internships
 * Used to get all internships of a campaign
 */
export const getCampaignInternships = generateGetInternships('campaignId');

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

    MentorModel.getMentors({ campaignId: Number(req.params.id) }, { page, limit })
        .then((data) => (checkContent(data, next) ? res.send(data) : undefined))
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

    CampaignModel.linkToMentor(Number(req.params.id), Number(req.params.mentor_id))
        .then((campaign) => (checkContent(campaign, next) ? res.send(campaign) : undefined))
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

    CampaignModel.getCampaign(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.category) : undefined))
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

    CampaignModel.linkToCategory(Number(req.params.id), Number(req.params.internship_type_id))
        .then((campaign) => (checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
