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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = __importDefault(require("sequelize"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const InternshipTypes_1 = __importDefault(require("./sequelize/InternshipTypes"));
const Businesses_1 = __importDefault(require("./sequelize/Businesses"));
const Campaigns_1 = __importDefault(require("./sequelize/Campaigns"));
const Mentors_1 = __importDefault(require("./sequelize/Mentors"));
const MentoringPropositions_1 = __importDefault(require("./sequelize/MentoringPropositions"));
const Students_1 = __importDefault(require("./sequelize/Students"));
const Files_1 = __importDefault(require("./sequelize/Files"));
const options_1 = require("./helpers/options");
const pagination_1 = require("./helpers/pagination");
const check_1 = require("../utils/check");
const error_1 = require("../utils/error");
const internship_type_mode_1 = __importDefault(require("./internship.type.mode"));
const internship_1 = require("../internship/internship");
const singleton_1 = __importDefault(require("../statistics/singleton"));
/**
 * @interface InternshipModelStruct
 * @class
 *
 * API for internship use in database
 */
class InternshipModelStruct {
    /**
     * @summary Method used to retrieve internships
     * @param {InternshipOpts} internshipOpts internship find options
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IInternshipEntity>>} Resolve: Paginated IInternshipEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getInternships(internshipOpts, pageOpts) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const opts = this._buildFindOpts(internshipOpts);
            let max;
            Internships_1.default.count(options_1.extractCount(opts, [
                { model: InternshipTypes_1.default, as: 'category', attributes: [], duplicating: false },
            ]))
                .then((rowNbr) => {
                max = rowNbr;
                return Internships_1.default.findAll(pagination_1.paginate(pageOpts, opts));
            })
                .then((internships) => __awaiter(this, void 0, void 0, function* () {
                if (internships.length !== 0) {
                    resolve({
                        page: pageOpts.page,
                        data: internships,
                        length: internships.length,
                        max,
                    });
                }
                else {
                    resolve();
                }
            }))
                .catch((e) => reject(e));
        }));
    }
    /**
     * @summary Method used to create a new internship
     * @notice If internship already exist, update it
     * @notice Also create or link sub-models if given
     * @param {IBusinessEntity} internship New internship data
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<any>} Reject: database error
     */
    createInternship(internship) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (internship.id) {
                    const prev = yield Internships_1.default.findByPk(internship.id);
                    if (prev) {
                        const updated = yield this.updateInternship(internship.id, internship);
                        return resolve(updated);
                    }
                }
                const created = yield Internships_1.default.create(internship, this._buildCreateOpts(internship));
                singleton_1.default.stateAdd(created.state, 1);
                // TODO: Emit on socket new data
                return resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to retrieve a internship by his identifier
     * @notice Include sub-struct by default
     * @param {number} id Internship identifier
     * @param {boolean} archived if archived
     * @returns {Promise<IInternshipEntity>} Resolve: IInternshipEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getInternship(id, archived) {
        return new Promise((resolve, reject) => {
            const opts = {
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
            };
            Internships_1.default.findByPk(id, archived ? options_1.setFindOptsArchived(opts) : opts)
                .then((val) => resolve(val ? val.toJSON() : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update a internship entity
     * @notice If not any internship is found, but all update data required to create
     * a new internship is available, create this new internship
     * @param {number} id internship identifier
     * @param {Partial<IBusinessEntity>} next internship data to update
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateInternship(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internship = yield Internships_1.default.findByPk(id);
                if (!internship) {
                    if (check_1.checkPartialInternship(next)) {
                        delete next.id;
                        const created = yield this.createInternship(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.subject) {
                    internship.set('subject', next.subject);
                }
                if (next.description) {
                    internship.set('description', next.description);
                }
                if (next.category) {
                    let catId = -1;
                    if (next.category.id) {
                        const updatedCat = yield internship_type_mode_1.default.updateInternshipType(next.category.id, next.category);
                        catId = updatedCat.id;
                    }
                    else if (check_1.checkPartialInternshipType(next.category)) {
                        delete next.category.id; // Prevent recursive call
                        const created = yield internship_type_mode_1.default.createInternshipType(next.category);
                        catId = created.id;
                    }
                    if (catId !== -1) {
                        const category = yield InternshipTypes_1.default.findByPk(catId);
                        if (category) {
                            yield internship.setCategory(category);
                        }
                    }
                }
                if (next.country) {
                    internship.set('country', next.country);
                }
                if (next.city) {
                    internship.set('city', next.city);
                }
                if (next.postalCode) {
                    internship.set('postalCode', next.postalCode);
                }
                if (next.address) {
                    internship.set('address', next.address);
                }
                if (next.additional) {
                    internship.set('additional', next.additional);
                }
                if (next.isInternshipAbroad !== undefined) {
                    internship.set('isInternshipAbroad', next.isInternshipAbroad ? true : false);
                }
                if (next.publishAt !== undefined) {
                    internship.set('publishAt', next.publishAt === 0 || next.publishAt === null
                        ? null
                        : moment_1.default(next.publishAt).valueOf());
                }
                if (next.startAt !== undefined) {
                    internship.set('startAt', next.startAt === 0 || next.startAt === null
                        ? null
                        : moment_1.default(next.startAt).valueOf());
                }
                if (next.endAt !== undefined) {
                    internship.set('endAt', next.endAt === 0 || next.endAt === null
                        ? null
                        : moment_1.default(next.endAt).valueOf());
                }
                const updated = yield internship.save();
                // TODO: Emit update on socket
                return resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove internship
     * @param {number} id internship identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeInternship(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internship = yield Internships_1.default.findByPk(id, {
                    include: [
                        { model: Files_1.default, as: 'files' },
                        { model: MentoringPropositions_1.default, as: 'propositions' },
                    ],
                });
                if (!internship) {
                    return resolve();
                }
                yield Promise.all(internship.files.map((f) => f.destroy()));
                yield Promise.all(internship.propositions.map((p) => {
                    singleton_1.default.removeProposition(p.campaign);
                    return p.destroy();
                }));
                singleton_1.default.stateRemove(internship.state, 1, (internship.availableCampaign || internship.validatedCampaign));
                yield internship.destroy();
                resolve();
            }
            catch (error) {
                reject(error);
            }
            Internships_1.default.findByPk(id)
                .then((val) => (val ? val.destroy() : undefined))
                .then(() => resolve())
                .catch((e) => reject(e));
        }));
    }
    /**
     * @summary Method used to link internship and file
     * @param {number} internshipId internship identifier
     * @param {number} fileId file identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    linkToFile(internshipId, fileId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const file = yield Files_1.default.findByPk(fileId);
                if (!file) {
                    return resolve();
                }
                yield internship.addFile(file);
                return resolve(internship.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to link internship and category
     * @param {number} internshipId internship identifier
     * @param {number} categoryId category identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    linkToCategory(internshipId, categoryId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const category = yield InternshipTypes_1.default.findByPk(categoryId);
                if (!category) {
                    return resolve();
                }
                yield internship.setCategory(category);
                return resolve(yield this.getInternship(internship.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to link internship and proposition
     * @param {number} internshipId internship identifier
     * @param {number} propositionId proposition identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    linkToProposition(internshipId, propositionId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const proposition = yield MentoringPropositions_1.default.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                yield internship.addProposition(proposition);
                return resolve(yield this.getInternship(internship.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to link internship and business
     * @param {number} internshipId internship identifier
     * @param {number} businessId business identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    linkToBusiness(internshipId, businessId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const business = yield Businesses_1.default.findByPk(businessId);
                if (!business) {
                    return resolve();
                }
                yield internship.setBusiness(business);
                return resolve(yield this.getInternship(internship.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    getHandler(internship) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let id;
            if (!Number.isNaN(Number(internship))) {
                id = Number(internship);
            }
            else if (!Number.isNaN(Number(internship.id))) {
                id = Number(internship.id);
            }
            else {
                return reject(new error_1.APIError('No internship id provide to get handler', http_status_codes_1.default.BAD_REQUEST, 1200));
            }
            const val = yield Internships_1.default.findByPk(id, {
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
            });
            if (!val) {
                return resolve();
            }
            resolve(new internship_1.InternshipHandler(val));
        }));
    }
    _buildFindOpts(opts) {
        let tmp = {
            // By default, only give internship available list
            where: {},
            include: [{ model: InternshipTypes_1.default, as: 'category', duplicating: false }],
            group: [sequelize_1.default.col(`Internships.id`)],
        };
        if (opts.mode) {
            tmp.where.state = opts.mode;
        }
        if (opts.countries) {
            // If country list is given, add it to query
            // Sequelize will translate it by "country in countries"
            tmp.where.country = opts.countries;
        }
        if (opts.types) {
            // If category list is given, add it to query
            // Sequelize will translate it by "category in types"
            tmp.where.categoryId = opts.types;
        }
        if (opts.subject) {
            // If subject filter is given, apply it using substring
            tmp.where.subject = { [sequelize_1.default.Op.substring]: opts.subject };
        }
        if (opts.isAbroad) {
            tmp.where.isInternshipAbroad = opts.isAbroad;
        }
        if (opts.categoryId !== undefined) {
            tmp.where.categoryId = opts.categoryId;
        }
        if (opts.businessId !== undefined) {
            tmp.where.businessId = opts.businessId;
        }
        if (opts.mentorId !== undefined) {
            tmp.where.mentorId = opts.mentorId;
        }
        if (opts.studentId !== undefined) {
            tmp.where.studentId = opts.studentId;
        }
        if (opts.availableCampaignId !== undefined) {
            tmp.where.availableCampaignId = opts.availableCampaignId;
        }
        if (opts.validatedCampaignId !== undefined) {
            tmp.where.validatedCampaignId = opts.validatedCampaignId;
        }
        if (opts.campaignId !== undefined) {
            tmp.where[sequelize_1.default.Op.or] = [
                { availableCampaignId: opts.campaignId },
                { validatedCampaignId: opts.campaignId },
            ];
        }
        if (opts.includes !== undefined) {
            for (const inc of opts.includes) {
                if (inc === 'files') {
                    tmp.include.push({ model: Files_1.default, association: 'files' });
                }
                if (inc === 'student') {
                    tmp.include.push({ model: Students_1.default, association: 'student' });
                }
                if (inc === 'mentor') {
                    tmp.include.push({ model: Mentors_1.default, association: 'mentor' });
                }
                if (inc === 'propositions') {
                    tmp.include.push({ model: MentoringPropositions_1.default, association: 'propositions' });
                }
                if (inc === 'validatedCampaign') {
                    tmp.include.push({ model: Campaigns_1.default, association: 'validatedCampaign' });
                }
                if (inc === 'availableCampaign') {
                    tmp.include.push({ model: Campaigns_1.default, association: 'availableCampaign' });
                }
                if (inc === 'business') {
                    tmp.include.push({ model: Businesses_1.default, association: 'business' });
                }
            }
        }
        if (opts.archived) {
            tmp = options_1.setFindOptsArchived(tmp);
        }
        return tmp;
    }
    _buildCreateOpts(internship) {
        const opts = { include: [] };
        if (internship.files) {
            let set = true;
            for (const mentor of internship.files) {
                if (!check_1.checkPartialFile(mentor) || mentor.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Internships_1.default.associations.files });
            }
        }
        if (internship.propositions) {
            let set = true;
            for (const proposition of internship.propositions) {
                if (!check_1.checkPartialProposition(proposition) || proposition.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Internships_1.default.associations.propositions });
            }
        }
        if (internship.category &&
            check_1.checkPartialInternshipType(internship.category) &&
            internship.category.id !== undefined) {
            opts.include.push({ association: Internships_1.default.associations.category });
        }
        if (internship.mentor &&
            check_1.checkPartialMentor(internship.mentor) &&
            internship.mentor.id !== undefined) {
            opts.include.push({ association: Internships_1.default.associations.mentor });
        }
        if (internship.student &&
            check_1.checkPartialStudent(internship.student) &&
            internship.student.id !== undefined) {
            opts.include.push({ association: Internships_1.default.associations.student });
        }
        if (internship.business &&
            check_1.checkPartialBusiness(internship.business) &&
            internship.business.id !== undefined) {
            opts.include.push({ association: Internships_1.default.associations.business });
        }
        if (internship.availableCampaign &&
            check_1.checkPartialCampaign(internship.availableCampaign) &&
            internship.availableCampaign.id !== undefined) {
            opts.include.push({ association: Internships_1.default.associations.availableCampaign });
        }
        if (internship.validatedCampaign &&
            check_1.checkPartialCampaign(internship.validatedCampaign) &&
            internship.validatedCampaign.id !== undefined) {
            opts.include.push({ association: Internships_1.default.associations.validatedCampaign });
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
const InternshipModel = new InternshipModelStruct();
exports.default = InternshipModel;
//# sourceMappingURL=internship.model.js.map