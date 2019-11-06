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
const InternshipTypes_1 = __importDefault(require("../../models/InternshipTypes"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const Campaigns_1 = __importDefault(require("../../models/Campaigns"));
const global_helper_1 = require("../helpers/global.helper");
/**
 * GET /internshipTypes
 * Used to GET all internship types
 */
exports.getInternshipTypes = (req, res, next) => {
    InternshipTypes_1.default.findAll()
        .then((it) => {
        if (global_helper_1.checkArrayContent(it, next)) {
            return res.send(it);
        }
    })
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
    const internship = {
        label: req.body.label,
    };
    InternshipTypes_1.default.create(internship)
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
    InternshipTypes_1.default.findByPk(req.params.id)
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
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
    InternshipTypes_1.default.findByPk(req.params.id)
        .then((it) => {
        if (!global_helper_1.checkContent(it, next)) {
            return undefined;
        }
        if (req.body.label) {
            it.set('label', req.body.label);
        }
        return it.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
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
    InternshipTypes_1.default.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /internshipTypes/:id/internships
 * Used to select an internships type by ID and return list of internships link to it
 */
exports.getInternshipTypeInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    InternshipTypes_1.default.findByPk(req.params.id, {
        include: [{ model: Internships_1.default, as: 'internships' }],
    })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.internships);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
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
    InternshipTypes_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addInternship(Number(req.params.internship_id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
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
    InternshipTypes_1.default.findByPk(req.params.id, {
        include: [{ model: Campaigns_1.default, as: 'campaigns' }],
    })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.campaigns);
        }
    })
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
    InternshipTypes_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addCampaign(Number(req.params.campaign_id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=internship.types.ctrl.js.map