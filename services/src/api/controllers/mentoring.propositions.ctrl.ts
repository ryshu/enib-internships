import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import { IMentoringPropositionEntity } from '../../declarations';

import {
    UNPROCESSABLE_ENTITY,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

import MentoringPropositionModel from '../../models/mentoring.proposition.model';

import { fullCopyInternship } from '../processors/internship.proc';
import { fullCopyCampaign } from '../processors/campaign.proc';
import { fullCopyMentor } from '../processors/mentor.proc';

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

    const { page = 1, limit = 20, archived } = req.query;

    MentoringPropositionModel.getMentoringPropositions({ archived }, { page, limit })
        .then((propositions) =>
            checkContent(propositions, next) ? res.send(propositions) : undefined,
        )
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

        internship: fullCopyInternship(req.body.internship),
        campaign: fullCopyCampaign(req.body.campaign),
        mentor: fullCopyMentor(req.body.mentor),
    };

    MentoringPropositionModel.createMentoringProposition(mentoringProposition)
        .then((created) => res.send(created))
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

    MentoringPropositionModel.getMentoringProposition(Number(req.params.id), req.query.archived)
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
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

    MentoringPropositionModel.updateMentoringProposition(Number(req.params.id), req.body)
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
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

    MentoringPropositionModel.removeMentoringProposition(Number(req.params.id))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /mentoringPropositions/:id/campaigns
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
    MentoringPropositionModel.getMentoringProposition(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.campaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropositions/:id/campaigns/:campaign_id/link
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

    MentoringPropositionModel.linkToCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentoringPropositions/:id/mentors
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

    MentoringPropositionModel.getMentoringProposition(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.mentor) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropositions/:id/mentors/:mentor_id/link
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

    MentoringPropositionModel.linkToMentor(Number(req.params.id), Number(req.params.mentor_id))
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentoringPropositions/:id/internship
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

    MentoringPropositionModel.getMentoringProposition(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentoringPropositions/:id/internships/:internship_id/link
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

    MentoringPropositionModel.linkToInternship(
        Number(req.params.id),
        Number(req.params.internship_id),
    )
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
