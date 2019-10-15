"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const MentoringPropositions_1 = __importDefault(require("../../models/MentoringPropositions"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pagination_helper_1 = require("../helpers/pagination.helper");
const global_helper_1 = require("../helpers/global.helper");
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
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max;
    MentoringPropositions_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return MentoringPropositions_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((mentoringPropositions) => {
        if (global_helper_1.checkArrayContent(mentoringPropositions, next)) {
            return res.send({
                page,
                data: mentoringPropositions,
                length: mentoringPropositions.length,
                max,
            });
        }
    })
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
    };
    MentoringPropositions_1.default.create(mentoringProposition)
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
    MentoringPropositions_1.default.findByPk(req.params.id)
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
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
    MentoringPropositions_1.default.findByPk(req.params.id)
        .then((mentoringProposition) => {
        if (!global_helper_1.checkContent(mentoringProposition, next)) {
            return undefined;
        }
        if (req.body.comment) {
            mentoringProposition.set('comment', req.body.comment);
        }
        return mentoringProposition.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
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
    MentoringPropositions_1.default.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
//# sourceMappingURL=mentoring.propositions.ctrl.js.map