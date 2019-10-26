"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
exports.CampaignList = Object.assign({}, generic_val_1.paginateValidator);
exports.CampaignCreate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    description: {
        in: ['body'],
        isString: { errorMessage: 'Description must be of type string' },
        exists: { errorMessage: 'Description must be defined' },
        trim: true,
        escape: true,
    },
    startAt: {
        in: ['body'],
        isInt: { errorMessage: 'Start At must be of type timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    endAt: {
        in: ['body'],
        isInt: { errorMessage: 'End At must be of type timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    semester: {
        in: ['body'],
        isString: { errorMessage: 'Semester must be of type string' },
        exists: { errorMessage: 'Semester must be defined' },
        trim: true,
        escape: true,
    },
    maxProposition: {
        in: ['body'],
        isInt: { errorMessage: 'maxProposition must be an integer >= 0', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
};
exports.CampaignUpdate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    description: {
        in: ['body'],
        isString: { errorMessage: 'Description must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    startAt: {
        in: ['body'],
        isInt: { errorMessage: 'StartAt must be of type timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    endAt: {
        in: ['body'],
        isInt: { errorMessage: 'endAt must be of type timestamp', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
    semester: {
        in: ['body'],
        isString: { errorMessage: 'Semester must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    maxProposition: {
        in: ['body'],
        isInt: { errorMessage: 'MaxProposition must be an integer >= 0', options: { min: 0 } },
        optional: true,
        toInt: true,
    },
};
//# sourceMappingURL=campaigns.val.js.map