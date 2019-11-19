"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Import mentors ORM class
const Campaigns_1 = __importDefault(require("../../models/Campaigns"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const Mentors_1 = __importDefault(require("../../models/Mentors"));
const MentoringPropositions_1 = __importDefault(require("../../models/MentoringPropositions"));
// Factorization methods to handle errors
const global_helper_1 = require("../helpers/global.helper");
const pagination_helper_1 = require("../helpers/pagination.helper");
const type_1 = require("../../utils/type");
const singleton_1 = __importDefault(require("../../statistics/singleton"));
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
    const { page = 1, limit = 20 } = req.query;
    let max;
    Mentors_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return Mentors_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((mentors) => {
        if (global_helper_1.checkArrayContent(mentors, next)) {
            return res.send({
                page,
                data: mentors,
                length: mentors.length,
                max,
            });
        }
    })
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
    };
    // Insert mentor in database
    Mentors_1.default.create(mentor)
        .then((created) => {
        singleton_1.default.addMentor();
        return res.send(created);
    })
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
    Mentors_1.default.findByPk(req.params.id)
        .then((val) => {
        // Check if we have content, and if so return it
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
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
    Mentors_1.default.findByPk(req.params.id)
        .then((mentor) => {
        if (!global_helper_1.checkContent(mentor, next)) {
            return undefined;
        }
        if (req.body.firstName) {
            mentor.set('firstName', req.body.firstName);
        }
        if (req.body.lastName) {
            mentor.set('lastName', req.body.lastName);
        }
        if (req.body.email) {
            mentor.set('email', req.body.email);
        }
        if (req.body.role && type_1.isMentorRole(req.body.role)) {
            mentor.set('role', req.body.role);
        }
        return mentor.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
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
    Mentors_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (val) {
            // Remove from stats
            const campaigns = yield val.getCampaigns();
            campaigns.forEach((c) => {
                singleton_1.default.unlinkMentor(c.id);
            });
            singleton_1.default.removeMentor();
            return val.destroy();
        }
        return undefined;
    })) // Call destroy on selected mentor
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
    Mentors_1.default.findByPk(req.params.id, {
        include: [{ model: Campaigns_1.default, as: 'campaigns' }],
    })
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.campaigns);
        }
    }))
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
    Mentors_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.addCampaign(Number(req.params.campaign_id));
                singleton_1.default.linkMentor(Number(req.params.campaign_id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
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
    const findOpts = { where: { mentorId: req.params.id } };
    let max;
    MentoringPropositions_1.default.count(findOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return MentoringPropositions_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
    })
        .then((mps) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkArrayContent(mps, next)) {
            return res.send({
                page,
                data: mps,
                length: mps.length,
                max,
            });
        }
    }))
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
    Mentors_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.addProposition(Number(req.params.mentoring_proposition_id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /mentors/:id/internships
 * Used to get all internships of a mentor
 */
exports.getMentorInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    const findOpts = { where: { mentorId: req.params.id } };
    let max;
    Internships_1.default.count(findOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return Internships_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
    })
        .then((mps) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkArrayContent(mps, next)) {
            return res.send({
                page,
                data: mps,
                length: mps.length,
                max,
            });
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
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
    Mentors_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.addInternship(Number(req.params.internship_id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=mentors.ctrl.js.map