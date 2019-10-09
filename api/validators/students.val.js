"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCreate = {
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
exports.StudentUpdate = {
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
exports.StudentList = {
    page: {
        in: ['query'],
        isInt: { errorMessage: 'Page need to be an integer' },
        optional: true,
        toInt: true,
    },
    limit: {
        in: ['query'],
        isInt: { errorMessage: 'Limit need to be an integer' },
        optional: true,
        toInt: true,
    },
};
//# sourceMappingURL=students.val.js.map