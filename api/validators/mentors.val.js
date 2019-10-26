"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const type_1 = require("../../utils/type");
exports.MentorList = Object.assign({}, generic_val_1.paginateValidator);
exports.MentorCreate = {
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
    role: {
        in: ['body'],
        isString: { errorMessage: 'Role must be of type string' },
        isIn: {
            options: [type_1.mentorRoles],
            errorMessage: `Role must be in [${type_1.mentorRoles.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
};
exports.MentorUpdate = {
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
    role: {
        in: ['body'],
        isString: { errorMessage: 'Role must be of type string' },
        isIn: {
            options: [type_1.mentorRoles],
            errorMessage: `Role must be in [${type_1.mentorRoles.join(', ')}]`,
        },
        optional: true,
        trim: true,
    },
};
//# sourceMappingURL=mentors.val.js.map