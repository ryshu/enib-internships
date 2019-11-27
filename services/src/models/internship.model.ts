import moment from 'moment';
import sequelize, { CreateOptions, FindOptions } from 'sequelize';

import { IInternshipEntity } from '../declarations';

import Internships from './sequelize/Internships';
import InternshipTypes from './sequelize/InternshipTypes';
import Businesses from './sequelize/Businesses';
import Campaigns from './sequelize/Campaigns';
import Mentors from './sequelize/Mentors';
import MentoringPropositions from './sequelize/MentoringPropositions';
import Students from './sequelize/Students';
import Files from './sequelize/Files';

import { PaginateList } from './helpers/type';
import { extractCount, setFindOptsArchived } from './helpers/options';
import {
    checkPartialBusiness,
    checkPartialCampaign,
    checkPartialFile,
    checkPartialInternship,
    checkPartialInternshipType,
    checkPartialMentor,
    checkPartialProposition,
    checkPartialStudent,
} from '../utils/check';
import { PaginateOpts, paginate } from './helpers/pagination';

import InternshipTypeModel from './internship.type.mode';
import { INTERNSHIP_MODE } from '../internship';
import { InternshipHandler } from '../internship/internship';

import { APIError } from '../utils/error';
import httpStatus from 'http-status-codes';

/** @interface InternshipOpts Interface of all availables filters for internship list */
export interface InternshipOpts {
    /** @property {string[]} countries List of selected countries to filter */
    countries?: string[];

    /** @property {number[]} types List of internship types identifier */
    types?: number[];

    /** @property {string} name Part of subject to apply filter on subject field (database) */
    subject?: string;

    /** @property {INTERNSHIP_MODE[]} mode Filter internships by mode */
    mode?: INTERNSHIP_MODE[];

    /** @property {boolean} isAbroad Select only foreign internships */
    isAbroad?: boolean;

    /** @property {number} businessId Filter list with businessId */
    businessId?: number;

    /** @property {number} studentId Filter list with studentId */
    studentId?: number;

    /** @property {number} categoryId Filter list with categoryId */
    categoryId?: number;

    /** @property {number} availableCampaignId Filter list with availableCampaignId */
    availableCampaignId?: number;

    /** @property {number} validatedCampaignId Filter list with validatedCampaignId */
    validatedCampaignId?: number;

    /** @property {number} campaignId Filter list with campaignId */
    campaignId?: number;

    /** @property {number} mentorId Filter list with mentorId */
    mentorId?: number;

    /** @property {string[]} includes Filter to include and populate given associations */
    includes?: string[];

    /** @property {boolean} archived Show only archived internship */
    archived?: boolean;
}

/**
 * @interface InternshipModelStruct
 * @class
 *
 * API for internship use in database
 */
class InternshipModelStruct {
    /**
     * @summary Method used to retrieve internships
     * @param {InternshipOpts} internshipOpts internship find options
     * @param {PaginateOpts} pageOpts pagination options
     * @returns {Promise<PaginateList<IInternshipEntity>>} Resolve: Paginated IInternshipEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    public getInternships(
        internshipOpts: InternshipOpts,
        pageOpts?: PaginateOpts,
    ): Promise<PaginateList<IInternshipEntity>> {
        return new Promise(async (resolve, reject) => {
            const opts = this._buildFindOpts(internshipOpts);

            let max: number;
            Internships.count(
                extractCount(opts, [
                    { model: InternshipTypes, as: 'category', attributes: [], duplicating: false },
                ]),
            )
                .then((rowNbr) => {
                    max = rowNbr;
                    return Internships.findAll(paginate(pageOpts, opts));
                })
                .then(async (internships: any) => {
                    if (internships.length !== 0) {
                        resolve({
                            page: pageOpts.page,
                            data: internships as IInternshipEntity[],
                            length: internships.length,
                            max,
                        });
                    } else {
                        resolve();
                    }
                })
                .catch((e) => reject(e));
        });
    }

    /**
     * @summary Method used to create a new internship
     * @notice If internship already exist, update it
     * @notice Also create or link sub-models if given
     * @param {IBusinessEntity} internship New internship data
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<any>} Reject: database error
     */
    public createInternship(internship: IInternshipEntity): Promise<IInternshipEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                if (internship.id) {
                    const prev = await Internships.findByPk(internship.id);
                    if (prev) {
                        const updated = await this.updateInternship(internship.id, internship);
                        return resolve(updated);
                    }
                }

