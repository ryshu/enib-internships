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
const moment_1 = __importDefault(require("moment"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const campaigns_model_1 = __importDefault(require("../../models/campaigns.model"));
const mentoring_proposition_model_1 = __importDefault(require("../../models/mentoring.proposition.model"));
const mentor_model_1 = __importDefault(require("../../models/mentor.model"));
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const internship_type_proc_1 = require("../processors/internship.type.proc");
const mentoring_proposition_proc_1 = require("../processors/mentoring.proposition.proc");
const internship_proc_1 = require("../processors/internship.proc");
const mentor_proc_1 = require("../processors/mentor.proc");
const error_1 = require("../../utils/error");
/**
 * GET /campaigns
 * Used to GET all campaigns
 */
exports.getCampaigns = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const { archived } = req.query;
    campaigns_model_1.default.getCampaigns({ archived })
        .then((campaigns) => {
        if (global_helper_1.checkArrayContent(campaigns, next)) {
            return res.send(campaigns);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /campaignss
 * Used to create a new campaign entry
 */
exports.postCampaign = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const campaign = {
        name: req.body.name,
        description: req.body.description,
        category: internship_type_proc_1.fullCopyInternshipType(req.body.category),
        semester: req.body.semester,
        maxProposition: req.body.maxProposition ? req.body.maxProposition : 0,
        isPublish: req.body.isPublish,
        startAt: !req.body.startAt ? null : moment_1.default(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment_1.default(req.body.endAt).valueOf(),
        propositions: req.body.propositions && Array.isArray(req.body.propositions)
            ? req.body.propositions.map((p) => mentoring_proposition_proc_1.fullCopyMentoringProposition(p))
            : [],
        availableInternships: req.body.availableInternships && Array.isArray(req.body.availableInternships)
            ? req.body.availableInternships.map((p) => internship_proc_1.fullCopyInternship(p))
            : [],
        validatedInternships: req.body.validatedInternships && Array.isArray(req.body.validatedInternships)
            ? req.body.validatedInternships.map((p) => internship_proc_1.fullCopyInternship(p))
            : [],
        mentors: req.body.mentors && Array.isArray(req.body.mentors)
            ? req.body.mentors.map((p) => mentor_proc_1.fullCopyMentor(p))
            : [],
    };
    let categoryId;
    if (!campaign.category) {
        // No category to create, check if we have any category id provide
        if (req.body.category &&
            req.body.category.id &&
            !Number.isNaN(Number(req.body.category.id))) {
            categoryId = Number(req.body.category.id);
        }
        else {
            return next(new error_1.APIError('No category provide, please provide a category', 400, 12000));
        }
    }
    campaigns_model_1.default.createCampaign(campaign)
        .then((created) => __awaiter(void 0, void 0, void 0, function* () {
        if (created && !Number.isNaN(Number(categoryId))) {
            // If category is given using an id, link internship to category before send reply
            const updated = yield campaigns_model_1.default.linkToCategory(created.id, categoryId);
            return res.send(updated);
        }
        return res.send(created);
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
});
/**
 * GET /campaigns/:id
 * Used to select a campaign by ID
 */
exports.getCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.getCampaign(Number(req.params.id), req.query.archived)
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /campaigns/:id
 * Used to update campaign values
 */
exports.putCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.updateCampaign(Number(req.params.id), req.body)
        .then((updated) => (global_helper_1.checkContent(updated, next) ? res.send(updated) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * DELETE /campaigns/:id
 * Used to remove a campaign from database
 */
exports.deleteCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.removeCampaign(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/mentoringPropositions
 * Used to get all mentoringPropositions of a campaign
 */
exports.getCampaignMentoringPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    mentoring_proposition_model_1.default.getMentoringPropositions({ campaignId: Number(req.params.id) }, { page, limit })
        .then((mps) => __awaiter(void 0, void 0, void 0, function* () { return (global_helper_1.checkContent(mps, next) ? res.send(mps) : undefined); }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/mentoringPropositions/:mentoring_proposition_id/link
 * Used to link a mentoring propositions with a campaign
 */
exports.linkCampaignMentoringPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.linkToProposition(Number(req.params.id), Number(req.params.mentoring_proposition_id))
        .then((campaign) => (global_helper_1.checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/availableInternships
 * Used to get all availableInternships of a campaign
 *
 * @notice This controller is generated using generateGetInternships method
 * which is used to avoid repeat internship code through application
 */
exports.getAvailableCampaignInternships = internships_helper_1.generateGetInternships('availableCampaignId');
/**
 * POST /campaigns/:id/availableInternships/:availableInternships_id/link
 * Used to link an internship with an availableCampaign
 */
exports.linkAvailableCampaignInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.linkToAvailableInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((campaign) => (global_helper_1.checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/validatedInternships
 * Used to get all validatedInternships of a campaign
 */
exports.getValidatedCampaignInternships = internships_helper_1.generateGetInternships('validatedCampaignId');
/**
 * GET /campaigns/:id/validatedCampaigns/:internship_id/link
 * Used to link an internship with a ValidatedCampaign
 */
exports.linkValidatedCampaignInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.linkToValidatedInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((campaign) => (global_helper_1.checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/internships
 * Used to get all internships of a campaign
 */
exports.getCampaignInternships = internships_helper_1.generateGetInternships('campaignId');
/**
 * GET /campaigns/:id/mentors
 * Used to get all mentors of a campaign
 */
exports.getCampaignMentors = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    mentor_model_1.default.getMentors({ campaignId: Number(req.params.id) }, { page, limit })
        .then((data) => (global_helper_1.checkContent(data, next) ? res.send(data) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/mentors/:mentor_id/link
 * Used to link a mentor with a campaign
 */
exports.linkCampaignMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.linkToMentor(Number(req.params.id), Number(req.params.mentor_id))
        .then((campaign) => (global_helper_1.checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/internshipTypes
 * Used to select a campaign by ID and return his category
 */
exports.getCampaignInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.getCampaign(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.category) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /campaigns/:id/internshipTypes/:internship_type_id/link
 * Used to create a link between campaigns and internshipsTypes
 */
exports.linkCampaignInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    campaigns_model_1.default.linkToCategory(Number(req.params.id), Number(req.params.internship_type_id))
        .then((campaign) => (global_helper_1.checkContent(campaign, next) ? res.send(campaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=campaigns.ctrl.js.map