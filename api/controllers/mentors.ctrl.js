"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mentor_model_1 = __importDefault(require("../../models/mentor.model"));
const mentoring_proposition_model_1 = __importDefault(require("../../models/mentoring.proposition.model"));
// Factorization methods to handle errors
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const type_1 = require("../../utils/type");
const campaign_proc_1 = require("../processors/campaign.proc");
const mentoring_proposition_proc_1 = require("../processors/mentoring.proposition.proc");
const internship_proc_1 = require("../processors/internship.proc");
/**
 * GET /mentors
 * Used to GET all mentors
 */
exports.getMentors = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrieve all mentors from database
    // Retrive query data
    const { page = 1, limit = 20, archived } = req.query;
    mentor_model_1.default.getMentors({ archived }, { page, limit })
        .then((mentor) => (global_helper_1.checkContent(mentor, next) ? res.send(mentor) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /mentors
 * Used to create a new mentor entry
 */
exports.postMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Get all data, we aren't afraid of having wrong data because we validate them before
    const mentor = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role && type_1.isMentorRole(req.body.role) ? req.body.role : 'default',
        campaigns: req.body.campaigns && Array.isArray(req.body.campaigns)
            ? req.body.campaigns.map((i) => campaign_proc_1.fullCopyCampaign(i))
            : [],
        propositions: req.body.propositions && Array.isArray(req.body.propositions)
            ? req.body.propositions.map((i) => mentoring_proposition_proc_1.fullCopyMentoringProposition(i))
            : [],
        internships: req.body.internships && Array.isArray(req.body.internships)
            ? req.body.internships.map((i) => internship_proc_1.fullCopyInternship(i))
            : [],
    };
    mentor_model_1.default.createMentor(mentor)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentors/:id
 * Used to select a mentors by ID
 */
exports.getMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Select mentor by ID into database
    mentor_model_1.default.getMentor(Number(req.params.id), req.query.archived)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /mentors/:id
 * Used to update mentor values
 */
exports.putMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentor_model_1.default.updateMentor(Number(req.params.id), req.body)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * DELETE /mentors/:id
 * Used to remove a mentor from database
 */
exports.deleteMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentor_model_1.default.removeMentor(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK)) // Return OK status
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /mentors/:id/campaigns
 * Used to get all campaigns of a mentor
 */
exports.getMentorCampaigns = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentor_model_1.default.getMentor(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.campaigns) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentors/:id/campaigns/:campaign_id/link
 * Used to link a mentor with a campaign
 */
exports.linkMentorCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentor_model_1.default.linkToCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((mentor) => (global_helper_1.checkContent(mentor, next) ? res.send(mentor) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentors/:id/propositions
 * Used to get all propositions of a mentor
 */
exports.getMentorPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    mentoring_proposition_model_1.default.getMentoringPropositions({ mentorId: Number(req.params.id) }, { page, limit })
        .then((propositions) => global_helper_1.checkContent(propositions, next) ? res.send(propositions) : undefined)
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentors/:id/propositions/:mentoring_proposition_id/link
 * Used to link a mentor with a campaign
 */
exports.linkMentorProposition = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentor_model_1.default.linkToProposition(Number(req.params.id), Number(req.params.mentoring_proposition_id))
        .then((mentor) => (global_helper_1.checkContent(mentor, next) ? res.send(mentor) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentors/:id/internships
 * Used to get all internships of a mentor
 */
exports.getMentorInternships = internships_helper_1.generateGetInternships('mentorId');
/**
 * GET /mentors/:id/internships/:internship_id/link
 * Used to link a mentor with an internship
 */
exports.linkMentorInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentor_model_1.default.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((mentor) => (global_helper_1.checkContent(mentor, next) ? res.send(mentor) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=mentors.ctrl.js.map