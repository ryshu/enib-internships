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
const moment_1 = __importDefault(require("moment"));
// Model (sequelize)
const Campaigns_1 = __importDefault(require("./sequelize/Campaigns"));
const MentoringPropositions_1 = __importDefault(require("./sequelize/MentoringPropositions"));
const InternshipTypes_1 = __importDefault(require("./sequelize/InternshipTypes"));
const Mentors_1 = __importDefault(require("./sequelize/Mentors"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
// Validator helpers
const check_1 = require("../utils/check");
const options_1 = require("./helpers/options");
const campaigns_1 = require("./helpers/campaigns");
const private_1 = require("../websocket/channels/private");
const internship_type_mode_1 = __importDefault(require("./internship.type.mode"));
const internship_model_1 = __importDefault(require("./internship.model"));
const singleton_1 = __importDefault(require("../statistics/singleton"));
/**
 * @interface CampaignModelStruct
 * @class
 *
 * API for campaign use in database
 */
class CampaignModelStruct {
    /**
     * @summary Method used to retrieve campaigns
     * @param {CampaignOpts} campaignOpts campaigns filter options
     * @returns {Promise<ICampaignEntity[]>} Resolve: ICampaignEntity[]
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getCampaigns(campaignOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(campaignOpts);
            // TODO: Add filter by type + archived
            Campaigns_1.default.findAll(opts)
                .then((campaigns) => resolve(campaigns.length ? campaigns : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a new campaign
     * @notice If campaign already exist, update it
     * @notice Also create or link sub-models if given
     * @param {ICampaignEntity} campaign New campaign data
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<any>} Reject: database error
     */
    createCampaign(campaign) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                // If id is given, check if campaign already exist
                // If so, launch update on it
                if (campaign.id) {
                    const prev = yield Campaigns_1.default.findByPk(campaign.id);
                    if (prev) {
                        const updated = yield this.updateCampaign(campaign.id, campaign);
                        return resolve(updated);
                    }
                }
                // Else, create new campaign
                const created = yield Campaigns_1.default.create(campaign, this._buildCreateOpts(campaign));
                singleton_1.default.newCampain(created.id, {
                    internships: {
                        total: created.availableInternships.length +
                            created.validatedInternships.length || 0,
                        availables: created.availableInternships.length || 0,
                        attributed: created.validatedInternships.length || 0,
                    },
                    students: created.availableInternships.length + created.validatedInternships.length ||
                        0,
                    mentors: created.mentors.length || 0,
                    propositions: created.propositions.length || 0,
                });
                // TODO: Add socket channel + create emit
                resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to retrieve a campaign by his identifier
     * @notice Include linked data by default
     * @param {number} id Business identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getCampaign(id, archived) {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: MentoringPropositions_1.default, as: 'propositions' },
                    { model: Mentors_1.default, as: 'mentors' },
                    { model: InternshipTypes_1.default, as: 'category' },
                    { model: Internships_1.default, as: 'validatedInternships' },
                    { model: Internships_1.default, as: 'availableInternships' },
                ],
            };
            // Includes all campaigns link
            Campaigns_1.default.findByPk(id, archived ? options_1.setFindOptsArchived(opts) : opts)
                .then((campaign) => resolve(campaign))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update a campaign entity
     * @notice If not any campaign is found, but all update data required to create
     * a new campaign is available, create this new campaign
     * @param {number} id campaign identifier
     * @param {Partial<ICampaignEntity>} next campaign data to update
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateCampaign(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaigns_1.default.findByPk(id);
                // Not campaign found, resolve undefined
                if (!campaign) {
                    // If we can create the requested update, create it
                    if (check_1.checkPartialCampaign(next)) {
                        delete next.id; // Prevent recursive call by removing id
                        const created = this.createCampaign(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.name) {
                    campaign.set('name', next.name);
                }
                if (next.description) {
                    campaign.set('description', next.description);
                }
                if (!Number.isNaN(Number(next.startAt))) {
                    campaign.set('startAt', next.startAt === 0 ? null : moment_1.default(next.startAt).valueOf());
                }
                if (!Number.isNaN(Number(next.endAt))) {
                    campaign.set('endAt', next.endAt === 0 ? null : moment_1.default(next.endAt).valueOf());
                }
                // TODO: @depreciated Semester should be removed
                if (next.semester) {
                    campaign.set('semester', next.semester);
                }
                if (!Number.isNaN(Number(next.maxProposition))) {
                    campaign.set('maxProposition', next.maxProposition ? next.maxProposition : 0);
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
                            yield campaign.setCategory(category);
                        }
                    }
                }
                // TODO: Add socket edit + emit
                const updated = yield campaign.save();
                resolve(updated);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove a campaign by giving identifier
     * @param {number} id campaign identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeCampaign(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaigns_1.default.findByPk(id);
                if (!campaign) {
                    resolve();
                    return;
                }
                // Remove all propositions linked
                const propositions = yield campaign.getPropositions();
                yield Promise.all(propositions.map((p) => {
                    singleton_1.default.removeProposition(campaign.id);
                    return p.destroy();
                }));
                // TODO: Change this to map destory + socket destroy emit
                singleton_1.default.removeCampaign(campaign.id);
                // TODO: Add archives function for internships
                // TODO: Add socket remove + emit;
                yield campaign.destroy();
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between campaign and his category
     * @param {number} campaignId campaign identifier
     * @param {number} categoryId category identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToCategory(campaignId, categoryId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                const category = yield InternshipTypes_1.default.findByPk(categoryId);
                if (!category) {
                    return resolve();
                }
                yield campaign.setCategory(category);
                // TODO: Emit update on socket
                return resolve(yield this.getCampaign(campaign.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between campaign and his mentor
     * @param {number} campaignId campaign identifier
     * @param {number} mentorId mentor identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToMentor(campaignId, mentorId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                const mentor = yield Mentors_1.default.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }
                yield campaign.addMentor(mentor);
                singleton_1.default.linkMentor(campaign.id);
                // TODO: Emit update on socket
                return resolve(yield this.getCampaign(campaign.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between campaign and his proposition
     * @param {number} campaignId campaign identifier
     * @param {number} propositionId proposition identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToProposition(campaignId, propositionId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                const proposition = yield MentoringPropositions_1.default.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                yield campaign.addProposition(proposition);
                singleton_1.default.linkProposition(campaign.id);
                // TODO: Emit update on socket
                return resolve(yield this.getCampaign(campaign.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between campaign and his availableInternship
     * @param {number} campaignId campaign identifier
     * @param {number} availableInternshipId availableInternship identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToAvailableInternship(campaignId, availableInternshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = yield internship_model_1.default.getHandler(availableInternshipId);
                if (!handler) {
                    return resolve();
                }
                // Use handler to setup to campaign available state
                yield handler.toCampaignAvailable(campaignId);
                return resolve(yield this.getCampaign(campaignId));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    launchCampaign(id, userSessionId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield Campaigns_1.default.findByPk(id, {
                    include: [{ model: InternshipTypes_1.default, as: 'category' }],
                });
                if (!campaign || !campaign.category) {
                    return resolve();
                }
                campaign.set('isPublish', true);
                campaign.set('startAt', moment_1.default().valueOf());
                yield campaign.save();
                // Setup new channel to broadcast result
                const ws = new private_1.ProgressChannel('campaign_create', userSessionId);
                // Resolve to let API response
                resolve();
                // Launch campaign, using helper
                yield campaigns_1.LaunchCampaign(campaign, ws);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        let tmp = { include: [{ model: InternshipTypes_1.default, as: 'category' }] };
        if (opts.archived) {
            tmp = options_1.setFindOptsArchived(tmp);
        }
        return tmp;
    }
    _buildCreateOpts(campaign) {
        const opts = { include: [] };
        if (campaign.mentors) {
            let set = true;
            for (const mentor of campaign.mentors) {
                if (!check_1.checkPartialMentor(mentor) || mentor.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Campaigns_1.default.associations.mentors });
            }
        }
        if (campaign.propositions) {
            let set = true;
            for (const proposition of campaign.propositions) {
                if (!check_1.checkPartialProposition(proposition) || proposition.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Campaigns_1.default.associations.propositions });
            }
        }
        if (campaign.category &&
            check_1.checkPartialInternshipType(campaign.category) &&
            campaign.category.id !== undefined) {
            opts.include.push({ association: Campaigns_1.default.associations.category });
        }
        if (campaign.availableInternships) {
            let set = true;
            for (const internship of campaign.availableInternships) {
                if (!check_1.checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Campaigns_1.default.associations.availableInternships });
            }
        }
        if (campaign.validatedInternships) {
            let set = true;
            for (const internship of campaign.validatedInternships) {
                if (!check_1.checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: Campaigns_1.default.associations.validatedInternships });
            }
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
const CampaignModel = new CampaignModelStruct();
exports.default = CampaignModel;
//# sourceMappingURL=campaigns.model.js.map