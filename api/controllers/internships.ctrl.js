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
const moment_1 = __importDefault(require("moment"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const Businesses_1 = __importDefault(require("../../models/Businesses"));
const InternshipTypes_1 = __importDefault(require("../../models/InternshipTypes"));
const Students_1 = __importDefault(require("../../models/Students"));
const Files_1 = __importDefault(require("../../models/Files"));
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
        isInternshipAbroad: req.body.isInternshipAbroad ? true : false,
        isValidated: req.body.isValidated ? true : false,
        startAt: !req.body.startAt ? null : moment_1.default(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment_1.default(req.body.endAt).valueOf(),
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
    Internships_1.default.findByPk(req.params.id, {
        include: [
            { model: Businesses_1.default, as: 'business' },
            { model: InternshipTypes_1.default, as: 'category' },
            { model: Students_1.default, as: 'student' },
            { model: Files_1.default, as: 'files' },
        ],
    })
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
        if (req.body.isInternshipAbroad !== undefined) {
            internships.set('isInternshipAbroad', req.body.isInternshipAbroad ? true : false);
        }
        if (req.body.isValidated !== undefined) {
            internships.set('isValidated', req.body.isValidated ? true : false);
        }
        if (req.body.startAt !== undefined) {
            internships.set('startAt', req.body.startAt === 0 ? null : moment_1.default(req.body.startAt).valueOf());
        }
        if (req.body.endAt !== undefined) {
            internships.set('endAt', req.body.endAt === 0 ? null : moment_1.default(req.body.endAt).valueOf());
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
/**
 * GET /internships/:id/businesses
 * Used to select a internship by ID and return his business
 */
exports.getInternshipBusiness = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id, { include: [{ model: Businesses_1.default, as: 'business' }] })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.business);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/businesses/:business_id/link
 * Used to create a link between internships and business
 */
exports.linkInternshipBusinesses = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.setBusiness(Number(req.params.business_id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internships/:id/internshipTypes
 * Used to select a internship by ID and return his category
 */
exports.getInternshipInternshipType = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id, { include: [{ model: InternshipTypes_1.default, as: 'category' }] })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.category);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/internshipTypes/:internship_type_id/link
 * Used to create a link between internships and internshipsTypes
 */
exports.linkInternshipInternshipTypes = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.setCategory(Number(req.params.internship_type_id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id/student
 * Used to select a internship by ID and return his student
 */
exports.getInternshipStudent = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id, { include: [{ model: Students_1.default, as: 'student' }] })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.student);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/student/:students_id/link
 * Used to link internship to a student
 */
exports.linkInternshipStudents = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Students_1.default.findByPk(req.params.student_id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addInternship(Number(req.params.id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id/files
 * Used to get all files of an internship
 */
exports.getInternshipFiles = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id, { include: [{ model: Files_1.default, as: 'files' }] })
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.files);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internships/:id/files/:files_id/link
 * Used to get all files of a internships
 */
exports.linkInternshipFiles = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addFile(Number(req.params.file_id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=internships.ctrl.js.map