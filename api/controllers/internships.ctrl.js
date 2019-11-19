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
const sequelize_1 = __importDefault(require("sequelize"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const Businesses_1 = __importDefault(require("../../models/Businesses"));
const InternshipTypes_1 = __importDefault(require("../../models/InternshipTypes"));
const Students_1 = __importDefault(require("../../models/Students"));
const Files_1 = __importDefault(require("../../models/Files"));
const MentoringPropositions_1 = __importDefault(require("../../models/MentoringPropositions"));
const Mentors_1 = __importDefault(require("../../models/Mentors"));
const Campaigns_1 = __importDefault(require("../../models/Campaigns"));
const pagination_helper_1 = require("../helpers/pagination.helper");
const lodash_1 = require("lodash");
const global_helper_1 = require("../helpers/global.helper");
const internships_helper_1 = require("../helpers/internships.helper");
const singleton_1 = __importDefault(require("../../statistics/singleton"));
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
    const { page = 1, limit = 20, countries, types, subject, mode = 'published', isAbroad, isValidated, } = req.query;
    const findOpts = {
        where: {
            isProposition: mode === 'propositions',
            isPublish: mode === 'published',
        },
        include: [{ model: InternshipTypes_1.default, as: 'category', duplicating: false }],
        group: [sequelize_1.default.col(`Internships.id`)],
    };
    if (mode === 'self') {
        findOpts.where.mentorId = req.session.info.id;
    }
    if (countries) {
        // If country list is given, add it to query
        // Sequelize will translate it by "country in countries"
        findOpts.where.country = countries;
    }
    if (types) {
        // If category list is given, add it to query
        // Sequelize will translate it by "category in types"
        findOpts.where.categoryId = types;
    }
    if (!!isAbroad) {
        findOpts.where.isInternshipAbroad = true;
    }
    if (!!isValidated) {
        findOpts.where.isValidated = true;
    }
    else if (req.session.info.role !== 'admin' && mode !== 'self') {
        // If user isn't admin and doesn't want only validated,
        // give him only not validated internships
        findOpts.where.isValidated = false;
    }
    if (subject) {
        // If subject filter is given, apply it using substring
        findOpts.where.subject = { [sequelize_1.default.Op.substring]: subject };
    }
    // Build count query options
    const countOpts = {
        where: lodash_1.cloneDeep(findOpts.where),
        include: [{ model: InternshipTypes_1.default, as: 'category', attributes: [], duplicating: false }],
    };
    let max;
    Internships_1.default.count(countOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return Internships_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
    })
        .then((internships) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkArrayContent(internships, next)) {
            return res.send({
                page,
                data: internships,
                length: internships.length,
                max,
            });
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
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
        postalCode: req.body.postalCode,
        address: req.body.address,
        additional: req.body.additional,
        isInternshipAbroad: req.body.isInternshipAbroad ? true : false,
        // TODO: More controled affectation
        isProposition: req.body.isProposition || req.session.info.role !== 'admin' ? true : false,
        isPublish: req.body.isPublish && req.session.info.role === 'admin' ? true : false,
        isValidated: req.body.isValidated && req.session.info.role === 'admin' ? true : false,
        state: _getInternshipState(req),
        publishAt: !req.body.publishAt || req.session.info.role !== 'admin'
            ? null
            : moment_1.default(req.body.publishAt).valueOf(),
        startAt: !req.body.startAt ? null : moment_1.default(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment_1.default(req.body.endAt).valueOf(),
    };
    try {
        const category = yield InternshipTypes_1.default.findByPk(req.body.category);
        if (!global_helper_1.checkContent(category, next)) {
            return undefined;
        }
        const created = yield Internships_1.default.create(internship);
        yield created.setCategory(category);
        // change stats
        singleton_1.default.stateChange(created.state);
        return res.send(created);
    }
    catch (error) {
        global_helper_1.UNPROCESSABLE_ENTITY(next, error);
    }
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
    Internships_1.default.findByPk(req.params.id, {
        include: [
            { model: Businesses_1.default, as: 'business' },
            { model: InternshipTypes_1.default, as: 'category' },
            { model: Campaigns_1.default, as: 'availableCampaign' },
            { model: Campaigns_1.default, as: 'validatedCampaign' },
            { model: Mentors_1.default, as: 'mentor' },
            { model: MentoringPropositions_1.default, as: 'propositions' },
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
        .then((internships) => __awaiter(void 0, void 0, void 0, function* () {
        if (!global_helper_1.checkContent(internships, next)) {
            return undefined;
        }
        const cId = internships.availableCampaign ||
            internships.validatedCampaign ||
            undefined;
        if (req.body.subject) {
            internships.set('subject', req.body.subject);
        }
        if (req.body.description) {
            internships.set('description', req.body.description);
        }
        if (req.body.category) {
            try {
                const category = yield InternshipTypes_1.default.findByPk(req.body.category);
                if (category) {
                    yield internships.setCategory(category);
                }
            }
            catch (_e) {
                // Pass, don't thrown any error
            }
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
        if (req.body.isProposition !== undefined && req.session.info.role === 'admin') {
            internships.set('isProposition', req.body.isProposition ? true : false);
            if (req.body.isProposition) {
                singleton_1.default.stateChange("suggest" /* SUGGESTED */, internships.state, cId);
            }
            else {
                singleton_1.default.stateChange("waiting" /* WAITING */, internships.state, cId);
            }
        }
        if (req.body.isPublish !== undefined && req.session.info.role === 'admin') {
            internships.set('isPublish', req.body.isPublish ? true : false);
            if (req.body.isPublish) {
                singleton_1.default.stateChange("available" /* AVAILABLE */, internships.state, cId);
            }
            else {
                singleton_1.default.stateChange("waiting" /* WAITING */, internships.state, cId);
            }
        }
        if (req.body.isValidated !== undefined && req.session.info.role === 'admin') {
            internships.set('isValidated', req.body.isValidated ? true : false);
            if (req.body.isValidated) {
                singleton_1.default.stateChange("validated" /* VALIDATED */, internships.state, cId);
            }
        }
        if (req.body.publishAt !== undefined && req.session.info.role === 'admin') {
            internships.set('publishAt', req.body.publishAt === 0 ? null : moment_1.default(req.body.publishAt).valueOf());
        }
        if (req.body.startAt !== undefined) {
            internships.set('startAt', req.body.startAt === 0 ? null : moment_1.default(req.body.startAt).valueOf());
        }
        if (req.body.endAt !== undefined) {
            internships.set('endAt', req.body.endAt === 0 ? null : moment_1.default(req.body.endAt).valueOf());
        }
        return internships.save();
    }))
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
        .then((val) => {
        if (val) {
            singleton_1.default.stateRemove(val.state, -1, val.availableCampaign ||
                val.validatedCampaign ||
                undefined);
            return val.destroy();
        }
        return undefined;
    })
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
            const i = yield Internships_1.default.findByPk(req.params.id);
            singleton_1.default.addStudent(i.availableCampaign || i.validatedCampaign || undefined);
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
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    const findOpts = { where: { internshipId: req.params.id } };
    let max;
    Files_1.default.count(findOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return Files_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
    })
        .then((files) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkArrayContent(files, next)) {
            return res.send({
                page,
                data: files,
                length: files.length,
                max,
            });
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
    Internships_1.default.findByPk(req.params.id, {
        include: [{ model: Campaigns_1.default, as: 'availableCampaign' }],
    })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.availableCampaign);
        }
    })
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
    Internships_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.setAvailableCampaign(Number(req.params.campaign_id));
                yield internships_helper_1.updateInternshipStatus(val, "available" /* AVAILABLE */);
                singleton_1.default.stateRemove("available" /* AVAILABLE */, 1);
                singleton_1.default.stateAdd("available" /* AVAILABLE */, 1, Number(req.params.campaign_id));
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
 * GET /internship/:id/campaign
 * Used to select a internship by ID and return his validatedCampaign
 */
exports.getValidatedInternshipCampaign = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id, {
        include: [{ model: Campaigns_1.default, as: 'validatedCampaign' }],
    })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.validatedCampaign);
        }
    })
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /internships/:id/validatedCampaign/:validatedCampaign_id/link
 * Used to link internship to a validatedCampaign
 */
