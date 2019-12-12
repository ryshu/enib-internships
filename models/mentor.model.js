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
const sequelize_1 = __importDefault(require("sequelize"));
const Campaigns_1 = __importDefault(require("./sequelize/Campaigns"));
const Mentors_1 = __importDefault(require("./sequelize/Mentors"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const MentoringPropositions_1 = __importDefault(require("./sequelize/MentoringPropositions"));
const internship_model_1 = __importDefault(require("./internship.model"));
const check_1 = require("../utils/check");
const pagination_1 = require("./helpers/pagination");
const options_1 = require("./helpers/options");
const processor_1 = require("./helpers/processor");
const singleton_1 = __importDefault(require("../statistics/singleton"));
/**
 * @interface MentorModelStruct API to handle mentors in database
 * @class
 */
class MentorModelStruct {
    /**
     * @summary Method used to retrieve mentors
     * @param {MentorOpts} mentorOpts mentor filters
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IMentorEntity>>} Resolve: Paginated mentors
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getMentors(mentorOpts, pageOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(mentorOpts);
            let max;
            Mentors_1.default.count(options_1.extractCount(opts, opts.include))
                .then((rowNbr) => {
                max = rowNbr;
                return Mentors_1.default.findAll(pagination_1.paginate(pageOpts, opts));
            })
                .then((mentors) => __awaiter(this, void 0, void 0, function* () {
                return mentors.length
                    ? resolve({
                        page: pageOpts.page,
                        data: mentors,
                        length: mentors.length,
                        max,
                    })
                    : resolve();
            }))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a new mentor
     * @notice If mentor is defined, update it instead of create
     * @notice Also create or link sub-models if given
     * @param {IMentorEntity} mentor mentor data
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<any>} Reject: database error
     */
    createMentor(mentor) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (mentor.id) {
                    const prev = yield Mentors_1.default.findByPk(mentor.id);
                    if (prev) {
                        const updated = yield this.updateMentor(mentor.id, mentor);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }
                mentor.fullName = processor_1.buildName(mentor.firstName, mentor.lastName);
                const created = yield Mentors_1.default.create(mentor, this._buildCreateOpts(mentor));
                singleton_1.default.addMentor();
                // TODO: emit creation on websocket
                return resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to get a mentor by his identifier
     * @param {number} id mentor identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IMentorEntity>} Resolve: mentor
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    getMentor(id, archived) {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: Internships_1.default, as: 'internships' },
                    { model: Campaigns_1.default, as: 'campaigns' },
                    { model: MentoringPropositions_1.default, as: 'propositions' },
                ],
            };
            Mentors_1.default.findByPk(id, archived ? options_1.setFindOptsArchived(opts) : opts)
                .then((mentor) => resolve(mentor ? mentor.toJSON() : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update an mentor
     * @notice If not any mentor is found, but all update data required to create
     * a new mentor is available, create this new mentor
     * @param {number} id mentor identifier
     * @param {Partial<IMentorEntity>} next mentor data to update
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateMentor(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield Mentors_1.default.findByPk(id);
                if (!mentor) {
                    if (check_1.checkPartialMentor(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = yield this.createMentor(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.firstName) {
                    mentor.set('firstName', next.firstName);
                }
                if (next.lastName) {
                    mentor.set('lastName', next.lastName);
                }
                if (next.email) {
                    mentor.set('email', next.email);
                }
                mentor.set('fullName', processor_1.buildName(mentor.firstName, mentor.lastName));
                const updated = yield mentor.save();
                // TODO: emit updated mentor on websocket
                return resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove an mentor
     * @param {number} id mentor identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeMentor(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield Mentors_1.default.findByPk(id);
                if (mentor) {
                    yield mentor.destroy();
                    singleton_1.default.removeMentor();
                }
                // TODO: emit mentor destruction
                // TODO: add option to remove linked campaigns
                // TODO: add option to remove linked internships
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between mentor and his internship
     * @param {number} mentorId mentor identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToInternship(mentorId, internshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = yield internship_model_1.default.getHandler(internshipId);
                if (!handler) {
                    return resolve();
                }
                yield handler.toAttributedMentor(mentorId);
                return resolve(yield this.getMentor(mentorId));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between mentor and his campaign
     * @param {number} mentorId mentor identifier
     * @param {number} campaignId campaign identifier
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToCampaign(mentorId, campaignId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield Mentors_1.default.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                yield mentor.addCampaign(campaign);
                singleton_1.default.linkMentor(campaign.id);
                // TODO: Emit update on socket
                return resolve(yield this.getMentor(mentor.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between mentor and his proposition
     * @param {number} mentorId mentor identifier
     * @param {number} propositionId proposition identifier
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToProposition(mentorId, propositionId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield Mentors_1.default.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }
                const proposition = yield MentoringPropositions_1.default.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                yield mentor.addProposition(proposition);
                // TODO: Emit update on socket
                return resolve(yield this.getMentor(mentor.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        let tmp = { include: [], where: {} };
        if (opts.campaignId) {
            tmp.include.push({
                model: Campaigns_1.default,
                as: 'campaigns',
                attributes: [],
                duplicating: false,
            });
            tmp.where['$campaigns.id$'] = opts.campaignId;
        }
        if (opts.name) {
            tmp.where.fullName = { [sequelize_1.default.Op.substring]: opts.name };
        }
        if (opts.archived) {
            tmp = options_1.setFindOptsArchived(tmp);
        }
        return tmp;
    }
    _buildCreateOpts(mentor) {
        const opts = { include: [] };
        if (mentor.campaigns) {
            let set = true;
            for (const campaign of mentor.campaigns) {
                if (!check_1.checkPartialCampaign(campaign) || campaign.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Mentors_1.default.associations.campaigns });
            }
        }
        if (mentor.propositions) {
            let set = true;
            for (const proposition of mentor.propositions) {
                if (!check_1.checkPartialProposition(proposition) || proposition.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Mentors_1.default.associations.propositions });
            }
        }
        if (mentor.internships) {
            let set = true;
            for (const internship of mentor.internships) {
                if (!check_1.checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Mentors_1.default.associations.internships });
            }
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
// Init Struct and export as default this model
const MentorModel = new MentorModelStruct();
exports.default = MentorModel;
//# sourceMappingURL=mentor.model.js.map