                const created = await Internships.create(
                    internship,
                    this._buildCreateOpts(internship),
                );
                // TODO: Emit on socket new data

                return resolve(created.toJSON() as IInternshipEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to retrieve a internship by his identifier
     * @notice Include sub-struct by default
     * @param {number} id Internship identifier
     * @param {boolean} archived if archived
     * @returns {Promise<IInternshipEntity>} Resolve: IInternshipEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    public getInternship(id: number, archived?: boolean): Promise<IInternshipEntity> {
        return new Promise((resolve, reject) => {
            const opts = {
                include: [
                    { model: Businesses, as: 'business' },
                    { model: InternshipTypes, as: 'category' },
                    { model: Campaigns, as: 'availableCampaign' },
                    { model: Campaigns, as: 'validatedCampaign' },
                    { model: Mentors, as: 'mentor' },
                    { model: MentoringPropositions, as: 'propositions' },
                    { model: Students, as: 'student' },
                    { model: Files, as: 'files' },
                ],
            };
            Internships.findByPk(id, archived ? setFindOptsArchived(opts) : opts)
                .then((val) => resolve(val ? (val.toJSON() as IInternshipEntity) : undefined))
                .catch((e) => reject(e));
        });
    }

    /**
     * @summary Method used to update a internship entity
     * @notice If not any internship is found, but all update data required to create
     * a new internship is available, create this new internship
     * @param {number} id internship identifier
     * @param {Partial<IBusinessEntity>} next internship data to update
     * @returns {Promise<IBusinessEntity>} Resolve: IBusinessEntity
     * @returns {Promise<void>} Resolve: void if nothing is found
     * @returns {Promise<any>} Reject: database error
     */
    public updateInternship(id: number, next: any): Promise<IInternshipEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const internship = await Internships.findByPk(id);
                if (!internship) {
                    if (checkPartialInternship(next)) {
                        delete next.id;
                        const created = await this.createInternship(next);
                        return resolve(created);
                    }
                    return resolve();
                }

                if (next.subject) {
                    internship.set('subject', next.subject);
                }
                if (next.description) {
                    internship.set('description', next.description);
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
                            await internship.setCategory(category);
                        }
                    }
                }

                if (next.country) {
                    internship.set('country', next.country);
                }
                if (next.city) {
                    internship.set('city', next.city);
                }
                if (next.postalCode) {
                    internship.set('postalCode', next.postalCode);
                }
                if (next.address) {
                    internship.set('address', next.address);
                }
                if (next.additional) {
                    internship.set('additional', next.additional);
                }

                if (next.isInternshipAbroad !== undefined) {
                    internship.set('isInternshipAbroad', next.isInternshipAbroad ? true : false);
                }

                if (next.publishAt !== undefined) {
                    internship.set(
                        'publishAt',
                        next.publishAt === 0 || next.publishAt === null
                            ? null
                            : moment(next.publishAt).valueOf(),
                    );
                }
                if (next.startAt !== undefined) {
                    internship.set(
                        'startAt',
                        next.startAt === 0 || next.startAt === null
                            ? null
                            : moment(next.startAt).valueOf(),
                    );
                }
                if (next.endAt !== undefined) {
                    internship.set(
                        'endAt',
                        next.endAt === 0 || next.endAt === null
                            ? null
                            : moment(next.endAt).valueOf(),
                    );
                }

                const updated = await internship.save();
                // TODO: Emit update on socket

                return resolve(updated.toJSON() as IInternshipEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to remove internship
     * @param {number} id internship identifier
     * @returns {Promise<void>} Resolve: OK (may not be deleted, just resolve)
     * @returns {Promise<any>} Reject: database error
     */
    public removeInternship(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            // TODO: Remove also files
            // TODO: Remove also propositions

            // TODO: Update cache
            Internships.findByPk(id)
                .then((val) => (val ? val.destroy() : undefined))
                .then(() => resolve())
                .catch((e) => reject(e));
        });
    }

    /**
     * @summary Method used to link internship and file
     * @param {number} internshipId internship identifier
     * @param {number} fileId file identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    public linkToFile(internshipId: number, fileId: number): Promise<IInternshipEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const file = await Files.findByPk(fileId);
                if (!file) {
                    return resolve();
                }

                await internship.addFile(file);
                return resolve(internship.toJSON() as IInternshipEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to link internship and category
     * @param {number} internshipId internship identifier
     * @param {number} categoryId category identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    public linkToCategory(internshipId: number, categoryId: number): Promise<IInternshipEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const category = await InternshipTypes.findByPk(categoryId);
                if (!category) {
                    return resolve();
                }

                await internship.setCategory(category);

                return resolve(await this.getInternship(internship.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to link internship and proposition
     * @param {number} internshipId internship identifier
     * @param {number} propositionId proposition identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    public linkToProposition(
        internshipId: number,
        propositionId: number,
    ): Promise<IInternshipEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const proposition = await MentoringPropositions.findByPk(propositionId);
                if (!proposition) {
                    return resolve();
                }

                await internship.addProposition(proposition);
                return resolve(await this.getInternship(internship.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @summary Method used to link internship and business
     * @param {number} internshipId internship identifier
     * @param {number} businessId business identifier
     * @returns {Promise<IInternshipEntity>} Resolve: linked entity
     * @returns {Promise<void>} Resolve: nothing found to link
     * @returns {Promise<any>} Reject: database error
     */
    public linkToBusiness(internshipId: number, businessId: number): Promise<IInternshipEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const internship = await Internships.findByPk(internshipId);
                if (!internship) {
                    return resolve();
                }
                const business = await Businesses.findByPk(businessId);
                if (!business) {
                    return resolve();
                }

                await internship.setBusiness(business);
                return resolve(await this.getInternship(internship.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    public getHandler(internship: number | IInternshipEntity): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            let id;
            if (!Number.isNaN(Number(internship))) {
                id = Number(internship);
            } else if (!Number.isNaN(Number((internship as IInternshipEntity).id))) {
                id = Number((internship as IInternshipEntity).id);
            } else {
                return reject(
                    new APIError(
                        'No internship id provide to get handler',
                        httpStatus.BAD_REQUEST,
                        1200,
                    ),
                );
            }

            const val = await Internships.findByPk(id, {
                include: [
                    { model: Businesses, as: 'business' },
                    { model: InternshipTypes, as: 'category' },
                    { model: Campaigns, as: 'availableCampaign' },
                    { model: Campaigns, as: 'validatedCampaign' },
                    { model: Mentors, as: 'mentor' },
                    { model: MentoringPropositions, as: 'propositions' },
                    { model: Students, as: 'student' },
                    { model: Files, as: 'files' },
                ],
            });
            if (!val) {
                return resolve();
            }

            resolve(new InternshipHandler(val));
        });
    }

    private _buildFindOpts(opts: InternshipOpts): FindOptions {
        let tmp: FindOptions = {
            // By default, only give internship available list
            where: {},
            include: [{ model: InternshipTypes, as: 'category', duplicating: false }],
            group: [sequelize.col(`Internships.id`)],
        };

        if (opts.mode) {
            (tmp.where as any).state = opts.mode;
        }

        if (opts.countries) {
            // If country list is given, add it to query
            // Sequelize will translate it by "country in countries"
            (tmp.where as any).country = opts.countries;
        }

        if (opts.types) {
            // If category list is given, add it to query
            // Sequelize will translate it by "category in types"
            (tmp.where as any).categoryId = opts.types;
        }

        if (opts.subject) {
            // If subject filter is given, apply it using substring
            (tmp.where as any).subject = { [sequelize.Op.substring]: opts.subject };
        }

        if (opts.isAbroad) {
            (tmp.where as any).isInternshipAbroad = opts.isAbroad;
        }

        if (opts.categoryId !== undefined) {
            (tmp.where as any).categoryId = opts.categoryId;
        }
        if (opts.businessId !== undefined) {
            (tmp.where as any).businessId = opts.businessId;
        }
        if (opts.mentorId !== undefined) {
            (tmp.where as any).mentorId = opts.mentorId;
        }
        if (opts.studentId !== undefined) {
            (tmp.where as any).studentId = opts.studentId;
        }
        if (opts.availableCampaignId !== undefined) {
            (tmp.where as any).availableCampaignId = opts.availableCampaignId;
        }
        if (opts.validatedCampaignId !== undefined) {
            (tmp.where as any).validatedCampaignId = opts.validatedCampaignId;
        }
        if (opts.campaignId !== undefined) {
            (tmp.where as any)[sequelize.Op.or] = [
                { availableCampaignId: opts.campaignId },
                { validatedCampaignId: opts.campaignId },
            ];
        }

        if (opts.includes !== undefined) {
            for (const inc of opts.includes) {
                if (inc === 'files') {
                    tmp.include.push({ model: Files, association: 'files' });
                }
                if (inc === 'student') {
                    tmp.include.push({ model: Students, association: 'student' });
                }
                if (inc === 'mentor') {
                    tmp.include.push({ model: Mentors, association: 'mentor' });
                }
                if (inc === 'propositions') {
                    tmp.include.push({ model: MentoringPropositions, association: 'propositions' });
                }
                if (inc === 'validatedCampaign') {
                    tmp.include.push({ model: Campaigns, association: 'validatedCampaign' });
                }
                if (inc === 'availableCampaign') {
                    tmp.include.push({ model: Campaigns, association: 'availableCampaign' });
                }
                if (inc === 'business') {
                    tmp.include.push({ model: Businesses, association: 'business' });
                }
                if (inc === 'category') {
                    tmp.include.push({ model: InternshipTypes, association: 'category' });
                }
            }
        }

        if (opts.archived) {
            tmp = setFindOptsArchived(tmp);
        }

        return tmp;
    }

    private _buildCreateOpts(internship: IInternshipEntity): CreateOptions {
        const opts: CreateOptions = { include: [] };

        if (internship.files) {
            let set = true;
            for (const mentor of internship.files) {
                if (!checkPartialFile(mentor) || mentor.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Internships.associations.files });
            }
        }

        if (internship.propositions) {
            let set = true;
            for (const proposition of internship.propositions) {
                if (!checkPartialProposition(proposition) || proposition.id !== undefined) {
                    set = false;
                    break;
                }
            }

            if (set) {
                opts.include.push({ association: Internships.associations.propositions });
            }
        }

        if (
            internship.category &&
            checkPartialInternshipType(internship.category) &&
            internship.category.id !== undefined
        ) {
            opts.include.push({ association: Internships.associations.category });
        }

        if (
            internship.mentor &&
            checkPartialMentor(internship.mentor) &&
            internship.mentor.id !== undefined
        ) {
            opts.include.push({ association: Internships.associations.mentor });
        }

        if (
            internship.student &&
            checkPartialStudent(internship.student) &&
            internship.student.id !== undefined
        ) {
            opts.include.push({ association: Internships.associations.student });
        }

        if (
            internship.business &&
            checkPartialBusiness(internship.business) &&
            internship.business.id !== undefined
        ) {
            opts.include.push({ association: Internships.associations.business });
        }

        if (
            internship.availableCampaign &&
            checkPartialCampaign(internship.availableCampaign) &&
            internship.availableCampaign.id !== undefined
        ) {
            opts.include.push({ association: Internships.associations.availableCampaign });
        }

        if (
            internship.validatedCampaign &&
            checkPartialCampaign(internship.validatedCampaign) &&
            internship.validatedCampaign.id !== undefined
        ) {
            opts.include.push({ association: Internships.associations.validatedCampaign });
        }

        if (opts.include.length === 0) {
            delete opts.include;
        }

        return opts;
    }
}

const InternshipModel = new InternshipModelStruct();
export default InternshipModel;
