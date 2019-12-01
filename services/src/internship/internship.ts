import moment from 'moment';

import { INTERNSHIP_RESULT, isInternshipResult } from './internship.result';
import { INTERNSHIP_MODE, isInternshipMode } from './internship.mode';

import Internships from '../models/sequelize/Internships';
import Students from '../models/sequelize/Students';
import Businesses from '../models/sequelize/Businesses';
import InternshipTypes from '../models/sequelize/InternshipTypes';
import Campaigns from '../models/sequelize/Campaigns';
import Mentors from '../models/sequelize/Mentors';
import MentoringPropositions from '../models/sequelize/MentoringPropositions';
import Files from '../models/sequelize/Files';

import { APIError } from '../utils/error';
import { IInternshipEntity, ICampaignEntity } from '../declarations';

function isInt(t: number): t is number {
    return t && !Number.isNaN(Number(t));
}

export class InternshipHandler {
    private _internship: Internships;

    public constructor(internship: Internships) {
        this._internship = internship;
    }

    public toWaiting(): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.PUBLISHED) {
                    return reject(this._buildForbiddenError(INTERNSHIP_MODE.WAITING));
                }

                this._internship.publishAt = 0;
                this._internship.state = INTERNSHIP_MODE.WAITING;
                await this.save();

                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toPublished(): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.WAITING) {
                    return reject(this._buildForbiddenError(INTERNSHIP_MODE.PUBLISHED));
                }

                this._internship.publishAt = moment().valueOf();
                this._internship.state = INTERNSHIP_MODE.PUBLISHED;
                await this.save();

                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toAttributedStudent(studentId: number): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.PUBLISHED) {
                    return reject(this._buildForbiddenError(INTERNSHIP_MODE.ATTRIBUTED_STUDENT));
                }

                if (!isInt(studentId)) {
                    // TODO: Reject params val
                    return resolve(this);
                }
                const student = await Students.findByPk(studentId);
                if (!student) {
                    return resolve(this);
                }

                await this._internship.setStudent(student);
                this._internship.state = INTERNSHIP_MODE.ATTRIBUTED_STUDENT;
                await this.save();

                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toCampaignAvailable(campaignId: number): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.ATTRIBUTED_STUDENT) {
                    return reject(this._buildForbiddenError(INTERNSHIP_MODE.AVAILABLE_CAMPAIGN));
                }

                if (!isInt(campaignId)) {
                    // TODO: Reject params val
                    return resolve(this);
                }

                const campaign = await Campaigns.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }

                if (this._internship.validatedCampaign) {
                    await campaign.removeValidatedInternships(this._internship);
                }
                await campaign.addAvailableInternship(this._internship);
                this._internship.state = INTERNSHIP_MODE.AVAILABLE_CAMPAIGN;
                await this.save();

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    public toAttributedMentor(mentorId: number): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.AVAILABLE_CAMPAIGN) {
                    return reject(this._buildForbiddenError(INTERNSHIP_MODE.ATTRIBUTED_MENTOR));
                }

                if (
                    !isInt(mentorId) ||
                    !this._internship.availableCampaign ||
                    !isInt((this._internship.availableCampaign as ICampaignEntity).id)
                ) {
                    // TODO: Reject params val
                    return resolve(this);
                }

                const campaign = await Campaigns.findByPk(
                    (this._internship.availableCampaign as ICampaignEntity).id,
                );
                if (!campaign) {
                    return resolve(this);
                }

                const mentor = await Mentors.findByPk(mentorId);
                if (!mentor) {
                    return resolve(this);
                }

                await this._internship.setMentor(mentor);

                await campaign.removeAvailableInternships(this._internship);
                await campaign.addValidatedInternship(this._internship);

                this._internship.state = INTERNSHIP_MODE.ATTRIBUTED_MENTOR;
                await this.save();

                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toRunning(endAt?: number): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.ATTRIBUTED_MENTOR) {
                    throw this._buildForbiddenError(INTERNSHIP_MODE.RUNNING);
                }
                this._internship.state = INTERNSHIP_MODE.RUNNING;
                this._internship.startAt = moment().valueOf();

                // Setup end date if existing and is number
                if (isInt(endAt)) {
                    this._internship.endAt = moment(endAt).valueOf();
                }

                await this.save();

                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toValidation(): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.state !== INTERNSHIP_MODE.RUNNING) {
                    throw this._buildForbiddenError(INTERNSHIP_MODE.VALIDATION);
                }

                this._internship.state = INTERNSHIP_MODE.ARCHIVED;

                await this.save();
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public archive(result?: INTERNSHIP_RESULT): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                this._internship.state = INTERNSHIP_MODE.ARCHIVED;
                this._internship.result = isInternshipResult(result)
                    ? INTERNSHIP_RESULT.VALIDATED
                    : INTERNSHIP_RESULT.UNKNOWN;
                await this.save();

                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public save(): Promise<InternshipHandler> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._internship.save();
                await this._sync();
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toJSON(): IInternshipEntity {
        return this._internship.toJSON() as IInternshipEntity;
    }

    public get state() {
        return this._internship.state;
    }

    public get nextState() {
        return this._nextState(this.state);
    }

    private async _sync() {
        this._internship = (await Internships.findByPk(this._internship.id, {
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
        })) as Internships;
    }

    private _nextState(tested: INTERNSHIP_MODE) {
        let mode: INTERNSHIP_MODE;
        switch (tested) {
            case INTERNSHIP_MODE.ARCHIVED:
                mode = INTERNSHIP_MODE.ARCHIVED;
                break;
            case INTERNSHIP_MODE.ATTRIBUTED_MENTOR:
                mode = INTERNSHIP_MODE.RUNNING;
                break;
            case INTERNSHIP_MODE.ATTRIBUTED_STUDENT:
                mode = INTERNSHIP_MODE.AVAILABLE_CAMPAIGN;
                break;
            case INTERNSHIP_MODE.AVAILABLE_CAMPAIGN:
                mode = INTERNSHIP_MODE.ATTRIBUTED_MENTOR;
                break;
            case INTERNSHIP_MODE.PUBLISHED:
                mode = INTERNSHIP_MODE.ATTRIBUTED_STUDENT;
                break;
            case INTERNSHIP_MODE.RUNNING:
                mode = INTERNSHIP_MODE.VALIDATION;
                break;
            case INTERNSHIP_MODE.VALIDATION:
                mode = INTERNSHIP_MODE.ARCHIVED;
                break;
            case INTERNSHIP_MODE.WAITING:
                mode = INTERNSHIP_MODE.PUBLISHED;
                break;
            default:
                break;
        }

        return mode;
    }

    private _buildForbiddenError(next: INTERNSHIP_MODE) {
        return new APIError(
            `Couldn't change internship from '${this.state}' to '${
                isInternshipMode(next) ? next : 'unknown_mode'
            }', expected next mode is '${this.nextState}'`,
            400,
            12000,
        );
    }
}
