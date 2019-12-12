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
const Businesses_1 = __importDefault(require("./sequelize/Businesses"));
const Internships_1 = __importDefault(require("./sequelize/Internships"));
const pagination_1 = require("./helpers/pagination");
const options_1 = require("./helpers/options");
const check_1 = require("../utils/check");
/**
 * @class BusinessModelStruct
 *
 * API for business use in database
 */
class BusinessModelStruct {
    /**
     * @summary Method used to retrieve businesses
     * @param {BusinessOpts} businessOpts business find options
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IBusinessEntity>>} Resolve: Paginated IBusinessEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getBusinesses(businessOpts, pageOpts) {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(businessOpts);
            let max;
            Businesses_1.default.count(options_1.extractCount(opts))
                .then((rowNbr) => {
                max = rowNbr;
                return Businesses_1.default.findAll(pagination_1.paginate(pageOpts, opts));
            })
                .then((businesses) => __awaiter(this, void 0, void 0, function* () {
                return businesses.length
                    ? resolve({
                        page: pageOpts.page,
                        data: businesses,
                        length: businesses.length,
                        max,
                    })
                    : resolve();
            }))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to create a new business
     * @notice If business already exist, update it
     * @notice Also create or link sub-models if given
     * @param {IBusinessEntity} business New business data
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<any>} Reject: database error
     */
    createBusiness(business) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                // If id is given, check if business already exist
                // If so, launch update on it
                if (business.id) {
                    const prev = yield Businesses_1.default.findByPk(business.id);
                    if (prev) {
                        const updated = yield this.updateBusiness(business.id, business);
                        resolve(updated);
                        return;
                    }
                }
                // Else, create new business
                const created = yield Businesses_1.default.create(business, this._buildCreateOpts(business));
                // TODO: Add socket chanel + emit create
                resolve(created.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to retrieve a business by his identifier
     * @notice Include internships by default
     * @param {number} id Business identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    getBusiness(id, archived) {
        return new Promise((resolve, reject) => {
            const opts = { include: [{ model: Internships_1.default, as: 'internships' }] };
            Businesses_1.default.findByPk(id, archived ? options_1.setFindOptsArchived(opts) : opts)
                .then((val) => resolve(val ? val.toJSON() : undefined))
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to update a business entity
     * @notice If not any business is found, but all update data required to create
     * a new business is available, create this new business
     * @param {number} id business identifier
     * @param {Partial<IBusinessEntity>} next business data to update
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    updateBusiness(id, next) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const business = yield Businesses_1.default.findByPk(id);
                if (!business) {
                    // Try to create business if all required fields are given
                    if (check_1.checkPartialBusiness(next)) {
                        delete next.id; // Prevent recursive call by removing id;
                        const created = yield this.createBusiness(next);
                        return resolve(created);
                    }
                    return resolve();
                }
                if (next.name) {
                    business.set('name', next.name);
                }
                if (next.country) {
                    business.set('country', next.country);
                }
                if (next.city) {
                    business.set('city', next.city);
                }
                if (next.postalCode) {
                    business.set('postalCode', next.postalCode);
                }
                if (next.address) {
                    business.set('address', next.address);
                }
                if (next.additional) {
                    business.set('additional', next.additional);
                }
                const updated = yield business.save();
                // TODO: Also update internships
                // TODO: Add socket edit + emit
                // TODO: Update counter for this update;
                resolve(updated.toJSON());
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    /**
     * @summary Method used to remove business
     * @param {number} id business identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    removeBusiness(id) {
        // TODO: Add archives function for internships on availables modes
        // TODO: Add socket remove + emit;
        return new Promise((resolve, reject) => {
            Businesses_1.default.findByPk(id)
                .then((val) => (val ? val.destroy() : undefined))
                .then(() => resolve())
                .catch((e) => reject(e));
        });
    }
    /**
     * @summary Method used to link business and internship
     * @param {number} businessId business identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IBusinessEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    linkToInternship(businessId, internshipId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const business = yield Businesses_1.default.findByPk(businessId);
                if (!business) {
                    return resolve();
                }
                const internship = yield Internships_1.default.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                yield business.addInternship(internship);
                return resolve(yield this.getBusiness(business.id));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    _buildFindOpts(opts) {
        let tmp = {
            attributes: {
                include: [
                    [sequelize_1.default.fn('count', sequelize_1.default.col(`internships.businessId`)), 'count'],
                ],
            },
            include: [
                { model: Internships_1.default, as: 'internships', attributes: [], duplicating: false },
            ],
            where: {},
            group: [sequelize_1.default.col(`Businesses.id`)],
        };
        if (opts.countries) {
            // If country list is given, add it to query
            // Sequelize will translate it by "country in countries"
            tmp.where.country = opts.countries;
        }
        if (opts.name) {
            // If name filter is given, apply it using substring
            tmp.where.name = { [sequelize_1.default.Op.substring]: opts.name };
        }
        if (opts.archived) {
            tmp = options_1.setFindOptsArchived(tmp);
        }
        return tmp;
    }
    _buildCreateOpts(business) {
        const opts = { include: [] };
        if (business.internships) {
            let set = true;
            for (const internship of business.internships) {
                if (!check_1.checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                }
            }
            if (set) {
                opts.include.push({ association: Businesses_1.default.associations.internships });
            }
        }
        if (opts.include.length === 0) {
            delete opts.include;
        }
        return opts;
    }
}
// Init Struct and export as default this model
const BusinessModel = new BusinessModelStruct();
exports.default = BusinessModel;
//# sourceMappingURL=business.model.js.map