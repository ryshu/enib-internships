import { Schema } from 'express-validator';

import { paginateValidator } from './generic.val';

export const StudentList: Schema = {
    ...paginateValidator,
};

export const StudentCreate: Schema = {
    firstName: {
        in: ['body'],
        isString: { errorMessage: 'First name must be of type string' },
        exists: { errorMessage: 'First name must be defined' },
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: { errorMessage: 'Last name must be of type string' },
        exists: { errorMessage: 'Last name must be defined' },
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        isString: { errorMessage: 'Email must be of type string' },
        isEmail: { errorMessage: 'Email must complain to email struct' },
        exists: { errorMessage: 'Email must be defined' },
        trim: true,
        escape: true,
    },
    semester: {
        in: ['body'],
        isString: { errorMessage: 'Semester must be of type string' },
        exists: { errorMessage: 'Semester must be defined' },
        trim: true,
        escape: true,
    },
};

export const StudentUpdate: Schema = {
    firstName: {
        in: ['body'],
        isString: { errorMessage: 'First name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: { errorMessage: 'Last name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        isString: { errorMessage: 'Email must be of type string' },
        isEmail: { errorMessage: 'Email must complain to email struct' },
        optional: true,
        trim: true,
        escape: true,
    },
    semester: {
        in: ['body'],
        isString: { errorMessage: 'Semester must be of type strin' },
        optional: true,
        trim: true,
        escape: true,
    },
};
