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
const sequelize_1 = __importDefault(require("sequelize"));
const Businesses_1 = __importDefault(require("../../models/Businesses"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const pagination_helper_1 = require("../helpers/pagination.helper");
const global_helper_1 = require("../helpers/global.helper");
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
    // Retrive query data
    const { page = 1, limit = 20, countries, name } = req.query;
    // Build query options
    const findOpts = {
        attributes: {
            include: [[sequelize_1.default.fn('count', sequelize_1.default.col(`internships.businessId`)), 'count']],
        },
        include: [
            {
                model: Internships_1.default,
                as: 'internships',
                attributes: [],
                duplicating: false,
            },
        ],
        where: {},
        group: [sequelize_1.default.col(`Businesses.id`)],
    };
    // Build count query options
    const countOpts = { where: {} };
    if (countries) {
        // If country list is given, add it to query
        // Sequelize will translate it by "country in countries"
        findOpts.where.country = countries;
        countOpts.where.country = countries;
    }
    if (name) {
        // If name filter is given, apply it using substring
        findOpts.where.name = { [sequelize_1.default.Op.substring]: name };
        countOpts.where.name = { [sequelize_1.default.Op.substring]: name };
    }
    let max;
    Businesses_1.default.count(countOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return Businesses_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
    })
        .then((businesses) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkArrayContent(businesses, next)) {
            return res.send({
                page,
                data: businesses,
                length: businesses.length,
                max,
            });
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
    };
    Businesses_1.default.create(business)
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
    Businesses_1.default.findByPk(req.params.id, { include: [{ model: Internships_1.default, as: 'internships' }] })
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
    Businesses_1.default.findByPk(req.params.id)
        .then((business) => {
        if (!global_helper_1.checkContent(business, next)) {
            return undefined;
        }
        if (req.body.name) {
            business.set('name', req.body.name);
        }
        if (req.body.country) {
            business.set('country', req.body.country);
        }
        if (req.body.city) {
            business.set('city', req.body.city);
        }
        if (req.body.postalCode) {
            business.set('postalCode', req.body.postalCode);
        }
        if (req.body.address) {
            business.set('address', req.body.address);
        }
        if (req.body.additional) {
            business.set('additional', req.body.additional);
        }
        return business.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
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
    Businesses_1.default.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /businesses/:id/internships
 * Used to get all internships of a business
 */
exports.getBusinessInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Businesses_1.default.findByPk(req.params.id, { include: [{ model: Internships_1.default, as: 'internships' }] })
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.internships);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
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
    Businesses_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addInternship(Number(req.params.internship_id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=businesses.ctrl.js.map