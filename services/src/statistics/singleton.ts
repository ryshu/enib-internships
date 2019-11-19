import { Statistics } from './base';

import { getCleanStatistics } from './helper';

class StatisticsCache {
    public readonly statistics: Statistics;
    private _initialized: boolean;

    private campaignStatistics: Record<number, Statistics>;

    constructor() {
        this.statistics = this._defaultStatistics();

        this.campaignStatistics = {};
        this._initialized = false;
    }

    public reset() {
        if (this._initialized) {
            this.statistics.internships = { total: 0, availables: 0, validated: 0 };
            this.statistics.mentors = 0;
            this.statistics.students = 0;

            this._initialized = false;
        }
    }

    public get initialized() {
        return this._initialized;
    }

    /**
     * @summary Method used to initialize the singletons
     * @param {Statistics} stats global statistics to input
     * @param {Statistics[]} campaignStats statistics by campaigns
     */
    public init(stats: Statistics, ...campaignStats: Statistics[]) {
        // Check if not already _initialized
        if (!this._initialized) {
            const tmp = getCleanStatistics(stats);
            this.statistics.internships = tmp.internships;
            this.statistics.mentors = tmp.mentors;
            this.statistics.students = tmp.students;

            for (const stat of campaignStats) {
                // Check if campaign is defined
                if (stat.campaign !== undefined && !Number.isNaN(Number(stat.campaign))) {
                    this.campaignStatistics[stat.campaign] = getCleanStatistics(stat);
                }
            }

            this._initialized = true;
        }
    }

    /**
     * @summary Method used to increment available internship
     * @param {number | undefined} id Campaign id, if internship is linked to campaign directly
     */
    public incInternshipAvailables(id?: number) {
        this._incAv(id);
    }

    /**
     * @summary Method used to decrement available internship
     * @param {number | undefined} id Campaign id, if internship is linked to campaign directly
     */
    public decInternshipAvailables(id?: number) {
        this._incAv(id, -1);
    }

    /**
     * @summary Method used to increment validated internship
     * @param {number | undefined} id Campaign id, if internship is linked to campaign directly
     */
    public incInternshipValidated(id?: number) {
        this._incVal(id);
    }

    /**
     * @summary Method used to decrement validated internship
     * @param {number | undefined} id Campaign id, if internship is linked to campaign directly
     */
    public decInternshipValidated(id?: number) {
        this._incVal(id, -1);
    }

    /**
     * @summary Method used to increment mentor counter
     * @param {number | undefined} id Campaign id, if mentor is linked to campaign directly
     */
    public addMentor(id?: number) {
        this._incMentor(id);
    }

    /**
     * @summary Method used to decrement mentor counter
     * @param {number | undefined} id Campaign id, if mentor is linked to campaign directly
     */
    public removeMentor(id?: number) {
        this._incMentor(id, -1);
    }

    /**
     * @summary Method used to increment mentor campaign counter
     * @param {number} id Campaign id
     */
    public linkMentor(id: number) {
        this._linkMentor(id);
    }

    /**
     * @summary Method used to increment student counter
     * @param {number | undefined} id Campaign id, if student is linked to campaign directly
     */
    public addStudent(id?: number) {
        this._incStudent(id);
    }

    /**
     * @summary Method used to decrement student counter
     * @param {number | undefined} id Campaign id, if student is linked to campaign directly
     */
    public removeStudent(id?: number) {
        this._incStudent(id, -1);
    }

    /**
     * @summary Method used to increment student campaign counter
     * @param {number} id Campaign id
     */
    public linkStudent(id: number) {
        this._linkStudent(id);
    }

    /**
     * @summary Method used to transfer validated internships to available
     * @param {number | undefined} id Campaign id, if internship is linked to campaign
     */
    public validatedToAvailable(id?: number) {
        this._transfer(id, -1);
    }

    /**
     * @summary Method used to transfer available internships to validated
     * @param {number | undefined} id Campaign id, if internship is linked to campaign
     */
    public availableToValidated(id?: number) {
        this._transfer(id);
    }

    /**
     * @summary Method used to get Campaign statistics
     * @param {number} id Campaign ID
     * @returns {Statistics | undefined} Statistics or undefined
     */
    public getCampaign(id: number): Statistics | undefined {
        return this.isDefined(id) ? this.campaignStatistics[id] : undefined;
    }

