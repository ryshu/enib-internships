"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const global_helper_1 = require("../helpers/global.helper");
const mentoring_proposition_model_1 = __importDefault(require("../../models/mentoring.proposition.model"));
const internship_proc_1 = require("../processors/internship.proc");
const campaign_proc_1 = require("../processors/campaign.proc");
const mentor_proc_1 = require("../processors/mentor.proc");
/**
 * GET /mentoringPropositions
 * Used to GET all mentoringPropositions
 */
exports.getMentoringPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const { page = 1, limit = 20, archived } = req.query;
    mentoring_proposition_model_1.default.getMentoringPropositions({ archived }, { page, limit })
        .then((propositions) => global_helper_1.checkContent(propositions, next) ? res.send(propositions) : undefined)
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /mentoringPropositions
 * Used to create a new mentoringProposition entry
 */
exports.postMentoringProposition = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const mentoringProposition = {
        comment: req.body.comment,
        internship: internship_proc_1.fullCopyInternship(req.body.internship),
        campaign: campaign_proc_1.fullCopyCampaign(req.body.campaign),
        mentor: mentor_proc_1.fullCopyMentor(req.body.mentor),
    };
    mentoring_proposition_model_1.default.createMentoringProposition(mentoringProposition)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentoringPropositions/:id
 * Used to select a mentoringProposition by ID
 */
exports.getMentoringProposition = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.getMentoringProposition(Number(req.params.id), req.query.archived)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /mentoringPropositions/:id
 * Used to update mentoringProposition values
 */
exports.putMentoringProposition = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.updateMentoringProposition(Number(req.params.id), req.body)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * DELETE /mentoringPropositions/:id
 * Used to remove a mentoringProposition from database
 */
exports.deleteMentoringProposition = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.removeMentoringProposition(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /mentoringPropostions/:id/campaigns
 * Used to select a mentoring propositions by ID and return his campaign
 */
exports.getMentoringPropositionCampaigns = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.getMentoringProposition(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.campaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /mentoringPropostions/:id/campaigns/:campaign_id/link
 * Used to create a link between mentoring propositions and campaign
 */
exports.linkMentoringPropositionCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.linkToCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentoringPropostions/:id/mentors
 * Used to select a mentoring propositions by ID and return his mentor
 */
exports.getMentoringPropositionMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.getMentoringProposition(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.mentor) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /mentoringPropostions/:id/mentors/:mentor_id/link
 * Used to create a link between mentoring propositions and mentor
 */
exports.linkMentoringPropositionMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.linkToMentor(Number(req.params.id), Number(req.params.mentor_id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentoringPropostions/:id/internship
 * Used to select a mentoring propositions by ID and return his internship
 */
exports.getMentoringPropositionInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.getMentoringProposition(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.internship) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /mentoringPropostions/:id/internships/:internship_id/link
 * Used to create a link between mentoring propositions and internship
 */
exports.linkMentoringPropositionInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    mentoring_proposition_model_1.default.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=mentoring.propositions.ctrl.js.map