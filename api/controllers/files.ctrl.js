"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// Import files ORM class
const Files_1 = __importDefault(require("../../models/Files"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Factorization methods to handle errors
const global_helper_1 = require("../helpers/global.helper");
const pagination_helper_1 = require("../helpers/pagination.helper");
/**
 * GET /files
 * Used to GET all files
 */
exports.getFiles = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max;
    Files_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return Files_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((files) => {
        if (global_helper_1.checkArrayContent(files, next)) {
            return res.send({
                page,
                data: files,
                length: files.length,
                max,
            });
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /file
 * Used to create a new file entry
 */
exports.postFile = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Get all data, we aren't afraid of having wrong data because we validate them before
    const file = {
        name: req.body.name,
        size: req.body.size,
        type: req.body.type,
        path: req.body.path,
    };
    // Insert file in database
    Files_1.default.create(file)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /file/:id
 * Used to select a file by ID
 */
exports.getFile = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Files_1.default.findByPk(req.params.id)
        .then((val) => {
        // Check if we have content, and if so return it
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /files/:id
 * Used to update file values
 */
exports.putFile = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Files_1.default.findByPk(req.params.id)
        .then((file) => {
        if (!global_helper_1.checkContent(file, next)) {
            return undefined;
        }
        if (req.body.name) {
            file.set('name', req.body.name);
        }
        if (req.body.size) {
            file.set('size', req.body.size);
        }
        if (req.body.type) {
            file.set('type', req.body.type);
        }
        if (req.body.path) {
            file.set('path', req.body.path);
        }
        return file.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * DELETE /files/:id
 * Used to remove a file from database
 */
exports.deleteFile = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Files_1.default.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined)) // Call destroy on selected file
        .then(() => res.sendStatus(http_status_codes_1.default.OK)) // Return OK status
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
//# sourceMappingURL=files.ctrl.js.map