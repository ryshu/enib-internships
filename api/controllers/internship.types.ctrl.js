"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const internship_type_mode_1 = __importDefault(require("../../models/internship.type.mode"));
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const internship_proc_1 = require("../processors/internship.proc");
const campaign_proc_1 = require("../processors/campaign.proc");
/**
 * GET /internshipTypes
 * Used to GET all internship types
 */
exports.getInternshipTypes = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const { archived } = req.query;
    internship_type_mode_1.default.getInternshipTypes({ archived })
        .then((types) => (global_helper_1.checkArrayContent(types, next) ? res.send(types) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internshipTypes
 * Used to create a new internship type entry
 */
exports.postInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const type = {
        label: req.body.label,
        campaigns: req.body.campaigns && Array.isArray(req.body.campaigns)
            ? req.body.campaigns.map((i) => campaign_proc_1.fullCopyCampaign(i))
            : [],
        internships: req.body.internships && Array.isArray(req.body.internships)
            ? req.body.internships.map((i) => internship_proc_1.fullCopyInternship(i))
            : [],
    };
    internship_type_mode_1.default.createInternshipType(type)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internshipTypes/:id
 * Used to select a internship type by ID
 */
exports.getInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_type_mode_1.default.getInternshipType(Number(req.params.id), req.query.archived)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /internshipTypes/:id
 * Used to update internship type values
 */
exports.putInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_type_mode_1.default.updateInternshipType(Number(req.params.id), req.body)
        .then((updated) => (global_helper_1.checkContent(updated, next) ? res.send(updated) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * DELETE /internshipTypes/:id
 * Used to remove a internship type from database
 */
exports.deleteInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_type_mode_1.default.removeInternshipType(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /internshipTypes/:id/internships
 * Used to select an internships type by ID and return list of internships link to it
 */
exports.getInternshipTypeInternships = internships_helper_1.generateGetInternships('categoryId');
/**
 * POST /internshipTypes/:id/internships/:internship_id/link
 * Used to link internship types to internships
 */
exports.linkInternshipTypeInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_type_mode_1.default.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((type) => (global_helper_1.checkContent(type, next) ? res.send(type) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internshipTypes/:id/campaigns
 * Used to select an campaigns type by ID and return list of campaigns link to it
 */
exports.getInternshipTypeCampaigns = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_type_mode_1.default.getInternshipType(Number(req.params.id))
        .then((data) => (global_helper_1.checkContent(data, next) ? res.send(data.campaigns) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internshipTypes/:id/campaigns/:campaign_id/link
 * Used to link campaign types to campaigns
 */
exports.linkInternshipTypeCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_type_mode_1.default.linkToCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((type) => (global_helper_1.checkContent(type, next) ? res.send(type) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=internship.types.ctrl.js.map