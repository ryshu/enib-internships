import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import MentorModel from '../../models/mentor.model';
import MentoringPropositionModel from '../../models/mentoring.proposition.model';

// Factorization methods to handle errors
import {
    UNPROCESSABLE_ENTITY,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { generateGetInternships } from '../helpers/internships.helper';

import { isMentorRole } from '../../utils/type';

import { IMentorEntity } from '../../declarations';

import { fullCopyCampaign } from '../processors/campaign.proc';
import { fullCopyMentoringProposition } from '../processors/mentoring.proposition.proc';
import { fullCopyInternship } from '../processors/internship.proc';

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
    // Retrieve query data
    const { page = 1, limit = 20, archived, name } = req.query;

    MentorModel.getMentors({ archived, name }, { page, limit })
        .then((mentor) => (checkContent(mentor, next) ? res.send(mentor) : undefined))
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
        fullName: undefined,
        email: req.body.email,
        role: req.body.role && isMentorRole(req.body.role) ? req.body.role : 'default',

        campaigns:
            req.body.campaigns && Array.isArray(req.body.campaigns)
                ? req.body.campaigns.map((i: any) => fullCopyCampaign(i))
                : [],
        propositions:
            req.body.propositions && Array.isArray(req.body.propositions)
                ? req.body.propositions.map((i: any) => fullCopyMentoringProposition(i))
                : [],
        internships:
            req.body.internships && Array.isArray(req.body.internships)
                ? req.body.internships.map((i: any) => fullCopyInternship(i))
                : [],
    };

    MentorModel.createMentor(mentor)
        .then((created) => res.send(created))
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
    MentorModel.getMentor(Number(req.params.id), req.query.archived)
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
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

    MentorModel.updateMentor(Number(req.params.id), req.body)
        .then((val) => {
            if (checkContent(val, next)) {
                req.session.info = val;
                res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
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

    MentorModel.removeMentor(Number(req.params.id))
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

    MentorModel.getMentor(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.campaigns) : undefined))
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

    MentorModel.linkToCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((mentor) => (checkContent(mentor, next) ? res.send(mentor) : undefined))
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

    // Retrieve query data
    const { page = 1, limit = 20 } = req.query;

    MentoringPropositionModel.getMentoringPropositions(
        { mentorId: Number(req.params.id) },
        { page, limit },
    )
        .then((propositions) =>
            checkContent(propositions, next) ? res.send(propositions) : undefined,
        )
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentors/:id/propositions/:mentoring_proposition_id/link
 * Used to link a mentor with a campaign
 */
export const linkMentorProposition = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    MentorModel.linkToProposition(
        Number(req.params.id),
        Number(req.params.mentoring_proposition_id),
    )
        .then((mentor) => (checkContent(mentor, next) ? res.send(mentor) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id/internships
 * Used to get all internships of a mentor
 */
export const getMentorInternships = generateGetInternships('mentorId');

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

    MentorModel.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((mentor) => (checkContent(mentor, next) ? res.send(mentor) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
