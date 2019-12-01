import sequelize, { FindOptions, IncludeOptions } from 'sequelize';
import { cloneDeep } from 'lodash';

/**
 * @summary Method used to extract only settings for count query
 * @notice If opts.paranoid === true, set all include to archived settings
 *
 * @param {FindOptions} opts opts to process
 * @param {IncludeOptions[]} include include options
 * @returns {FindOptions} extracted count options
 */
export function extractCount(opts: FindOptions, include?: IncludeOptions[]): FindOptions {
    return {
        where: cloneDeep(opts.where),
        paranoid: opts.paranoid === false ? false : true,
        include: opts.paranoid === false && include ? include.map(setIncludeableArchived) : include,
    };
}

/**
 * @summary Recursive method used to setup an archived query using sequelize API
 * @param {IncludeOptions} include include option, to transform to archive search
 * @returns {IncludeOptions} include option with archive settings
 */
export function setIncludeableArchived(include: IncludeOptions): IncludeOptions {
    const tmp = cloneDeep(include);

    // Paranoid to false
    tmp.paranoid = false;

    // If include, recursive call on them of same function
    if (tmp.include) {
        tmp.include = tmp.include.map(setIncludeableArchived);
    }

    return tmp;
}

/**
 * @summary Method used to set archived status on find options
 * @param {FindOptions} opts find options to convert
 * @returns {FindOptions} find options with archvied settings
 */
export function setFindOptsArchived(opts: FindOptions): FindOptions {
    const tmp = cloneDeep(opts);

    // Paranoid to false
    tmp.paranoid = false;

    // Select where deletedAt is not null to retrieve only archived samples
    if (tmp.where) {
        (tmp.where as any).deletedAt = { [sequelize.Op.ne]: null };
    } else {
        tmp.where = { deletedAt: { [sequelize.Op.ne]: null } };
    }

    // If include, recursive call on them of same function
    if (tmp.include) {
        tmp.include = tmp.include.map(setIncludeableArchived);
    }

    // Return find options
    return tmp;
}
