import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import InternshipTypeModel from '../../models/internship.type.mode';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

import { IInternshipTypeEntity } from '../../declarations';
import { generateGetInternships } from '../helpers/internships.helper';

/**
 * GET /internshipTypes
 * Used to GET all internship types
 */
export const getInternshipTypes = (_req: Request, res: Response, next: NextFunction): void => {
    InternshipTypeModel.getInternshipTypes()
        .then((types) => (checkArrayContent(types, next) ? res.send(types) : undefined))
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

    const type: IInternshipTypeEntity = {
        label: req.body.label,
    };

    InternshipTypeModel.createInternshipType(type)
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
    InternshipTypeModel.getInternshipType(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
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

    InternshipTypeModel.updateInternshipType(Number(req.params.id), req.body)
        .then((updated) => (checkContent(updated, next) ? res.send(updated) : undefined))
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

    InternshipTypeModel.removeInternshipType(Number(req.params.id))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /internshipTypes/:id/internships
 * Used to select an internships type by ID and return list of internships link to it
 */
export const getInternshipTypeInternships = generateGetInternships('categoryId');

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

    InternshipTypeModel.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((type) => (checkContent(type, next) ? res.send(type) : undefined))
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
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    InternshipTypeModel.getInternshipTypes({ campaignId: Number(req.params.id) })
        .then((data) => (checkArrayContent(data, next) ? res.send(data) : undefined))
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

    InternshipTypeModel.linkToCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((type) => (checkContent(type, next) ? res.send(type) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
