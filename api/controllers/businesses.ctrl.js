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
const business_model_1 = __importDefault(require("../../models/business.model"));
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const internship_proc_1 = require("../processors/internship.proc");
/**
 * GET /businesses
 * Used to GET all businesses
 */
exports.getBusinesses = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrieve query data
    const { page = 1, limit = 20, countries, name, archived } = req.query;
    business_model_1.default.getBusinesses({ name, countries, archived }, { page, limit })
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(data, next)) {
            return res.send(data);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /businesses
 * Used to create a new business entry
 */
exports.postBusiness = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const business = {
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address: req.body.address,
        additional: req.body.additional,
        // Copy internships if provided to also create them in DB
        internships: req.body.internships && Array.isArray(req.body.internships)
            ? req.body.internships.map((i) => internship_proc_1.fullCopyInternship(i))
            : [],
    };
    business_model_1.default.createBusiness(business)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /businesses/:id
 * Used to select a business by ID
 */
exports.getBusiness = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    business_model_1.default.getBusiness(Number(req.params.id), req.query.archived)
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /businesses/:id
 * Used to update business values
 */
exports.putBusiness = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    business_model_1.default.updateBusiness(Number(req.params.id), req.body)
        .then((business) => {
        if (global_helper_1.checkContent(business, next)) {
            return res.send(business);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * DELETE /businesses/:id
 * Used to remove a business from database
 */
exports.deleteBusiness = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    business_model_1.default.removeBusiness(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /businesses/:id/internships
 * Used to get all internships of a business
 */
exports.getBusinessInternships = internships_helper_1.generateGetInternships('businessId');
/**
 * GET /businesses/:id/internships/:internship_id/link
 * Used to get all internships of a business
 */
exports.linkBusinessInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    business_model_1.default.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=businesses.ctrl.js.map