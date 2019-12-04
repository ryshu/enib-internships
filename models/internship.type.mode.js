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
const InternshipTypes_1 = __importDefault(require("./sequelize/InternshipTypes"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const options_1 = require("./helpers/options");
const check_1 = require("../utils/check");
/**
 * @interface InternshipTypeModelStruct API to handle internship type in database
 * @class
 */
class InternshipTypeModelStruct {
    /**
     * @summary Method used to retrieve all internship types
     * @param {internshipTypeOpts} internshipTypeOpts Find options
     * @returns {Promise<IInternshipTypeEntity[]>} Resolve: internship types list
     * @returns {Promise<any>} Reject: database error
     */
    getInternshipTypes(internshipTypeOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(internshipTypeOpts);
            InternshipTypes_1.default.findAll(opts)
                .then((types) => resolve(types.length ? types : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a new internship type
     * @notice If type is defined, update it instead of create
     * @notice Also create or link sub-models if given
     * @param {IInternshipTypeEntity} type type data
     * @returns {Promise<IInternshipTypeEntity>} Resolve: IInternshipTypeEntity
     * @returns {Promise<any>} Reject: database error
     */
    createInternshipType(type) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (type.id) {
                    const prev = yield InternshipTypes_1.default.findByPk(type.id);
                    if (prev) {
                        const updated = yield this.updateInternshipType(type.id, type);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }
                const created = yield InternshipTypes_1.default.create(type, this._buildCreateOpts(type));
                // TODO: emit creation on websocket
                return resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to get an internship type by his identifier
     * @param {number} id type identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IInternshipTypeEntity>} Resolve: internship type
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    getInternshipType(id, archived) {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: Internships_1.default, as: 'internships' },
                    { model: Campaigns_1.default, as: 'campaigns' },
                ],
            };
            InternshipTypes_1.default.findByPk(id, archived ? options_1.setFindOptsArchived(opts) : opts)
                .then((internship) => resolve(internship ? internship.toJSON() : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update an internship type
     * @notice If not any type is found, but all update data required to create
     * a new type is available, create this new type
     * @param {number} id type identifier
     * @param {Partial<IInternshipTypeEntity>} next type data to update
     * @returns {Promise<IInternshipTypeEntity>} Resolve: IInternshipTypeEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateInternshipType(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const type = yield InternshipTypes_1.default.findByPk(id);
                if (!type) {
                    if (check_1.checkPartialInternshipType(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = yield this.createInternshipType(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.label) {
                    type.set('label', next.label);
                }
                const updated = yield type.save();
                // TODO: emit updated type on websocket
                return resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove an internship type
     * @param {number} id type identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeInternshipType(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const type = yield InternshipTypes_1.default.findByPk(id);
                if (type) {
                    yield type.destroy();
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
     * @summary Method used to setup link between type and his internship
     * @param {number} typeId type identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IInternshipTypeEntity>} Resolve: IInternshipTypeEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToInternship(typeId, internshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const type = yield InternshipTypes_1.default.findByPk(typeId);
                if (!type) {
                    return resolve();
                }
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                yield type.addInternship(internship);
                // TODO: Emit update on socket
                return resolve(yield this.getInternshipType(type.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to setup link between type and his campaign
     * @param {number} typeId type identifier
     * @param {number} campaignId campaign identifier
     * @returns {Promise<IInternshipTypeEntity>} Resolve: IInternshipTypeEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    linkToCampaign(typeId, campaignId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const type = yield InternshipTypes_1.default.findByPk(typeId);
                if (!type) {
                    return resolve();
                }
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                yield type.addCampaign(campaign);
                // TODO: Emit update on socket
                return resolve(yield this.getInternshipType(type.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        let tmp = {};
        if (opts.archived) {
            tmp = options_1.setFindOptsArchived(tmp);
        }
        return tmp;
    }
    _buildCreateOpts(type) {
        const opts = { include: [] };
        if (type.campaigns) {
            let set = true;
            for (const mentor of type.campaigns) {
                if (!check_1.checkPartialCampaign(mentor) || mentor.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: InternshipTypes_1.default.associations.campaigns });
            }
        }
        if (type.internships) {
            let set = true;
            for (const internship of type.internships) {
                if (!check_1.checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }
            if (set) {
                opts.include.push({ association: InternshipTypes_1.default.associations.internships });
            }
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
// Init Struct and export as default this model
const InternshipTypeModel = new InternshipTypeModelStruct();
exports.default = InternshipTypeModel;
//# sourceMappingURL=internship.type.mode.js.map