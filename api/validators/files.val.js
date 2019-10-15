"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
exports.FileList = Object.assign({}, generic_val_1.paginateValidator);
exports.FileCreate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    size: {
        in: ['body'],
        isInt: { errorMessage: 'Size must be of type integer' },
        exists: { errorMessage: 'Size must be defined' },
        trim: true,
        escape: true,
    },
    type: {
        in: ['body'],
        isString: { errorMessage: 'Type must be of type string' },
        exists: { errorMessage: 'Type must be defined' },
        trim: true,
        escape: true,
    },
    path: {
        in: ['body'],
        isString: { errorMessage: 'Path must be of type string' },
        exists: { errorMessage: 'Path must be defined' },
        trim: true,
        escape: true,
    },
};
exports.FileUpdate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    size: {
        in: ['body'],
        isInt: { errorMessage: 'Size must be of type integer' },
        optional: true,
        trim: true,
        escape: true,
    },
    type: {
        in: ['body'],
        isString: { errorMessage: 'Type must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    path: {
        in: ['body'],
        isString: { errorMessage: 'Path must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};
//# sourceMappingURL=files.val.js.map