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
// Import students ORM class
const Students_1 = __importDefault(require("../../models/Students"));
const Internships_1 = __importDefault(require("../../models/Internships"));
// Factorization methods to handle errors
const global_helper_1 = require("../helpers/global.helper");
const pagination_helper_1 = require("../helpers/pagination.helper");
const singleton_1 = __importDefault(require("../../statistics/singleton"));
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
    const { page = 1, limit = 20 } = req.query;
    let max;
    Students_1.default.count()
        .then((rowNbr) => {
        max = rowNbr;
        return Students_1.default.findAll(pagination_helper_1.paginate({ page, limit }));
    })
        .then((students) => {
        if (global_helper_1.checkArrayContent(students, next)) {
            return res.send({
                page,
                data: students,
                length: students.length,
                max,
            });
        }
    })
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
    };
    // Insert student in database
    Students_1.default.create(student)
        .then((created) => {
        singleton_1.default.addStudent();
        return res.send(created);
    })
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
    Students_1.default.findByPk(req.params.id, { include: [{ model: Internships_1.default, as: 'internships' }] })
        .then((val) => {
        // Check if we have content, and if so return it
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val);
        }
    })
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
    Students_1.default.findByPk(req.params.id)
        .then((student) => {
        if (!global_helper_1.checkContent(student, next)) {
            return undefined;
        }
        if (req.body.firstName) {
            student.set('firstName', req.body.firstName);
        }
        if (req.body.lastName) {
            student.set('lastName', req.body.lastName);
        }
        if (req.body.email) {
            student.set('email', req.body.email);
        }
        if (req.body.semester) {
            student.set('semester', req.body.semester);
        }
        return student.save();
    })
        .then((updated) => {
        if (updated) {
            return res.send(updated);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
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
    Students_1.default.findByPk(req.params.id)
        .then((val) => {
        if (val) {
            singleton_1.default.removeStudent();
            return val.destroy();
        }
    }) // Call destroy on selected student
        .then(() => res.sendStatus(http_status_codes_1.default.OK)) // Return OK status
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /students/:id/internships
 * Used to get all internships of a student
 */
exports.getStudentInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    const findOpts = { where: { studentId: req.params.id } };
    let max;
    Internships_1.default.count(findOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return Internships_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
    })
        .then((mps) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkArrayContent(mps, next)) {
            return res.send({
                page,
                data: mps,
                length: mps.length,
                max,
            });
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
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
    Students_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.addInternship(Number(req.params.internship_id));
                const i = yield Internships_1.default.findByPk(req.params.internship_id);
                const cId = i.availableCampaign ||
                    i.validatedCampaign ||
                    undefined;
                if (cId) {
                    singleton_1.default.linkStudent(cId);
                }
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (_e) {
                return global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=students.ctrl.js.map