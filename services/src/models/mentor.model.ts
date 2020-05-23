import sequelize, { CreateOptions, FindOptions, IncludeOptions } from 'sequelize';

import Campaigns from './sequelize/Campaigns';
import Mentors from './sequelize/Mentors';
import Internships from './sequelize/Internships';
import MentoringPropositions from './sequelize/MentoringPropositions';

import InternshipModel from './internship.model';

import { IMentorEntity } from '../declarations';

import {
    checkPartialMentor,
    checkPartialProposition,
    checkPartialCampaign,
    checkPartialInternship,
} from '../utils/check';

import { PaginateList } from './helpers/type';
import { PaginateOpts, paginate } from './helpers/pagination';
import { extractCount, setFindOptsArchived } from './helpers/options';
import { buildName } from './helpers/processor';

import cache from '../statistics/singleton';

/** @interface MentorOpts Interface of all availables filters for mentors list */
export interface MentorOpts {
    /** @property {number} campaignId Filter list with categoryId */
    campaignId?: number;

    /** @property {string} name Filter by mentor name */
    name?: string;

    /** @property {boolean} archived Show only archived mentors */
    archived?: boolean;
}

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
    public getMentors(
        mentorOpts: MentorOpts,
        pageOpts: PaginateOpts,
    ): Promise<PaginateList<IMentorEntity>> {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(mentorOpts);

            let max: number;
            Mentors.count(extractCount(opts, opts.include as IncludeOptions[]))
                .then((rowNbr) => {
                    max = rowNbr;
                    return Mentors.findAll(paginate(pageOpts, opts));
                })
                .then(async (mentors: any) =>
                    mentors.length
                        ? resolve({
                              page: pageOpts.page,
                              data: mentors as IMentorEntity[],
                              length: mentors.length,
                              max,
                          })
                        : resolve(),
                )
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
    public createMentor(mentor: IMentorEntity): Promise<IMentorEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                if (mentor.id) {
                    const prev = await Mentors.findByPk(mentor.id);
                    if (prev) {
                        const updated = await this.updateMentor(mentor.id, mentor);
                        if (updated) {
                            return resolve(updated);
                        }
                    }
                }

                mentor.fullName = buildName(mentor.firstName, mentor.lastName);
                const created = await Mentors.create(mentor, this._buildCreateOpts(mentor));
                cache.addMentor();

                // TODO: emit creation on websocket

                return resolve(created.toJSON() as IMentorEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to get a mentor by his identifier
     * @param {number} id mentor identifier
     * @param {boolean | undefined} archived is archived
     * @returns {Promise<IMentorEntity>} Resolve: mentor
     * @returns {Promise<void>} Resolve: not found
     * @returns {Promise<any>} Reject: database error
     */
    public getMentor(id: number, archived?: boolean): Promise<IMentorEntity> {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: Internships, as: 'internships' },
                    { model: Campaigns, as: 'campaigns' },
                    { model: MentoringPropositions, as: 'propositions' },
                ],
            };
            Mentors.findByPk(id, archived ? setFindOptsArchived(opts) : opts)
                .then((mentor) => resolve(mentor ? (mentor.toJSON() as IMentorEntity) : undefined))
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
    public updateMentor(id: number, next: Partial<IMentorEntity>): Promise<IMentorEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const mentor = await Mentors.findByPk(id);
                if (!mentor) {
                    if (checkPartialMentor(next)) {
                        delete next.id; // remove to prevent recursive calls
                        const created = await this.createMentor(next);
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

                mentor.set('fullName', buildName(mentor.firstName, mentor.lastName));
                const updated = await mentor.save();
                // TODO: emit updated mentor on websocket

                return resolve(updated.toJSON() as IMentorEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove an mentor
     * @param {number} id mentor identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeMentor(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const mentor = await Mentors.findByPk(id);
                if (mentor) {
                    await mentor.destroy();
                    cache.removeMentor();
                }

                // TODO: emit mentor destruction
                // TODO: add option to remove linked campaigns
                // TODO: add option to remove linked internships

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between mentor and his internship
     * @param {number} mentorId mentor identifier
     * @param {number} internshipId internship identifier
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToInternship(mentorId: number, internshipId: number): Promise<IMentorEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const handler = await InternshipModel.getHandler(internshipId);
                if (!handler) {
                    return resolve();
                }

                await handler.toAttributedMentor(mentorId);

                return resolve(await this.getMentor(mentorId));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between mentor and his campaign
     * @param {number} mentorId mentor identifier
     * @param {number} campaignId campaign identifier
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToCampaign(mentorId: number, campaignId: number): Promise<IMentorEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const mentor = await Mentors.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }
                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }

                await mentor.addCampaign(campaign);
                cache.linkMentor(campaign.id);

                // TODO: Emit update on socket

                return resolve(await this.getMentor(mentor.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between mentor and his proposition
     * @param {number} mentorId mentor identifier
     * @param {number} propositionId proposition identifier
     * @returns {Promise<IMentorEntity>} Resolve: IMentorEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToProposition(mentorId: number, propositionId: number): Promise<IMentorEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const mentor = await Mentors.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }
                const proposition = await MentoringPropositions.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }

                await mentor.addProposition(proposition);
                // TODO: Emit update on socket

                return resolve(await this.getMentor(mentor.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    private _buildFindOpts(opts: MentorOpts): FindOptions {
        let tmp: FindOptions = { include: [], where: {} };

        if (opts.campaignId) {
            tmp.include.push({
                model: Campaigns,
                as: 'campaigns',
                attributes: [],
                duplicating: false,
            });
            (tmp.where as any)['$campaigns.id$'] = opts.campaignId;
        }

        if (opts.name) {
            (tmp.where as any).fullName = { [sequelize.Op.substring]: opts.name };
        }

        if (opts.archived) {
            tmp = setFindOptsArchived(tmp);
        }

        return tmp;
    }

    private _buildCreateOpts(mentor: IMentorEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (mentor.campaigns) {
            let set = true;
            for (const campaign of mentor.campaigns) {
                if (!checkPartialCampaign(campaign) || campaign.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Mentors.associations.campaigns });
            }
        }

        if (mentor.propositions) {
            let set = true;
            for (const proposition of mentor.propositions) {
                if (!checkPartialProposition(proposition) || proposition.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Mentors.associations.propositions });
            }
        }

        if (mentor.internships) {
            let set = true;
            for (const internship of mentor.internships) {
                if (!checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Mentors.associations.internships });
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
export default MentorModel;
