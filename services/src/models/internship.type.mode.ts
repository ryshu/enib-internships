import { CreateOptions, FindOptions } from 'sequelize';

import Campaigns from './sequelize/Campaigns';
import InternshipTypes from './sequelize/InternshipTypes';
import Internships from './sequelize/Internships';

import { IInternshipTypeEntity } from '../declarations';
import { setFindOptsArchived } from './helpers/options';

import {
    checkPartialInternshipType,
    checkPartialCampaign,
    checkPartialInternship,
} from '../utils/check';

/** @interface InternshipTypeOpts Interface of all availables filters for categories list */
export declare interface InternshipTypeOpts {
    /** @property {boolean} archived Show only archived categories */
    archived?: boolean;
}

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
    public getInternshipTypes(
        internshipTypeOpts?: InternshipTypeOpts,
    ): Promise<IInternshipTypeEntity[]> {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(internshipTypeOpts);

            InternshipTypes.findAll(opts)
                .then((types: any) =>
                    resolve(types.length ? (types as IInternshipTypeEntity[]) : undefined),
                )
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
    public createInternshipType(type: IInternshipTypeEntity): Promise<IInternshipTypeEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                if (type.id) {
                    const prev = await InternshipTypes.findByPk(type.id);
                    if (prev) {
                        const updated = await this.updateInternshipType(type.id, type);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }

                const created = await InternshipTypes.create(type, this._buildCreateOpts(type));
                // TODO: emit creation on websocket

                return resolve(created.toJSON() as IInternshipTypeEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to get an internship type by his identifier
     * @param {number} id type identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IInternshipTypeEntity>} Resolve: internship type
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    public getInternshipType(id: number, archived?: boolean): Promise<IInternshipTypeEntity> {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: Internships, as: 'internships' },
                    { model: Campaigns, as: 'campaigns' },
                ],
            };
            InternshipTypes.findByPk(id, archived ? setFindOptsArchived(opts) : opts)
                .then((internship) =>
                    resolve(
                        internship ? (internship.toJSON() as IInternshipTypeEntity) : undefined,
                    ),
                )
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
    public updateInternshipType(
        id: number,
        next: Partial<IInternshipTypeEntity>,
    ): Promise<IInternshipTypeEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const type = await InternshipTypes.findByPk(id);
                if (!type) {
                    if (checkPartialInternshipType(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = await this.createInternshipType(next);
                        return resolve(created);
                    }
                    return resolve();
                }

                if (next.label) {
                    type.set('label', next.label);
                }
                const updated = await type.save();
                // TODO: emit updated type on websocket

                return resolve(updated.toJSON() as IInternshipTypeEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove an internship type
     * @param {number} id type identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeInternshipType(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const type = await InternshipTypes.findByPk(id);
                if (type) {
                    await type.destroy();
                }

                // TODO: emit file destruction
                // TODO: add option to remove linked campaigns
                // TODO: add option to remove linked internships

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between type and his internship
     * @param {number} typeId type identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IInternshipTypeEntity>} Resolve: IInternshipTypeEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToInternship(typeId: number, internshipId: number): Promise<IInternshipTypeEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const type = await InternshipTypes.findByPk(typeId);
                if (!type) {
                    return resolve();
                }
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }

                await type.addInternship(internship);
                // TODO: Emit update on socket

                return resolve(await this.getInternshipType(type.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between type and his campaign
     * @param {number} typeId type identifier
     * @param {number} campaignId campaign identifier
     * @returns {Promise<IInternshipTypeEntity>} Resolve: IInternshipTypeEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToCampaign(typeId: number, campaignId: number): Promise<IInternshipTypeEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const type = await InternshipTypes.findByPk(typeId);
                if (!type) {
                    return resolve();
                }
                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }

                await type.addCampaign(campaign);
                // TODO: Emit update on socket

                return resolve(await this.getInternshipType(type.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    private _buildFindOpts(opts: InternshipTypeOpts): FindOptions {
        let tmp: FindOptions = {};

        if (opts.archived) {
            tmp = setFindOptsArchived(tmp);
        }

        return tmp;
    }

    private _buildCreateOpts(type: IInternshipTypeEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (type.campaigns) {
            let set = true;
            for (const mentor of type.campaigns) {
                if (!checkPartialCampaign(mentor) || mentor.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: InternshipTypes.associations.campaigns });
            }
        }

        if (type.internships) {
            let set = true;
            for (const internship of type.internships) {
                if (!checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: InternshipTypes.associations.internships });
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
export default InternshipTypeModel;
