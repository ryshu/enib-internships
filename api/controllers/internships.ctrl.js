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
const internship_model_1 = __importDefault(require("../../models/internship.model"));
const files_model_1 = __importDefault(require("../../models/files.model"));
const mentoring_proposition_model_1 = __importDefault(require("../../models/mentoring.proposition.model"));
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const businesse_proc_1 = require("../processors/businesse.proc");
const campaign_proc_1 = require("../processors/campaign.proc");
const file_proc_1 = require("../processors/file.proc");
const internship_type_proc_1 = require("../processors/internship.type.proc");
const mentor_proc_1 = require("../processors/mentor.proc");
const mentoring_proposition_proc_1 = require("../processors/mentoring.proposition.proc");
const student_proc_1 = require("../processors/student.proc");
const error_1 = require("../../utils/error");
/**
 * GET /internships
 * Used to GET all internships
 */
exports.getInternships = internships_helper_1.generateGetInternships();
/**
 * POST /internship
 * Used to create a new internship entry
 */
exports.postInternship = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        postalCode: req.body.postalCode || '',
        address: req.body.address || '',
        additional: req.body.additional || '',
        isInternshipAbroad: req.body.isInternshipAbroad ? true : false,
        state: "waiting" /* WAITING */,
        result: "unknown" /* UNKNOWN */,
        publishAt: !req.body.publishAt || req.session.info.role !== 'admin'
            ? null
            : moment_1.default(req.body.publishAt).valueOf(),
        startAt: !req.body.startAt ? null : moment_1.default(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment_1.default(req.body.endAt).valueOf(),
        business: businesse_proc_1.fullCopyBusiness(req.body.business),
        category: internship_type_proc_1.fullCopyInternshipType(req.body.category),
        mentor: mentor_proc_1.fullCopyMentor(req.body.mentor),
        student: student_proc_1.fullCopyStudent(req.body.student),
        availableCampaign: campaign_proc_1.fullCopyCampaign(req.body.availableCampaign),
        validatedCampaign: campaign_proc_1.fullCopyCampaign(req.body.validatedCampaign),
        files: req.body.files && Array.isArray(req.body.files)
            ? req.body.files.map((i) => file_proc_1.fullCopyFile(i))
            : [],
        propositions: req.body.propositions && Array.isArray(req.body.propositions)
            ? req.body.propositions.map((i) => mentoring_proposition_proc_1.fullCopyMentoringProposition(i))
            : [],
    };
    let categoryId;
    if (!internship.category) {
        // No category to create, check if we have any category id provide
        if (req.body.category &&
            req.body.category.id &&
            !Number.isNaN(Number(req.body.category.id))) {
            categoryId = Number(req.body.category.id);
        }
        else {
            return next(new error_1.APIError('No category provide, please provide a category', 400, 12000));
        }
    }
    internship_model_1.default.createInternship(internship)
        .then((created) => __awaiter(void 0, void 0, void 0, function* () {
        let result = created;
        if (created && !Number.isNaN(Number(categoryId))) {
            // If category is given using an id, link internship to category before send reply
            result = (yield internship_model_1.default.linkToCategory(created.id, categoryId)) || created;
        }
        if (req.body.state === "published" /* PUBLISHED */ && req.session.info.role === 'admin') {
            // If user is admin and mode need to be set to 'published', we publish this internship offer
            const handler = yield internship_model_1.default.getHandler(created);
            if (!global_helper_1.checkContent(handler, next)) {
                return;
            }
            result = (yield handler.toPublished()).toJSON();
        }
        return res.send(result);
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
});
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
    internship_model_1.default.getInternship(Number(req.params.id), req.query.archived)
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
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
    internship_model_1.default.updateInternship(Number(req.params.id), req.body)
        .then((updated) => (global_helper_1.checkContent(updated, next) ? res.send(updated) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
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
    internship_model_1.default.removeInternship(Number(req.params.id))
        .then(() => res.sendStatus(http_status_codes_1.default.OK))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internship/:id/fsm
 * Used to update an internship status
 */
exports.upadteFSMInternship = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Validate query before any processing
    const query = {
        state: req.body.state,
        studentId: req.body.studentId ? Number(req.body.studentId) : undefined,
        mentorId: req.body.mentorId ? Number(req.body.mentorId) : undefined,
        campaignId: req.body.campaignId ? Number(req.body.campaignId) : undefined,
        endAt: req.body.endAt ? moment_1.default(req.body.endAt).valueOf() : undefined,
        result: req.body.result,
    };
    if (query.state === "attributed_mentor" /* ATTRIBUTED_MENTOR */ && !query.mentorId) {
        next(new error_1.APIError(`Change to '${"attributed_mentor" /* ATTRIBUTED_MENTOR */}' required you to provide the mentor identifier`, 400, 12000));
    }
    else if (query.state === "attributed_student" /* ATTRIBUTED_STUDENT */ && !query.studentId) {
        next(new error_1.APIError(`Change to '${"attributed_student" /* ATTRIBUTED_STUDENT */}' required you to provide the student identifier`, 400, 12000));
    }
    else if (query.state === "available_campaign" /* AVAILABLE_CAMPAIGN */ && !query.campaignId) {
        next(new error_1.APIError(`Change to '${"available_campaign" /* AVAILABLE_CAMPAIGN */}' required you to provide the campaign identifier`, 400, 12000));
    }
    else if (query.state === "archived" /* ARCHIVED */ && !query.result) {
        next(new error_1.APIError(`Change to '${"archived" /* ARCHIVED */}' required you to provide the result identifier`, 400, 12000));
    }
    try {
        const handler = yield internship_model_1.default.getHandler(Number(req.params.id));
        if (!global_helper_1.checkContent(handler, next)) {
            return;
        }
        switch (query.state) {
            case "archived" /* ARCHIVED */:
                yield handler.archive(query.result);
                break;
            case "attributed_mentor" /* ATTRIBUTED_MENTOR */:
                yield handler.toAttributedMentor(query.mentorId);
                break;
            case "attributed_student" /* ATTRIBUTED_STUDENT */:
                yield handler.toAttributedStudent(query.studentId);
                break;
            case "available_campaign" /* AVAILABLE_CAMPAIGN */:
                yield handler.toCampaignAvailable(query.campaignId);
                break;
            case "published" /* PUBLISHED */:
                yield handler.toPublished();
                break;
            case "running" /* RUNNING */:
                yield handler.toRunning(query.endAt);
                break;
            case "validation" /* VALIDATION */:
                yield handler.toValidation();
                break;
            case "waiting" /* WAITING */:
                yield handler.toWaiting();
                break;
            default:
                break;
        }
        return res.send(handler.toJSON());
    }
    catch (error) {
        if (error instanceof error_1.APIError) {
            next(error);
        }
        else {
            global_helper_1.UNPROCESSABLE_ENTITY(next, error);
        }
    }
});
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
    internship_model_1.default.getInternship(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.business) : undefined))
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
    internship_model_1.default.linkToBusiness(Number(req.params.id), Number(req.params.business_id))
        .then((internship) => (global_helper_1.checkContent(internship, next) ? res.send(internship) : undefined))
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
    internship_model_1.default.getInternship(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.category) : undefined))
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
    internship_model_1.default.linkToCategory(Number(req.params.id), Number(req.params.internship_type_id))
        .then((internship) => (global_helper_1.checkContent(internship, next) ? res.send(internship) : undefined))
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
    internship_model_1.default.getInternship(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.student) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/student/:student_id/link
 * Used to link internship to a student
 */