exports.linkValidatedCampaignInternships = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.setValidatedCampaign(Number(req.params.campaign_id));
                yield internships_helper_1.updateInternshipStatus(val, "attributed" /* ATTRIBUTED */);
                singleton_1.default.stateRemove("attributed" /* ATTRIBUTED */, 1);
                singleton_1.default.stateAdd("attributed" /* ATTRIBUTED */, 1, Number(req.params.campaign_id));
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
    const findOpts = { where: { internshipId: req.params.id } };
    let max;
    MentoringPropositions_1.default.count(findOpts)
        .then((rowNbr) => {
        max = rowNbr;
        return MentoringPropositions_1.default.findAll(pagination_helper_1.paginate({ page, limit }, findOpts));
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
 * GET /internships/:id/propositions/:mentoring_proposition_id/link
 * Used to get all propositions of a internships
 */
exports.linkInternshipPropositions = (req, res, next) => {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    Internships_1.default.findByPk(req.params.id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            yield val.addProposition(Number(req.params.mentoring_proposition_id));
            return res.sendStatus(http_status_codes_1.default.OK);
        }
    }))
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
    Internships_1.default.findByPk(req.params.id, { include: [{ model: Mentors_1.default, as: 'mentor' }] })
        .then((val) => {
        if (global_helper_1.checkContent(val, next)) {
            return res.send(val.mentor);
        }
    })
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
    Mentors_1.default.findByPk(req.params.mentor_id)
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (global_helper_1.checkContent(val, next)) {
            try {
                yield val.addInternship(Number(req.params.id));
                return res.sendStatus(http_status_codes_1.default.OK);
            }
            catch (error) {
                global_helper_1.checkContent(null, next);
            }
        }
    }))
        .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
};
function _getInternshipState(req) {
    let MODE = "suggest" /* SUGGESTED */;
    if (req.session.info.role === 'admin') {
        if (req.body.isValidated) {
            MODE = "validated" /* VALIDATED */;
        }
        else if (req.body.isPublish) {
            MODE = "available" /* AVAILABLE */;
        }
        else if (req.body.isProposition) {
            MODE = "suggest" /* SUGGESTED */;
        }
        else {
            MODE = "waiting" /* WAITING */;
        }
    }
    return MODE;
}
//# sourceMappingURL=internships.ctrl.js.map