"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Import files ORM class
const files_model_1 = __importDefault(require("../../models/files.model"));
// Factorization methods to handle errors
const global_helper_1 = require("../helpers/global.helper");
const internship_proc_1 = require("../processors/internship.proc");
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
    // Retrieve query data
    const { page = 1, limit = 20, archived } = req.query;
    files_model_1.default.getFiles({ archived }, { page, limit })
        .then((data) => {
        if (global_helper_1.checkContent(data, next)) {
            return res.send(data);
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
        type: req.body.type,
        path: req.file.destination,
        internship: internship_proc_1.fullCopyInternship(req.body.internship),
    };
    // Insert file in database
    files_model_1.default.createFile(file)
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
    files_model_1.default.getFile(Number(req.params.id), req.query.archived)
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
    files_model_1.default.updateFile(Number(req.params.id), req.body)
        .then((updated) => {
        if (global_helper_1.checkContent(updated, next)) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
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
    files_model_1.default.removeFile(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK)) // Return OK status
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /files/:id/internships
 * Used to select a file by ID and return his internship
 */
exports.getFileInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    files_model_1.default.getFile(Number(req.params.id))
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.internship);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /files/:id/internships/:internship_id/link
 * Used to get all files of a internship
 */
exports.linkFilesInternship = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    files_model_1.default.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=files.ctrl.js.map