exports.linkInternshipStudents = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.getHandler(Number(req.params.id))
        .then((handler) => __awaiter(void 0, void 0, void 0, function* () {
        if (!global_helper_1.checkContent(handler, next)) {
            return;
        }
        yield handler.toAttributedStudent(Number(req.params.student_id));
        return res.send(handler.toJSON());
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
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    files_model_1.default.getFiles({ internshipId: Number(req.params.id) }, { page, limit })
        .then((files) => (global_helper_1.checkContent(files, next) ? res.send(files) : undefined))
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
    internship_model_1.default.linkToFile(Number(req.params.id), Number(req.params.file_id))
        .then((internship) => (global_helper_1.checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id/availableCampaign
 * Used to select a internship by ID and return his availableCampaign
 */
exports.getAvailabletInternshipCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.getInternship(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.availableCampaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/campaign/:campaign_id/link
 * Used to link internship to a campaign
 */
exports.linkAvailableCampaignInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.getHandler(Number(req.params.id))
        .then((handler) => __awaiter(void 0, void 0, void 0, function* () {
        if (!global_helper_1.checkContent(handler, next)) {
            return;
        }
        yield handler.toCampaignAvailable(Number(req.params.campaign_id));
        return res.send(handler.toJSON());
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id/campaign
 * Used to select a internship by ID and return his validatedCampaign
 */
exports.getValidatedInternshipCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.getInternship(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.validatedCampaign) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id/propositions
 * Used to get all propositions of an internship
 */
exports.getInternshipPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    mentoring_proposition_model_1.default.getMentoringPropositions({ internshipId: Number(req.params.id) }, { page, limit })
        .then((propositions) => global_helper_1.checkContent(propositions, next) ? res.send(propositions) : undefined)
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internships/:id/propositions/:mentoring_proposition_id/link
 * Used to get all propositions of a internships
 */
exports.linkInternshipPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.linkToProposition(Number(req.params.id), Number(req.params.mentoring_proposition_id))
        .then((internship) => (global_helper_1.checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * GET /internship/:id/mentors
 * Used to select a internship by ID and return his mentor
 */
exports.getInternshipMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.getInternship(Number(req.params.id))
        .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val.mentor) : undefined))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/mentors/:mentor_id/link
 * Used to link internship to a mentor
 */
exports.linkInternshipMentor = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    internship_model_1.default.getHandler(Number(req.params.id))
        .then((handler) => __awaiter(void 0, void 0, void 0, function* () {
        if (!global_helper_1.checkContent(handler, next)) {
            return;
        }
        yield handler.toAttributedMentor(Number(req.params.mentor_id));
        return res.send(handler.toJSON());
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
//# sourceMappingURL=internships.ctrl.js.map