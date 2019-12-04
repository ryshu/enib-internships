"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const lodash_1 = require("lodash");
/**
 * @summary Method used to extract only settings for count query
 * @notice If opts.paranoid === true, set all include to archived settings
 *
 * @param {FindOptions} opts opts to process
 * @param {IncludeOptions[]} include include options
 * @returns {FindOptions} extracted count options
 */
function extractCount(opts, include) {
    return {
        where: lodash_1.cloneDeep(opts.where),
        paranoid: opts.paranoid === false ? false : true,
        include: opts.paranoid === false && include ? include.map(setIncludeableArchived) : include,
    };
}
exports.extractCount = extractCount;
/**
 * @summary Recursive method used to setup an archived query using sequelize API
 * @param {IncludeOptions} include include option, to transform to archive search
 * @returns {IncludeOptions} include option with archive settings
 */
function setIncludeableArchived(include) {
    const tmp = lodash_1.cloneDeep(include);
    // Paranoid to false
    tmp.paranoid = false;
    // If include, recursive call on them of same function
    if (tmp.include) {
        tmp.include = tmp.include.map(setIncludeableArchived);
    }
    return tmp;
}
exports.setIncludeableArchived = setIncludeableArchived;
/**
 * @summary Method used to set archived status on find options
 * @param {FindOptions} opts find options to convert
 * @returns {FindOptions} find options with archvied settings
 */
function setFindOptsArchived(opts) {
    const tmp = lodash_1.cloneDeep(opts);
    // Paranoid to false
    tmp.paranoid = false;
    // Select where deletedAt is not null to retrieve only archived samples
    if (tmp.where) {
        tmp.where.deletedAt = { [sequelize_1.default.Op.ne]: null };
    }
    else {
        tmp.where = { deletedAt: { [sequelize_1.default.Op.ne]: null } };
    }
    // If include, recursive call on them of same function
    if (tmp.include) {
        tmp.include = tmp.include.map(setIncludeableArchived);
    }
    // Return find options
    return tmp;
}
exports.setFindOptsArchived = setFindOptsArchived;
//# sourceMappingURL=options.js.map