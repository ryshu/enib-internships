"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Factorization methods to handle errors
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const student_model_1 = __importDefault(require("../../models/student.model"));
const internship_proc_1 = require("../processors/internship.proc");
/**
 * GET /students
 * Used to GET all students
 */
exports.getStudents = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20, archived } = req.query;
    student_model_1.default.getStudents({ archived }, { page, limit })
        .then((student) => (global_helper_1.checkContent(student, next) ? res.send(student) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /student
 * Used to create a new student entry
 */
exports.postStudent = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Get all data, we aren't afraid of having wrong data because we validate them before
    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        semester: req.body.semester,
        internships: req.body.internships && Array.isArray(req.body.internships)
            ? req.body.internships.map((i) => internship_proc_1.fullCopyInternship(i))
            : [],
    };
    // Insert student in database
    student_model_1.default.createStudent(student)
        .then((created) => res.send(created))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /student/:id
 * Used to select a student by ID
 */
exports.getStudent = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    student_model_1.default.getStudent(Number(req.params.id), req.query.archived)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * PUT /students/:id
 * Used to update student values
 */
exports.putStudent = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    student_model_1.default.updateStudent(Number(req.params.id), req.body)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * DELETE /students/:id
 * Used to remove a student from database
 */
exports.deleteStudent = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    student_model_1.default.removeStudent(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK)) // Return OK status
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /students/:id/internships
 * Used to get all internships of a student
 */
exports.getStudentInternships = internships_helper_1.generateGetInternships('studentId');
/**
 * POST /students/:id/internships/:internship_id/link
 * Link a internship to a student entry
 */
exports.linkStudentInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    student_model_1.default.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=students.ctrl.js.map