import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Import students ORM class
import Students from '../../models/Students';
import httpStatus from 'http-status-codes';

// Factorization methods to handle errors
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { paginate } from '../helpers/pagination.helper';

/**
 * GET /students
 * Used to GET all students
 */
export const getStudents = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max: number;

    Students.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Students.findAll(paginate({ page, limit }));
        })
        .then((students) => {
            if (checkArrayContent(students, next)) {
                return res.send({
                    page,
                    data: students,
                    length: students.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /student
 * Used to create a new student entry
 */
export const postStudent = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Get all data, we aren't afraid of having wrong data because we validate them before
    const student: IStudentEntity = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        semester: req.body.semester,
    };

    // Insert student in database
    Students.create(student)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /student/:id
 * Used to select a student by ID
 */
export const getStudent = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Students.findByPk(req.params.id)
        .then((val) => {
            // Check if we have content, and if so return it
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /students/:id
 * Used to update student values
 */
export const putStudent = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Students.findByPk(req.params.id)
        .then((student) => {
            if (!checkContent(student, next)) {
                return undefined;
            }

            if (req.body.firstName) {
                student.set('firstName', req.body.firstName);
            }
            if (req.body.lastName) {
                student.set('lastName', req.body.lastName);
            }
            if (req.body.email) {
                student.set('email', req.body.email);
            }
            if (req.body.semester) {
                student.set('semester', req.body.semester);
            }

            return student.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /students/:id
 * Used to remove a student from database
 */
export const deleteStudent = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Students.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined)) // Call destroy on selected student
        .then(() => res.sendStatus(httpStatus.OK)) // Return OK status
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
