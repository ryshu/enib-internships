"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Internships_1 = __importDefault(require("../../models/Internships"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pagination_helper_1 = require("../helpers/pagination.helper");
const global_helper_1 = require("../helpers/global.helper");
/**
 * GET /internships
 * Used to GET all internships
 */
exports.getInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max;
    Internships_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return Internships_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((internships) => {
        if (global_helper_1.checkArrayContent(internships, next)) {
            return res.send({
                page,
                data: internships,
                length: internships.length,
                max,
            });
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internship
 * Used to create a new internship entry
 */
exports.postInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const internship = {
        subject: req.body.subject,
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address: req.body.address,
        additional: req.body.additional,
        isLanguageCourse: req.body.isLanguageCourse ? true : false,
        isValidated: req.body.isValidated ? true : false,
    };
    Internships_1.default.create(internship)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id
 * Used to select a internship by ID
 */
exports.getInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /internship/:id
 * Used to update internship values
 */
exports.putInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((internships) => {
        if (!global_helper_1.checkContent(internships, next)) {
            return undefined;
        }
        if (req.body.subject) {
            internships.set('subject', req.body.subject);
        }
        if (req.body.description) {
            internships.set('description', req.body.description);
        }
        if (req.body.country) {
            internships.set('country', req.body.country);
        }
        if (req.body.city) {
            internships.set('city', req.body.city);
        }
        if (req.body.postalCode) {
            internships.set('postalCode', req.body.postalCode);
        }
        if (req.body.address) {
            internships.set('address', req.body.address);
        }
        if (req.body.additional) {
            internships.set('additional', req.body.additional);
        }
        if (req.body.isLanguageCourse !== undefined) {
            internships.set('isLanguageCourse', req.body.isLanguageCourse ? true : false);
        }
        if (req.body.isValidated !== undefined) {
            internships.set('isValidated', req.body.isValidated ? true : false);
        }
        return internships.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * DELETE /internship/:id
 * Used to remove a internship from database
 */
exports.deleteInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
//# sourceMappingURL=internships.ctrl.js.map