import sequelize, { CreateOptions, FindOptions } from 'sequelize';

import Campaigns from './sequelize/Campaigns';
import MentoringPropositions from './sequelize/MentoringPropositions';
import Internships from './sequelize/Internships';
import Mentors from './sequelize/Mentors';

import { IMentoringPropositionEntity } from '../declarations';

import {
    checkPartialProposition,
    checkPartialInternship,
    checkPartialCampaign,
    checkPartialMentor,
} from './helpers/check';
import { PaginateList } from './helpers/type';
import { PaginateOpts, paginate } from '../api/helpers/pagination.helper';
import { extractCount } from './helpers/options';

/** @interface PropositionsOpts Interface of all availables filters for propositions list */
export interface PropositionsOpts {
    /** @property {number} internshipId Filter propositions by internship */
    internshipId?: number;

    /** @property {number} campaignId Filter propositions by campaign */
    campaignId?: number;

    /** @property {number} mentorId Filter propositions by mentor */
    mentorId?: number;
}

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
    public getMentoringPropositions(
        propositionsOpts: PropositionsOpts,
        pageOpts: PaginateOpts,
    ): Promise<PaginateList<IMentoringPropositionEntity>> {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(propositionsOpts);

            let max: number;
            MentoringPropositions.count(extractCount(opts))
                .then((rowNbr) => {
                    max = rowNbr;

                    return MentoringPropositions.findAll(paginate(pageOpts, opts));
                })
                .then(async (mps: any) =>
                    mps.length
                        ? resolve({
                              page: pageOpts.page,
                              data: mps as IMentoringPropositionEntity[],
                              length: mps.length,
                              max,
                          })
                        : resolve(),
                )
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
    public createMentoringProposition(
        proposition: IMentoringPropositionEntity,
    ): Promise<IMentoringPropositionEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                if (proposition.id) {
                    const prev = await MentoringPropositions.findByPk(proposition.id);
                    if (prev) {
                        const updated = await this.updateMentoringProposition(
                            proposition.id,
                            proposition,
                        );
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }

                const created = await MentoringPropositions.create(
                    proposition,
                    this._buildCreateOpts(proposition),
                );
                // TODO: emit creation on websocket

                return resolve(created.toJSON() as IMentoringPropositionEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to get a mentoring propostion by his identifier
     * @param {number} id proposition identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: mentoring propostion
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    public getMentoringProposition(id: number): Promise<IMentoringPropositionEntity> {
        return new Promise((resolve, reject) => {
            MentoringPropositions.findByPk(id, {
                include: [
                    { model: Internships, as: 'internship' },
                    { model: Campaigns, as: 'campaign' },
                    { model: Mentors, as: 'mentor' },
                ],
            })
                .then((mp) =>
                    resolve(mp ? (mp.toJSON() as IMentoringPropositionEntity) : undefined),
                )
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
    public updateMentoringProposition(
        id: number,
        next: Partial<IMentoringPropositionEntity>,
    ): Promise<IMentoringPropositionEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const proposition = await MentoringPropositions.findByPk(id);
                if (!proposition) {
                    if (checkPartialProposition(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = await this.createMentoringProposition(next);
                        return resolve(created);
                    }
                    return resolve();
                }

                if (next.comment) {
                    proposition.set('comment', next.comment);
                }
                const updated = await proposition.save();
                // TODO: emit updated proposition on websocket

                return resolve(updated.toJSON() as IMentoringPropositionEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove an mentoring propostions
     * @param {number} id proposition identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeMentoringProposition(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const proposition = await MentoringPropositions.findByPk(id);
                if (proposition) {
                    await proposition.destroy();
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
     * @summary Method used to setup link between proposition and his internship
     * @param {number} propositionId proposition identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToInternship(
        propositionId: number,
        internshipId: number,
    ): Promise<IMentoringPropositionEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const proposition = await MentoringPropositions.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }

                await proposition.setInternship(internship);
                // TODO: Emit update on socket

                return resolve(proposition.toJSON() as IMentoringPropositionEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between proposition and his campaign
     * @param {number} propositionId proposition identifier
     * @param {number} campaignId campaign identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToCampaign(
        propositionId: number,
        campaignId: number,
    ): Promise<IMentoringPropositionEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const proposition = await MentoringPropositions.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }

                await proposition.setCampaign(campaign);
                // TODO: Emit update on socket

                return resolve(proposition.toJSON() as IMentoringPropositionEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between proposition and his mentor
     * @param {number} propositionId proposition identifier
     * @param {number} mentorId mentor identifier
     * @returns {Promise<IMentoringPropositionEntity>} Resolve: IMentoringPropositionEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToMentor(
        propositionId: number,
        mentorId: number,
    ): Promise<IMentoringPropositionEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const proposition = await MentoringPropositions.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }
                const mentor = await Mentors.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }

                await proposition.setMentor(mentor);
                // TODO: Emit update on socket

                return resolve(proposition.toJSON() as IMentoringPropositionEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    private _buildFindOpts(opts: PropositionsOpts): FindOptions {
        const tmp: sequelize.FindOptions = { where: {} };

        if (opts.internshipId !== undefined) {
            (tmp.where as any).internshipId = opts.internshipId;
        }

        if (opts.mentorId !== undefined) {
            (tmp.where as any).mentorId = opts.mentorId;
        }

        if (opts.campaignId !== undefined) {
            (tmp.where as any).campaignId = opts.campaignId;
        }

        return tmp;
    }

    private _buildCreateOpts(mp: IMentoringPropositionEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (mp.internship && checkPartialInternship(mp.internship)) {
            opts.include.push({ association: MentoringPropositions.associations.internship });
        }
        if (mp.campaign && checkPartialCampaign(mp.campaign)) {
            opts.include.push({ association: MentoringPropositions.associations.campaign });
        }
        if (mp.mentor && checkPartialMentor(mp.mentor)) {
            opts.include.push({ association: MentoringPropositions.associations.mentor });
        }

        if (opts.include.length === 0) {
            delete opts.include;
        }

        return opts;
    }
}

// Init Struct and export as default this model
const MentoringPropositionModel = new MentoringPropositionModelStruct();
export default MentoringPropositionModel;
