import moment from 'moment';
import { CreateOptions, FindOptions } from 'sequelize';

// Declaration
import { ICampaignEntity } from '../declarations';

// Model (sequelize)
import Campaigns from './sequelize/Campaigns';
import MentoringPropositions from './sequelize/MentoringPropositions';
import InternshipTypes from './sequelize/InternshipTypes';
import Mentors from './sequelize/Mentors';
import Internships from './sequelize/Internships';

// Validator helpers
import {
    checkPartialCampaign,
    checkPartialInternshipType,
    checkPartialProposition,
    checkPartialMentor,
    checkPartialInternship,
} from '../utils/check';

import { setFindOptsArchived } from './helpers/options';

import InternshipTypeModel from './internship.type.mode';
import InternshipModel from './internship.model';

import cache from '../statistics/singleton';

/** @interface CampaignOpts Interface of all availables filters for campaigns list */
export declare interface CampaignOpts {
    /** @property {boolean} archived Show only archived campaigns */
    archived?: boolean;
}

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
    public getCampaigns(campaignOpts?: CampaignOpts): Promise<ICampaignEntity[]> {
        return new Promise((resolve, reject) => {
            const opts = this._buildFindOpts(campaignOpts);
            // TODO: Add filter by type + archived

            Campaigns.findAll(opts)
                .then((campaigns: any) =>
                    resolve(campaigns.length ? (campaigns as ICampaignEntity[]) : undefined),
                )
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
    public createCampaign(campaign: ICampaignEntity): Promise<ICampaignEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                // If id is given, check if campaign already exist
                // If so, launch update on it
                if (campaign.id) {
                    const prev = await Campaigns.findByPk(campaign.id);
                    if (prev) {
                        const updated = await this.updateCampaign(campaign.id, campaign);
                        return resolve(updated);
                    }
                }

                // Else, create new campaign
                const created = await Campaigns.create(campaign, this._buildCreateOpts(campaign));

                cache.newCampain(created.id, {
                    internships: {
                        total:
                            created.availableInternships.length +
                                created.validatedInternships.length || 0,
                        availables: created.availableInternships.length || 0,
                        attributed: created.validatedInternships.length || 0,
                    },

                    students:
                        created.availableInternships.length + created.validatedInternships.length ||
                        0,
                    mentors: created.mentors.length || 0,

                    propositions: created.propositions.length || 0,
                });

                // TODO: Add socket channel + create emit

                resolve(created.toJSON() as ICampaignEntity);
            } catch (error) {
                reject(error);
            }
        });
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
    public getCampaign(id: number, archived?: boolean): Promise<ICampaignEntity> {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: MentoringPropositions, as: 'propositions' },
                    { model: Mentors, as: 'mentors' },
                    { model: InternshipTypes, as: 'category' },
                    { model: Internships, as: 'validatedInternships' },
                    { model: Internships, as: 'availableInternships' },
                ],
            };
            // Includes all campaigns link
            Campaigns.findByPk(id, archived ? setFindOptsArchived(opts) : opts)
                .then((campaign: any) => resolve(campaign as ICampaignEntity))
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
    public updateCampaign(id: number, next: Partial<ICampaignEntity>): Promise<ICampaignEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const campaign = await Campaigns.findByPk(id);
                // Not campaign found, resolve undefined
                if (!campaign) {
                    // If we can create the requested update, create it
                    if (checkPartialCampaign(next)) {
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
                    campaign.set(
                        'startAt',
                        next.startAt === 0 ? null : moment(next.startAt).valueOf(),
                    );
                }
                if (!Number.isNaN(Number(next.endAt))) {
                    campaign.set('endAt', next.endAt === 0 ? null : moment(next.endAt).valueOf());
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
                        const updatedCat = await InternshipTypeModel.updateInternshipType(
                            next.category.id,
                            next.category,
                        );
                        catId = updatedCat.id;
                    } else if (checkPartialInternshipType(next.category)) {
                        delete next.category.id; // Prevent recursive call
                        const created = await InternshipTypeModel.createInternshipType(
                            next.category,
                        );
                        catId = created.id;
                    }
                    if (catId !== -1) {
                        const category = await InternshipTypes.findByPk(catId);
                        if (category) {
                            await campaign.setCategory(category);
                        }
                    }
                }

                // TODO: Add socket edit + emit

                const updated: any = await campaign.save();
                resolve(updated as ICampaignEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove a campaign by giving identifier
     * @param {number} id campaign identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeCampaign(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const campaign = await Campaigns.findByPk(id);
                if (!campaign) {
                    resolve();
                    return;
                }

                // Remove all propositions linked
                const propositions = await campaign.getPropositions();
                await Promise.all(
                    propositions.map((p) => {
                        cache.removeProposition(campaign.id);
                        return p.destroy();
                    }),
                );
                // TODO: Change this to map destory + socket destroy emit

                cache.removeCampaign(campaign.id);

                // TODO: Add archives function for internships
                // TODO: Add socket remove + emit;

                await campaign.destroy();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between campaign and his category
     * @param {number} campaignId campaign identifier
     * @param {number} categoryId category identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToCategory(campaignId: number, categoryId: number): Promise<ICampaignEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                const category = await InternshipTypes.findByPk(categoryId);
                if (!category) {
                    return resolve();
                }

                await campaign.setCategory(category);
                // TODO: Emit update on socket

                return resolve(await this.getCampaign(campaign.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between campaign and his mentor
     * @param {number} campaignId campaign identifier
     * @param {number} mentorId mentor identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToMentor(campaignId: number, mentorId: number): Promise<ICampaignEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                const mentor = await Mentors.findByPk(mentorId);
                if (!mentor) {
                    return resolve();
                }

                await campaign.addMentor(mentor);
                cache.linkMentor(campaign.id);
                // TODO: Emit update on socket

                return resolve(await this.getCampaign(campaign.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between campaign and his proposition
     * @param {number} campaignId campaign identifier
     * @param {number} propositionId proposition identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToProposition(campaignId: number, propositionId: number): Promise<ICampaignEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                const proposition = await MentoringPropositions.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }

                await campaign.addProposition(proposition);
                cache.linkProposition(campaign.id);
                // TODO: Emit update on socket

                return resolve(await this.getCampaign(campaign.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to setup link between campaign and his availableInternship
     * @param {number} campaignId campaign identifier
     * @param {number} availableInternshipId availableInternship identifier
     * @returns {Promise<ICampaignEntity>} Resolve: ICampaignEntity
     * @returns {Promise<void>} Resolve: void if something hasn't been found
     * @returns {Promise<any>} Reject: database error
     */
    public linkToAvailableInternship(
        campaignId: number,
        availableInternshipId: number,
    ): Promise<ICampaignEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const handler = await InternshipModel.getHandler(availableInternshipId);
                if (!handler) {
                    return resolve();
                }

                // Use handler to setup to campaign available state
                await handler.toCampaignAvailable(campaignId);

                return resolve(await this.getCampaign(campaignId));
            } catch (error) {
                reject(error);
            }
        });
    }

    private _buildFindOpts(opts: CampaignOpts): FindOptions {
        let tmp: FindOptions = {};

        if (opts.archived) {
            tmp = setFindOptsArchived(tmp);
        }

        return tmp;
    }

    private _buildCreateOpts(campaign: ICampaignEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (campaign.mentors) {
            let set = true;
            for (const mentor of campaign.mentors) {
                if (!checkPartialMentor(mentor) || mentor.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Campaigns.associations.mentors });
            }
        }

        if (campaign.propositions) {
            let set = true;
            for (const proposition of campaign.propositions) {
                if (!checkPartialProposition(proposition) || proposition.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Campaigns.associations.propositions });
            }
        }

        if (
            campaign.category &&
            checkPartialInternshipType(campaign.category) &&
            campaign.category.id !== undefined
        ) {
            opts.include.push({ association: Campaigns.associations.category });
        }

        if (campaign.availableInternships) {
            let set = true;
            for (const internship of campaign.availableInternships) {
                if (!checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Campaigns.associations.availableInternships });
            }
        }

        if (campaign.validatedInternships) {
            let set = true;
            for (const internship of campaign.validatedInternships) {
                if (!checkPartialInternship(internship) || internship.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Campaigns.associations.validatedInternships });
            }
        }

        if (opts.include.length === 0) {
            delete opts.include;
        }

        return opts;
    }
}

const CampaignModel = new CampaignModelStruct();
export default CampaignModel;
