import moment from 'moment';
import { cloneDeep } from 'lodash';

import { IInternshipEntity } from '../declarations';

import { INTERNSHIP_RESULT, isInternshipResult } from './internship.result';
import { INTERNSHIP_MODE, isInternshipMode } from './internship.mode';

import InternshipModel from '../models/internship.model';

import { APIError } from '../utils/error';

function isInt(t: number): t is number {
    return t && !Number.isNaN(Number(t));
}

export class InternshipHandler {
    private _internship: IInternshipEntity;

    public constructor(internship: IInternshipEntity) {
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

                if (isInt(studentId)) {
                    this._internship = await InternshipModel.linkToStudent(
                        this._internship.id,
                        studentId,
                    );
                }
                this._internship.state = INTERNSHIP_MODE.ATTRIBUTED_STUDENT;
                await this.save();

                resolve();
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

                if (isInt(campaignId)) {
                    this._internship = await InternshipModel.linkToAvailableCampaign(
                        this._internship.id,
                        campaignId,
                    );
                }
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

                if (isInt(mentorId)) {
                    this._internship = await InternshipModel.linkToMentor(
                        this._internship.id,
                        mentorId,
                    );
                    this._internship = await InternshipModel.linkToValidatedCampaign(
                        this._internship.id,
                        this._internship.availableCampaign.id,
                    );
                }
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
                this._internship = await InternshipModel.updateInternship(
                    this._internship.id,
                    cloneDeep(this._internship),
                );
                resolve(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    public toJSON(): IInternshipEntity {
        return this._internship;
    }

    public get state() {
        return this._internship.state;
    }

    public get nextState() {
        return this._nextState(this.state);
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