    /**
     * @summary Method used to create a new campaign
     * @param {number} id Campaign id
     * @param {Partial<Statistics>} stat Campaign's statistics
     */
    public newCampain(id: number, stat: Partial<Statistics>) {
        this.campaignStatistics[id] = getCleanStatistics(stat);
        this.campaignStatistics[id].campaign = id;
    }

    /**
     * @summary Method used to check if campaign is defined
     * @param {number} id campaign id
     * @returns {boolean} is defined ?
     */
    public isDefined(id: number): boolean {
        return !!this.campaignStatistics[id];
    }

    private _incAv(id?: number, dir?: number) {
        if (id) {
            if (dir === undefined || dir > 0) {
                this._defIfndef(id);
                this.campaignStatistics[id].internships.availables += (dir || 1) * 1;
                this.campaignStatistics[id].internships.total += (dir || 1) * 1;
            } else if (this.isDefined(id)) {
                this.campaignStatistics[id].internships.availables += dir * 1;
                this.campaignStatistics[id].internships.total += dir * 1;
            }
        }

        this.statistics.internships.availables += (dir || 1) * 1;
        this.statistics.internships.total += (dir || 1) * 1;
    }

    private _incVal(id?: number, dir?: number) {
        if (id) {
            if (dir === undefined || dir > 0) {
                this._defIfndef(id);
                this.campaignStatistics[id].internships.validated += (dir || 1) * 1;
                this.campaignStatistics[id].internships.total += (dir || 1) * 1;
            } else if (this.isDefined(id)) {
                this.campaignStatistics[id].internships.validated += dir * 1;
                this.campaignStatistics[id].internships.total += dir * 1;
            }
        }

        this.statistics.internships.validated += (dir || 1) * 1;
        this.statistics.internships.total += (dir || 1) * 1;
    }

    private _incStudent(id?: number, dir?: number) {
        if (id) {
            if (dir === undefined || dir > 0) {
                this._defIfndef(id);
                this.campaignStatistics[id].students += (dir || 1) * 1;
            } else if (this.isDefined(id)) {
                this.campaignStatistics[id].students += dir * 1;
            }
        }

        this.statistics.students += (dir || 1) * 1;
    }

    private _linkStudent(id?: number, dir?: number) {
        if (id) {
            if (dir === undefined || dir > 0) {
                this._defIfndef(id);
                this.campaignStatistics[id].students += (dir || 1) * 1;
            } else if (this.isDefined(id)) {
                this.campaignStatistics[id].students += dir * 1;
            }
        }
    }

    private _incMentor(id?: number, dir?: number) {
        if (id) {
            if (dir === undefined || dir > 0) {
                this._defIfndef(id);
                this.campaignStatistics[id].mentors += (dir || 1) * 1;
            } else if (this.isDefined(id)) {
                this.campaignStatistics[id].mentors += dir * 1;
            }
        }

        this.statistics.mentors += (dir || 1) * 1;
    }

    private _linkMentor(id?: number, dir?: number) {
        if (id) {
            if (dir === undefined || dir > 0) {
                this._defIfndef(id);
                this.campaignStatistics[id].mentors += (dir || 1) * 1;
            } else if (this.isDefined(id)) {
                this.campaignStatistics[id].mentors += dir * 1;
            }
        }
    }

    private _transfer(id?: number, dir?: number) {
        if (id && this.isDefined(id) && this.campaignStatistics[id].internships.availables) {
            this.campaignStatistics[id].internships.validated += (dir || 1) * 1;
            this.campaignStatistics[id].internships.availables -= (dir || 1) * 1;
        }

        if (this.statistics.internships.availables) {
            this.statistics.internships.validated += (dir || 1) * 1;
            this.statistics.internships.availables -= (dir || 1) * 1;
        }
    }

    private _defIfndef(
        id: number,
        cb?: (...args: Array<string | number>) => void,
        ...args: Array<string | number>
    ) {
        if (!this.isDefined(id)) {
            this.campaignStatistics[id] = this._defaultStatistics(id);
            if (cb) {
                cb(...args);
            }
        }
    }

    private _defaultStatistics(id?: number) {
        return {
            internships: { total: 0, availables: 0, validated: 0 },
            students: 0,
            mentors: 0,

            campaign: id,
        };
    }
}

const cache = new StatisticsCache();
export default cache;
