"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const helper_1 = require("./helper");
class StatisticsCache {
    constructor() {
        this.statistics = this._defaultStatistics();
        this.campaignStatistics = {};
        this._initialized = false;
    }
    reset() {
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
    get initialized() {
        return this._initialized;
    }
    /**
     * @summary Method used to initialize the singletons
     * @param {Statistics} stats global statistics to input
     * @param {CampaignStatistics[]} campaignStats statistics by campaigns
     */
    init(stats, ...campaignStats) {
        // Check if not already _initialized
        if (!this._initialized) {
            const tmp = helper_1.getCleanStatistics(stats);
            this.statistics.internships = tmp.internships;
            this.statistics.mentors = tmp.mentors;
            this.statistics.students = tmp.students;
            this.statistics.propositions = tmp.propositions;
            for (const stat of campaignStats) {
                // Check if campaign is defined
                if (stat.campaign !== undefined && !Number.isNaN(Number(stat.campaign))) {
                    this.campaignStatistics[stat.campaign] = helper_1.getCleanCampaignStatistics(stat);
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
    stateChange(next, prev, id) {
        if (prev && base_1.isInternshipMode(prev)) {
            this._change(prev, -1, id);
        }
        if (base_1.isInternshipMode(next)) {
            this._change(next, 1, id);
        }
    }
    /**
     * @summary Method used to increase internships stats using mode and quantity
     * @param {INTERNSHIP_MODE} state Mode for apply change
     * @param {number} q Quantity to increase
     * @param {number | undefined} id Campaign id, if internship is link to a campaign
     */
    stateAdd(state, q, id) {
        if (base_1.isInternshipMode(state) && q > 0) {
            this._change(state, q, id);
        }
    }
    /**
     * @summary Method used to decrease internships stats using mode and quantity
     * @param {INTERNSHIP_MODE} state Mode for apply change
     * @param {number} q Quantity to decrease (q < 0)
     * @param {number | undefined} id Campaign id, if internship is link to a campaign
     */
    stateRemove(state, q, id) {
        if (base_1.isInternshipMode(state) && q < 0) {
            this._change(state, q, id);
        }
    }
    /**
     * @summary Method used to increment global mentor counter
     * @notice Use link mentor to increment campaign counters
     */
    addMentor() {
        this.statistics.mentors++;
    }
    /**
     * @summary Method used to decrement global mentor counter
     * @notice Use unlink mentor to decrement campaign counters
     */
    removeMentor() {
        this.statistics.mentors--;
    }
    /**
     * @summary Method used to increment mentor campaign counter
     * @param {number} id Campaign id
     */
    linkMentor(id) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].mentors++;
        }
    }
    /**
     * @summary Method used to decrement mentor campaign counter
     * @param {number} id Campaign id
     */
    unlinkMentor(id) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].mentors--;
        }
    }
    /**
     * @summary Method used to increment student counter
     * @param {number | undefined} id Campaign id, if student is linked to campaign directly
     */
    addStudent(id) {
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
    removeStudent(id) {
        if (id && this.isDefined(id)) {
            this.campaignStatistics[id].students--;
        }
        this.statistics.students--;
    }
    /**
     * @summary Method used to increment student campaign counter
     * @param {number} id Campaign id
     */
    linkStudent(id) {
        if (id) {
            this._defIfndef(id);
            this.campaignStatistics[id].students++;
        }
    }
    /**
     * @summary Method used to increment proposition counter
     * @param {number | undefined} id Campaign id, if proposition is linked to campaign directly
     */
    addProposition(id) {
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
    removeProposition(id) {
        if (id && this.isDefined(id)) {
            this.campaignStatistics[id].propositions--;
        }
        this.statistics.propositions--;
    }
    /**
     * @summary Method used to increment proposition campaign counter
     * @param {number} id Campaign id
     */
    linkProposition(id) {
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
    getCampaign(id) {
        return this.isDefined(id) ? this.campaignStatistics[id] : undefined;
    }
    /**
     * @summary Method used to create a new campaign
     * @param {number} id Campaign id
     * @param {Partial<CampaignStatistics>} stat Campaign's statistics
     */
    newCampain(id, stat) {
        this.campaignStatistics[id] = helper_1.getCleanCampaignStatistics(stat);
        this.campaignStatistics[id].campaign = id;
    }
    /**
     * @summary Method used to check if campaign is defined
     * @param {number} id campaign id
     * @returns {boolean} is defined ?
     */
    isDefined(id) {
        return !!this.campaignStatistics[id];
    }
    _change(mode, q, id) {
        switch (mode) {
            case "archived" /* ARCHIVED */:
                this.statistics.internships.archived += q;
                break;
            case "attributed" /* ATTRIBUTED */:
                if (this.isDefined(id)) {
                    this.campaignStatistics[id].internships.attributed += q;
                }
                this.statistics.internships.attributed += q;
                break;
            case "available" /* AVAILABLE */:
                if (this.isDefined(id)) {
                    this.campaignStatistics[id].internships.availables += q;
                }
                this.statistics.internships.availables += q;
                break;
            case "suggest" /* SUGGESTED */:
                this.statistics.internships.suggested += q;
                break;
            case "validated" /* VALIDATED */:
                this.statistics.internships.validated += q;
                break;
            case "waiting" /* WAITING */:
                this.statistics.internships.waiting += q;
                break;
            default:
                break;
        }
    }
    _defIfndef(id, cb, ...args) {
        if (!this.isDefined(id)) {
            this.campaignStatistics[id] = this._defaultCampaignStatistics(id);
            if (cb) {
                cb(...args);
            }
        }
    }
    _defaultStatistics() {
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
    _defaultCampaignStatistics(id) {
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
exports.default = cache;
//# sourceMappingURL=singleton.js.map