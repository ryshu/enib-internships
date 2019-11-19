import { Statistics, CampaignStatistics, INTERNSHIP_MODE, isInternshipMode } from './base';

import { getCleanStatistics, getCleanCampaignStatistics } from './helper';

class StatisticsCache {
    public readonly statistics: Statistics;
    private _initialized: boolean;

    private campaignStatistics: Record<number, CampaignStatistics>;

    constructor() {
        this.statistics = this._defaultStatistics();

        this.campaignStatistics = {};
        this._initialized = false;
    }

    public reset() {
        if (this._initialized) {
            this.statistics.internships = {
                total: 0,
                suggested: 0,
                waiting: 0,
                availables: 0,
                validated: 0,
                attributed: 0,
                archived: 0,
            };
            this.statistics.mentors = 0;
            this.statistics.students = 0;
            this.statistics.propositions = 0;

            for (const key in this.campaignStatistics) {
                if (this.campaignStatistics.hasOwnProperty(key)) {
                    delete this.campaignStatistics[key];
                }
            }

            this._initialized = false;
        }
    }

    public get initialized() {
        return this._initialized;
    }

    /**
     * @summary Method used to initialize the singletons
     * @param {Statistics} stats global statistics to input
     * @param {CampaignStatistics[]} campaignStats statistics by campaigns
     */
    public init(stats: Statistics, ...campaignStats: CampaignStatistics[]) {
        // Check if not already _initialized
        if (!this._initialized) {
            const tmp = getCleanStatistics(stats);
            this.statistics.internships = tmp.internships;
            this.statistics.mentors = tmp.mentors;
            this.statistics.students = tmp.students;
            this.statistics.propositions = tmp.propositions;

            for (const stat of campaignStats) {
                // Check if campaign is defined
                if (stat.campaign !== undefined && !Number.isNaN(Number(stat.campaign))) {
                    this.campaignStatistics[stat.campaign] = getCleanCampaignStatistics(stat);
                }
            }

            this._initialized = true;
        }
    }

    /**
     * @summary Method used to change state of an internship in cache
     * @param {INTERNSHIP_MODE} next Next internship mode
     * @param {INTERNSHIP_MODE | undefined} prev Previous internship mode
     * @param {number | undefined} id Campaign id, if internship is link to a campaign
     */
    public stateChange(next: INTERNSHIP_MODE, prev?: INTERNSHIP_MODE, id?: number) {
        if (prev && isInternshipMode(prev)) {
            this._change(prev, -1, id);
        }

        if (isInternshipMode(next)) {
            this._change(next, 1, id);
        }
    }

    /**
     * @summary Method used to increase internships stats using mode and quantity
     * @param {INTERNSHIP_MODE} state Mode for apply change
     * @param {number} q Quantity to increase
     * @param {number | undefined} id Campaign id, if internship is link to a campaign
     */
    public stateAdd(state: INTERNSHIP_MODE, q: number, id?: number) {
        if (isInternshipMode(state) && q > 0) {
            this._change(state, q, id);
        }
    }

    /**
     * @summary Method used to decrease internships stats using mode and quantity
     * @param {INTERNSHIP_MODE} state Mode for apply change
     * @param {number} q Quantity to decrease (q < 0)
     * @param {number | undefined} id Campaign id, if internship is link to a campaign
     */
    public stateRemove(state: INTERNSHIP_MODE, q: number, id?: number) {
        if (isInternshipMode(state) && q < 0) {
            this._change(state, q, id);
        }
    }

    /**
     * @summary Method used to increment global mentor counter
     * @notice Use link mentor to increment campaign counters
     */
    public addMentor() {
        this.statistics.mentors++;
    }

    /**
     * @summary Method used to decrement global mentor counter
     * @notice Use unlink mentor to decrement campaign counters
     */
    public removeMentor() {
        this.statistics.mentors--;
    }

