import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';
import moment from 'moment';

import Internships from '../../models/Internships';
import Businesses from '../../models/Businesses';
import InternshipTypes from '../../models/InternshipTypes';
import Students from '../../models/Students';

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
        isInternshipAbroad: req.body.isInternshipAbroad ? true : false,
        isValidated: req.body.isValidated ? true : false,
        startAt: !req.body.startAt ? null : moment(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment(req.body.endAt).valueOf(),
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

    Internships.findByPk(req.params.id, {
        include: [
            { model: Businesses, as: 'business' },
            { model: InternshipTypes, as: 'category' },
            { model: Students, as: 'student' },
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
            if (req.body.isInternshipAbroad !== undefined) {
                internships.set('isInternshipAbroad', req.body.isInternshipAbroad ? true : false);
            }
            if (req.body.isValidated !== undefined) {
                internships.set('isValidated', req.body.isValidated ? true : false);
            }
            if (req.body.startAt !== undefined) {
                internships.set(
                    'startAt',
                    req.body.startAt === 0 ? null : moment(req.body.startAt).valueOf(),
                );
            }
            if (req.body.endAt !== undefined) {
                internships.set(
                    'endAt',
                    req.body.endAt === 0 ? null : moment(req.body.endAt).valueOf(),
                );
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

/**
 * GET /internships/:id/businesses
 * Used to select a internship by ID and return his business
 */
export const getInternshipBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id, { include: [{ model: Businesses, as: 'business' }] })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.business);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/businesses/:business_id/link
 * Used to create a link between internships and business
 */
export const linkInternshipBusinesses = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                try {
                    await val.setBusiness(Number(req.params.business_id));
                    return res.sendStatus(httpStatus.OK);
                } catch (error) {
                    checkContent(null, next);
                }
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internships/:id/internshipTypes
 * Used to select a internship by ID and return his category
 */
export const getInternshipInternshipType = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id, { include: [{ model: InternshipTypes, as: 'category' }] })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.category);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/internshipTypes/:internship_type_id/link
 * Used to create a link between internships and internshipsTypes
 */
export const linkInternshipInternshipTypes = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id)
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

/**
 * GET /internship/:id/student
 * Used to select a internship by ID and return his student
 */
export const getInternshipStudent = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id, { include: [{ model: Students, as: 'student' }] })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.student);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/student/:students_id/link
 * Used to link internship to a student
 */
export const linkInternshipStudents = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Students.findByPk(req.params.student_id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addInternship(Number(req.params.id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
