"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const modes = ['published', 'propositions', 'self'];
exports.InternshipsList = Object.assign(Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.contriesValidator), { types: {
        in: ['query'],
        isArray: { errorMessage: 'Category filter list must be array' },
        optional: true,
        toArray: true,
    }, subject: {
        in: ['query'],
        isString: { errorMessage: 'Subject should be of type string' },
        optional: true,
        trim: true,
        escape: true,
    }, mode: {
        in: ['query'],
        isString: { errorMessage: 'Mode should be a string' },
        isIn: {
            options: [modes],
            errorMessage: `Mode should be included in [${modes.join(', ')}]`,
        },
        optional: true,
        trim: true,
    }, isAbroad: {
        in: ['query'],
        isBoolean: { errorMessage: 'Abroad should be of type boolean' },
        optional: true,
        toBoolean: true,
    }, isValidated: {
        in: ['query'],
        isBoolean: { errorMessage: 'Validated should be of type boolean' },
        optional: true,
        toBoolean: true,
    } });
exports.InternshipCreate = Object.assign(Object.assign({ subject: {
        in: ['body'],
        isString: { errorMessage: 'Subject must be of type string' },
        exists: { errorMessage: 'Subject must be defined' },
        trim: true,
        escape: true,
    }, description: {
        in: ['body'],
        isString: { errorMessage: 'Description must be of type string' },
        exists: { errorMessage: 'Description must be defined' },
        trim: true,
        escape: true,
    }, category: {
        in: ['body'],
        isInt: { options: { min: 0 }, errorMessage: 'Category ID should be an integer' },
        exists: { errorMessage: 'Category ID should be provide' },
        toInt: true,
    } }, generic_val_1.addressValidator), { isInternshipAbroad: {
        in: ['body'],
        isBoolean: { errorMessage: 'Internship abroad must be of type boolean' },
        optional: true,
        toBoolean: true,
    }, isValidated: {
        in: ['body'],
        isBoolean: { errorMessage: 'Validated must be of type boolean' },
        optional: true,
        toBoolean: true,
    }, isProposition: {
        in: ['body'],
        isBoolean: { errorMessage: 'Proposition must be of type boolean' },
        optional: true,
        toBoolean: true,
    }, isPublish: {
        in: ['body'],
        isBoolean: { errorMessage: 'Publish must be of type boolean' },
        optional: true,
        toBoolean: true,
    }, publishAt: {
        in: ['body'],
        isInt: { errorMessage: 'Publish at must be a timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    }, startAt: {
        in: ['body'],
        isInt: { errorMessage: 'Start at must be a timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    }, endAt: {
        in: ['body'],
        isInt: { errorMessage: 'End at must be a timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    } });
exports.InternshipUpdate = generic_val_1.replaceAllExistByOptional(exports.InternshipCreate);
//# sourceMappingURL=internships.val.js.map