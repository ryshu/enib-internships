"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessCreate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    country: {
        in: ['body'],
        isString: { errorMessage: 'Country must be of type string' },
        exists: { errorMessage: 'Country must be defined' },
        trim: true,
        escape: true,
    },
    city: {
        in: ['body'],
        isString: { errorMessage: 'City must be of type string' },
        exists: { errorMessage: 'City must be defined' },
        trim: true,
        escape: true,
    },
    postalCode: {
        in: ['body'],
        isString: { errorMessage: 'Postal code must be of type string' },
        exists: { errorMessage: 'Postal code must be defined' },
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        isString: { errorMessage: 'Address must be of type string' },
        exists: { errorMessage: 'Address must be defined' },
        trim: true,
        escape: true,
    },
    additional: {
        in: ['body'],
        isString: { errorMessage: 'Additional must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};
exports.BusinessUpdate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    country: {
        in: ['body'],
        isString: { errorMessage: 'Country must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    city: {
        in: ['body'],
        isString: { errorMessage: 'City must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    postalCode: {
        in: ['body'],
        isString: { errorMessage: 'Postal Code must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        isString: { errorMessage: 'Address must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    additional: {
        in: ['body'],
        isString: { errorMessage: 'Additional must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};
//# sourceMappingURL=businneses.val.js.map