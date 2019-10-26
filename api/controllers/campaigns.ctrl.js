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
const Campaigns_1 = __importDefault(require("../../models/Campaigns"));
const MentoringPropositions_1 = __importDefault(require("../../models/MentoringPropositions"));
const global_helper_1 = require("../helpers/global.helper");
const pagination_helper_1 = require("../helpers/pagination.helper");
const Mentors_1 = __importDefault(require("../../models/Mentors"));
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
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max;
    Campaigns_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return Campaigns_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((campaigns) => {
        if (global_helper_1.checkArrayContent(campaigns, next)) {
            return res.send({
                page,
                data: campaigns,
                length: campaigns.length,
                max,
            });
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /campaignss
 * Used to create a new campaign entry
 */
exports.postCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const campaign = {
        name: req.body.name,
        startAt: !req.body.startAt ? null : moment_1.default(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment_1.default(req.body.endAt).valueOf(),
        description: req.body.description,
        semester: req.body.semester,
        maxProposition: req.body.maxProposition ? req.body.maxProposition : 0,
    };
    Campaigns_1.default.create(campaign)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
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
    Campaigns_1.default.findByPk(req.params.id, {
        include: [{ model: MentoringPropositions_1.default, as: 'propositions' }],
    })
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
    Campaigns_1.default.findByPk(req.params.id)
        .then((campaign) => {
        if (!global_helper_1.checkContent(campaign, next)) {
            return undefined;
        }
        if (req.body.name) {
            campaign.set('name', req.body.name);
        }
        if (req.body.description) {
            campaign.set('description', req.body.description);
        }
        if (req.body.startAt) {
            campaign.set('startAt', req.body.startAt === 0 ? null : moment_1.default(req.body.startAt).valueOf());
        }
        if (req.body.endAt) {
            campaign.set('endAt', req.body.endAt === 0 ? null : moment_1.default(req.body.endAt).valueOf());
        }
        if (req.body.semester) {
            campaign.set('semester', req.body.semester);
        }
        if (req.body.maxProposition !== undefined) {
            campaign.set('maxProposition', req.body.maxProposition ? req.body.maxProposition : 0);
        }
        return campaign.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
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
    Campaigns_1.default.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
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
    Campaigns_1.default.findByPk(req.params.id, {
        include: [{ model: MentoringPropositions_1.default, as: 'propositions' }],
    })
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.propositions);
        }
    }))
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
    Campaigns_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addProposition(Number(req.params.mentoring_proposition_id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /campaigns/:id/mentors
 * Used to get all mentors of a campaign
 */
exports.getCampaignMentors = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Campaigns_1.default.findByPk(req.params.id, {
        include: [{ model: Mentors_1.default, as: 'mentors' }],
    })
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.mentors);
        }
    }))
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
    Campaigns_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.addMentor(Number(req.params.mentor_id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=campaigns.ctrl.js.map