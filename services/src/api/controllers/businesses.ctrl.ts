import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Businesses from '../../models/Businesses';
import httpStatus from 'http-status-codes';

import { paginate } from '../helpers/pagination.helper';
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

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
    const { page = 1, limit = 20 } = req.query;
    let max: number;
    Businesses.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Businesses.findAll(paginate({ page, limit }));
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
 * POST /businessess
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
    };

    Businesses.create(business)
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

    Businesses.findByPk(req.params.id)
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

    Businesses.findByPk(req.params.id)
        .then((business) => {
            if (!checkContent(business, next)) {
                return undefined;
            }

            if (req.body.name) {
                business.set('name', req.body.name);
            }
            if (req.body.country) {
                business.set('country', req.body.country);
            }
            if (req.body.city) {
                business.set('city', req.body.city);
            }
            if (req.body.postalCode) {
                business.set('postalCode', req.body.postalCode);
            }
            if (req.body.address) {
                business.set('address', req.body.address);
            }
            if (req.body.additional) {
                business.set('additional', req.body.additional);
            }

            return business.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
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

    Businesses.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
