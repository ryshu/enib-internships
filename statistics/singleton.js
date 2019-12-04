"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const internship_1 = require("../internship");
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
                waiting: 0,
                published: 0,
                attributed_student: 0,
                available_campaign: 0,
                attributed_mentor: 0,
                running: 0,
                validation: 0,
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
        if (prev && internship_1.isInternshipMode(prev)) {
            this._change(prev, -1, id);
        }
        if (internship_1.isInternshipMode(next)) {
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
        if (internship_1.isInternshipMode(state) && q > 0) {
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
        if (internship_1.isInternshipMode(state) && q < 0) {
            this._change(state, q, id);
        }
    }
    /**
     * @summary Method used to increment global mentor counter
     * @notice Use link mentor to increment campaign counters
     */
    addMentor() {
        this.statistics.mentors++;
        this.statistics.internships.total = this.total;
    }
    /**
     * @summary Method used to decrement global mentor counter
     * @notice Use unlink mentor to decrement campaign counters
     */
    removeMentor() {
        this.statistics.mentors--;
        this.statistics.internships.total = this.total;
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
    /**
     * @summary Getter for total of internship
     */
    get total() {
        return (this.statistics.internships.waiting +
            this.statistics.internships.published +
            this.statistics.internships.attributed_student +
            this.statistics.internships.attributed_mentor +
            this.statistics.internships.available_campaign +
            this.statistics.internships.running +
            this.statistics.internships.validation +
            this.statistics.internships.archived);
    }
    _change(mode, q, id) {
        switch (mode) {
            case "archived" /* ARCHIVED */:
                this.statistics.internships.archived += q;
                break;
            case "attributed_mentor" /* ATTRIBUTED_MENTOR */:
                if (this.isDefined(id)) {
                    this.campaignStatistics[id].internships.attributed += q;
                }
                this.statistics.internships.attributed_mentor += q;
                break;
            case "attributed_student" /* ATTRIBUTED_STUDENT */:
                this.statistics.internships.attributed_student += q;
                break;
            case "available_campaign" /* AVAILABLE_CAMPAIGN */:
                if (this.isDefined(id)) {
                    this.campaignStatistics[id].internships.availables += q;
                }
                this.statistics.internships.available_campaign += q;
                break;
            case "waiting" /* WAITING */:
                this.statistics.internships.waiting += q;
                break;
            case "validation" /* VALIDATION */:
                this.statistics.internships.validation += q;
                break;
            case "running" /* RUNNING */:
                this.statistics.internships.running += q;
                break;
            case "published" /* PUBLISHED */:
                this.statistics.internships.published += q;
                break;
            default:
                break;
        }
        this.statistics.internships.total = this.total;
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
                waiting: 0,
                published: 0,
                attributed_student: 0,
                attributed_mentor: 0,
                available_campaign: 0,
                running: 0,
                validation: 0,
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