    /**
     * @summary Method used to increment mentor campaign counter
     * @param {number} id Campaign id
     */
    public linkMentor(id: number) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].mentors++;
        }
    }

    /**
     * @summary Method used to decrement mentor campaign counter
     * @param {number} id Campaign id
     */
    public unlinkMentor(id: number) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].mentors--;
        }
    }

    /**
     * @summary Method used to increment student counter
     * @param {number | undefined} id Campaign id, if student is linked to campaign directly
     */
    public addStudent(id?: number) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].students++;
        }
        this.statistics.students++;
    }

    /**
     * @summary Method used to decrement student counter
     * @param {number | undefined} id Campaign id, if student is linked to campaign directly
     */
    public removeStudent(id?: number) {
        if (id && this.isDefined(id)) {
            this.campaignStatistics[id].students--;
        }
        this.statistics.students--;
    }

    /**
     * @summary Method used to increment student campaign counter
     * @param {number} id Campaign id
     */
    public linkStudent(id: number) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].students++;
        }
    }

    /**
     * @summary Method used to increment proposition counter
     * @param {number | undefined} id Campaign id, if proposition is linked to campaign directly
     */
    public addProposition(id?: number) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].propositions++;
        }
        this.statistics.propositions++;
    }

    /**
     * @summary Method used to decrement proposition counter
     * @param {number | undefined} id Campaign id, if proposition is linked to campaign directly
     */
    public removeProposition(id?: number) {
        if (id && this.isDefined(id)) {
            this.campaignStatistics[id].propositions--;
        }
        this.statistics.propositions--;
    }

    /**
     * @summary Method used to increment proposition campaign counter
     * @param {number} id Campaign id
     */
    public linkProposition(id: number) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].propositions++;
        }
    }

    /**
     * @summary Method used to get Campaign statistics
     * @param {number} id Campaign ID
     * @returns {CampaignStatistics | undefined} CampaignStatistics or undefined
     */
    public getCampaign(id: number): CampaignStatistics | undefined {
        return this.isDefined(id) ? this.campaignStatistics[id] : undefined;
    }

    /**
     * @summary Method used to create a new campaign
     * @param {number} id Campaign id
     * @param {Partial<CampaignStatistics>} stat Campaign's statistics
     */
    public newCampain(id: number, stat: Partial<CampaignStatistics>) {
        this.campaignStatistics[id] = getCleanCampaignStatistics(stat);
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

    private _change(mode: INTERNSHIP_MODE, q: number, id?: number) {
        switch (mode) {
            case INTERNSHIP_MODE.ARCHIVED:
                this.statistics.internships.archived += q;
                break;

            case INTERNSHIP_MODE.ATTRIBUTED:
                if (this.isDefined(id)) {
                    this.campaignStatistics[id].internships.attributed += q;
                }
                this.statistics.internships.attributed += q;
                break;

            case INTERNSHIP_MODE.AVAILABLE:
                if (this.isDefined(id)) {
                    this.campaignStatistics[id].internships.availables += q;
                }
                this.statistics.internships.availables += q;
                break;
            case INTERNSHIP_MODE.SUGGESTED:
                this.statistics.internships.suggested += q;
                break;

            case INTERNSHIP_MODE.VALIDATED:
                this.statistics.internships.validated += q;
                break;

            case INTERNSHIP_MODE.WAITING:
                this.statistics.internships.waiting += q;
                break;

            default:
                break;
        }
    }

    private _defIfndef(
        id: number,
        cb?: (...args: Array<string | number>) => void,
        ...args: Array<string | number>
    ) {
        if (!this.isDefined(id)) {
            this.campaignStatistics[id] = this._defaultCampaignStatistics(id);
            if (cb) {
                cb(...args);
            }
        }
    }

    private _defaultStatistics(): Statistics {
        return {
            internships: {
                total: 0,
                suggested: 0,
                waiting: 0,
                availables: 0,
                validated: 0,
                attributed: 0,
                archived: 0,
            },
            students: 0,
            mentors: 0,

            propositions: 0,
        };
    }

    private _defaultCampaignStatistics(id: number): CampaignStatistics {
        return {
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 0,
            mentors: 0,

            propositions: 0,
            campaign: id,
        };
    }
}

const cache = new StatisticsCache();
export default cache;
