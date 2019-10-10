import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Internships from '../../models/Internships';
import httpStatus from 'http-status-codes';

import { paginate } from '../helpers/pagination.helper';
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

/**
 * GET /internships
 * Used to GET all internships
 */
export const getInternships = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max: number;
    Internships.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Internships.findAll(paginate({ page, limit }));
        })
        .then((internships) => {
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
 * POST /internship
 * Used to create a new internship entry
 */
export const postInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const internship: IInternshipEntity = {
        subject: req.body.subject,
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address: req.body.address,
        additional: req.body.additional,
        isLanguageCourse: req.body.isLanguageCourse ? true : false,
        isValidated: req.body.isValidated ? true : false,
    };

    Internships.create(internship)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id
 * Used to select a internship by ID
 */
export const getInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id)
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /internship/:id
 * Used to update internship values
 */
export const putInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id)
        .then((internships) => {
            if (!checkContent(internships, next)) {
                return undefined;
            }

            if (req.body.subject) {
                internships.set('subject', req.body.subject);
            }
            if (req.body.description) {
                internships.set('description', req.body.description);
            }
            if (req.body.country) {
                internships.set('country', req.body.country);
            }
            if (req.body.city) {
                internships.set('city', req.body.city);
            }
            if (req.body.postalCode) {
                internships.set('postalCode', req.body.postalCode);
            }
            if (req.body.address) {
                internships.set('address', req.body.address);
            }
            if (req.body.additional) {
                internships.set('additional', req.body.additional);
            }
            if (req.body.isLanguageCourse !== undefined) {
                internships.set('isLanguageCourse', req.body.isLanguageCourse ? true : false);
            }
            if (req.body.isValidated !== undefined) {
                internships.set('isValidated', req.body.isValidated ? true : false);
            }

            return internships.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /internship/:id
 * Used to remove a internship from database
 */
export const deleteInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
