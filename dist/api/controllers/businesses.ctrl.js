"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Businesses_1 = __importDefault(require("../../models/Businesses"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
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
    const { page = 1, limit = 20 } = req.query;
    let max;
    Businesses_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return Businesses_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((businesses) => {
        if (global_helper_1.checkArrayContent(businesses, next)) {
            return res.send({
                page,
                data: businesses,
                length: businesses.length,
                max,
            });
        }
    })
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
    Businesses_1.default.findByPk(req.params.id)
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
//# sourceMappingURL=businesses.ctrl.js.map