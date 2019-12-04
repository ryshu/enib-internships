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
const Campaigns_1 = __importDefault(require("./sequelize/Campaigns"));
const MentoringPropositions_1 = __importDefault(require("./sequelize/MentoringPropositions"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const Mentors_1 = __importDefault(require("./sequelize/Mentors"));
const check_1 = require("../utils/check");
const pagination_1 = require("./helpers/pagination");
const options_1 = require("./helpers/options");
/**
 * @interface MentoringPropositionModelStruct API to handle mentoring propostions in database
 * @class
 */
class MentoringPropositionModelStruct {
    /**
     * @summary Method used to retrieve mentoring propositions
     * @param {PropositionsOpts} propositionsOpts propositions options
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IMentoringPropositionEntity>>} Resolve: Paginated propositions
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getMentoringPropositions(propositionsOpts, pageOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(propositionsOpts);
            let max;
            MentoringPropositions_1.default.count(options_1.extractCount(opts))
                .then((rowNbr) => {
                max = rowNbr;
                return MentoringPropositions_1.default.findAll(pagination_1.paginate(pageOpts, opts));
            })
                .then((mps) => __awaiter(this, void 0, void 0, function* () {
                return mps.length
                    ? resolve({
                        page: pageOpts.page,
                        data: mps,
                        length: mps.length,
                        max,
                    })
                    : resolve();
            }))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a new mentoring propostion
     * @notice If proposition is defined, update it instead of create
     * @notice Also create or link sub-models if given
     * @param {IMentoringPropositionEntity} proposition proposition data
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<any>} Reject: database error
     */
    createMentoringProposition(proposition) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (proposition.id) {
                    const prev = yield MentoringPropositions_1.default.findByPk(proposition.id);
                    if (prev) {
                        const updated = yield this.updateMentoringProposition(proposition.id, proposition);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }
                const created = yield MentoringPropositions_1.default.create(proposition, this._buildCreateOpts(proposition));
                // TODO: emit creation on websocket
                return resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to get a mentoring propostion by his identifier
     * @param {number} id proposition identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: mentoring propostion
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    getMentoringProposition(id, archived) {
        return new Promise((resolve, reject) => {
            MentoringPropositions_1.default.findByPk(id, {
                include: [
                    { model: Internships_1.default, as: 'internship', paranoid: !archived },
                    { model: Campaigns_1.default, as: 'campaign', paranoid: !archived },
                    { model: Mentors_1.default, as: 'mentor', paranoid: !archived },
                ],
                paranoid: !archived,
            })
                .then((mp) => resolve(mp ? mp.toJSON() : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update an mentoring propostions
     * @notice If not any proposition is found, but all update data required to create
     * a new proposition is available, create this new proposition
     * @param {number} id proposition identifier
     * @param {Partial<IMentoringPropositionEntity>} next proposition data to update
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateMentoringProposition(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const proposition = yield MentoringPropositions_1.default.findByPk(id);
                if (!proposition) {
                    if (check_1.checkPartialProposition(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = yield this.createMentoringProposition(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.comment) {
                    proposition.set('comment', next.comment);
                }
                const updated = yield proposition.save();
                // TODO: emit updated proposition on websocket
                return resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove an mentoring propostions
     * @param {number} id proposition identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeMentoringProposition(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const proposition = yield MentoringPropositions_1.default.findByPk(id);
                if (proposition) {
                    yield proposition.destroy();
                }
                // TODO: emit file destruction
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
     * @summary Method used to setup link between proposition and his internship
     * @param {number} propositionId proposition identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToInternship(propositionId, internshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const proposition = yield MentoringPropositions_1.default.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                yield proposition.setInternship(internship);
                // TODO: Emit update on socket
                return resolve(yield this.getMentoringProposition(proposition.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between proposition and his campaign
     * @param {number} propositionId proposition identifier
     * @param {number} campaignId campaign identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToCampaign(propositionId, campaignId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const proposition = yield MentoringPropositions_1.default.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                yield proposition.setCampaign(campaign);
                // TODO: Emit update on socket
                return resolve(yield this.getMentoringProposition(proposition.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between proposition and his mentor
     * @param {number} propositionId proposition identifier
     * @param {number} mentorId mentor identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToMentor(propositionId, mentorId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const proposition = yield MentoringPropositions_1.default.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                const mentor = yield Mentors_1.default.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }
                yield proposition.setMentor(mentor);
                // TODO: Emit update on socket
                return resolve(yield this.getMentoringProposition(proposition.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        const tmp = { where: {} };
        if (opts.internshipId !== undefined) {
            tmp.where.internshipId = opts.internshipId;
        }
        if (opts.mentorId !== undefined) {
            tmp.where.mentorId = opts.mentorId;
        }
        if (opts.campaignId !== undefined) {
            tmp.where.campaignId = opts.campaignId;
        }
        if (opts.archived) {
            tmp.paranoid = false;
        }
        return tmp;
    }
    _buildCreateOpts(mp) {
        const opts = { include: [] };
        if (mp.internship &&
            check_1.checkPartialInternship(mp.internship) &&
            mp.internship.id !== undefined) {
            opts.include.push({ association: MentoringPropositions_1.default.associations.internship });
        }
        if (mp.campaign && check_1.checkPartialCampaign(mp.campaign) && mp.campaign.id !== undefined) {
            opts.include.push({ association: MentoringPropositions_1.default.associations.campaign });
        }
        if (mp.mentor && check_1.checkPartialMentor(mp.mentor) && mp.mentor.id !== undefined) {
            opts.include.push({ association: MentoringPropositions_1.default.associations.mentor });
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
// Init Struct and export as default this model
const MentoringPropositionModel = new MentoringPropositionModelStruct();
exports.default = MentoringPropositionModel;
//# sourceMappingURL=mentoring.proposition.model.js.map