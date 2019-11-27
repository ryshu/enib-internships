import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

import BusinessModel from '../../models/business.model';

import {
    UNPROCESSABLE_ENTITY,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { generateGetInternships } from '../helpers/internships.helper';
import { fullCopyInternship } from '../processors/internship.proc';

import { IBusinessEntity } from '../../declarations';

/**
 * GET /businesses
 * Used to GET all businesses
 */
export const getBusinesses = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20, countries, name, archived } = req.query;

    BusinessModel.getBusinesses({ name, countries, archived }, { page, limit })
        .then(async (data) => {
            if (checkContent(data, next)) {
                return res.send(data);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /businesses
 * Used to create a new business entry
 */
export const postBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const business: IBusinessEntity = {
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address: req.body.address,
        additional: req.body.additional,

        // Copy internships if provided to also create them in DB
        internships:
            req.body.internships && Array.isArray(req.body.internships)
                ? req.body.internships.map((i: any) => fullCopyInternship(i))
                : [],
    };

    BusinessModel.createBusiness(business)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /businesses/:id
 * Used to select a business by ID
 */
export const getBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    BusinessModel.getBusiness(Number(req.params.id), req.query.archived)
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /businesses/:id
 * Used to update business values
 */
export const putBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    BusinessModel.updateBusiness(Number(req.params.id), req.body)
        .then((business) => {
            if (checkContent(business, next)) {
                return res.send(business);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /businesses/:id
 * Used to remove a business from database
 */
export const deleteBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    BusinessModel.removeBusiness(Number(req.params.id))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /businesses/:id/internships
 * Used to get all internships of a business
 */
export const getBusinessInternships = generateGetInternships('businessId');

/**
 * GET /businesses/:id/internships/:internship_id/link
 * Used to get all internships of a business
 */
export const linkBusinessInternships = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    BusinessModel.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
