"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const internship_result_1 = require("./internship.result");
const internship_mode_1 = require("./internship.mode");
const Internships_1 = __importDefault(require("../models/sequelize/Internships"));
const Students_1 = __importDefault(require("../models/sequelize/Students"));
const Businesses_1 = __importDefault(require("../models/sequelize/Businesses"));
const InternshipTypes_1 = __importDefault(require("../models/sequelize/InternshipTypes"));
const Campaigns_1 = __importDefault(require("../models/sequelize/Campaigns"));
const Mentors_1 = __importDefault(require("../models/sequelize/Mentors"));
const MentoringPropositions_1 = __importDefault(require("../models/sequelize/MentoringPropositions"));
const Files_1 = __importDefault(require("../models/sequelize/Files"));
const error_1 = require("../utils/error");
function isInt(t) {
    return t && !Number.isNaN(Number(t));
}
class InternshipHandler {
    constructor(internship) {
        this._internship = internship;
    }
    toWaiting() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "published" /* PUBLISHED */) {
                    return reject(this._buildForbiddenError("waiting" /* WAITING */));
                }
                this._internship.publishAt = 0;
                this._internship.state = "waiting" /* WAITING */;
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toPublished() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "waiting" /* WAITING */) {
                    return reject(this._buildForbiddenError("published" /* PUBLISHED */));
                }
                this._internship.publishAt = moment_1.default().valueOf();
                this._internship.state = "published" /* PUBLISHED */;
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toAttributedStudent(studentId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "published" /* PUBLISHED */) {
                    return reject(this._buildForbiddenError("attributed_student" /* ATTRIBUTED_STUDENT */));
                }
                if (!isInt(studentId)) {
                    // TODO: Reject params val
                    return resolve(this);
                }
                const student = yield Students_1.default.findByPk(studentId);
                if (!student) {
                    return resolve(this);
                }
                yield this._internship.setStudent(student);
                this._internship.state = "attributed_student" /* ATTRIBUTED_STUDENT */;
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toCampaignAvailable(campaignId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "attributed_student" /* ATTRIBUTED_STUDENT */) {
                    return reject(this._buildForbiddenError("available_campaign" /* AVAILABLE_CAMPAIGN */));
                }
                if (!isInt(campaignId)) {
                    // TODO: Reject params val
                    return resolve(this);
                }
                const campaign = yield Campaigns_1.default.findByPk(campaignId);
                if (!campaign) {
                    return resolve();
                }
                if (this._internship.validatedCampaign) {
                    yield campaign.removeValidatedInternships(this._internship);
                }
                yield campaign.addAvailableInternship(this._internship);
                this._internship.state = "available_campaign" /* AVAILABLE_CAMPAIGN */;
                yield this.save();
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toAttributedMentor(mentorId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "available_campaign" /* AVAILABLE_CAMPAIGN */) {
                    return reject(this._buildForbiddenError("attributed_mentor" /* ATTRIBUTED_MENTOR */));
                }
                if (!isInt(mentorId) ||
                    !this._internship.availableCampaign ||
                    !isInt(this._internship.availableCampaign.id)) {
                    // TODO: Reject params val
                    return resolve(this);
                }
                const campaign = yield Campaigns_1.default.findByPk(this._internship.availableCampaign.id);
                if (!campaign) {
                    return resolve(this);
                }
                const mentor = yield Mentors_1.default.findByPk(mentorId);
                if (!mentor) {
                    return resolve(this);
                }
                yield this._internship.setMentor(mentor);
                yield campaign.removeAvailableInternships(this._internship);
                yield campaign.addValidatedInternship(this._internship);
                this._internship.state = "attributed_mentor" /* ATTRIBUTED_MENTOR */;
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toRunning(endAt) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "attributed_mentor" /* ATTRIBUTED_MENTOR */) {
                    throw this._buildForbiddenError("running" /* RUNNING */);
                }
                this._internship.state = "running" /* RUNNING */;
                this._internship.startAt = moment_1.default().valueOf();
                // Setup end date if existing and is number
                if (isInt(endAt)) {
                    this._internship.endAt = moment_1.default(endAt).valueOf();
                }
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toValidation() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.state !== "running" /* RUNNING */) {
                    throw this._buildForbiddenError("validation" /* VALIDATION */);
                }
                this._internship.state = "archived" /* ARCHIVED */;
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    archive(result) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                this._internship.state = "archived" /* ARCHIVED */;
                this._internship.result = internship_result_1.isInternshipResult(result)
                    ? "validated" /* VALIDATED */
                    : "unknown" /* UNKNOWN */;
                yield this.save();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    save() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._internship.save();
                yield this._sync();
                resolve(this);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    toJSON() {
        return this._internship.toJSON();
    }
    get state() {
        return this._internship.state;
    }
    get nextState() {
        return this._nextState(this.state);
    }
    _sync() {
        return __awaiter(this, void 0, void 0, function* () {
            this._internship = (yield Internships_1.default.findByPk(this._internship.id, {
                include: [
                    { model: Businesses_1.default, as: 'business' },
                    { model: InternshipTypes_1.default, as: 'category' },
                    { model: Campaigns_1.default, as: 'availableCampaign' },
                    { model: Campaigns_1.default, as: 'validatedCampaign' },
                    { model: Mentors_1.default, as: 'mentor' },
                    { model: MentoringPropositions_1.default, as: 'propositions' },
                    { model: Students_1.default, as: 'student' },
                    { model: Files_1.default, as: 'files' },
                ],
            }));
        });
    }
    _nextState(tested) {
        let mode;
        switch (tested) {
            case "archived" /* ARCHIVED */:
                mode = "archived" /* ARCHIVED */;
                break;
            case "attributed_mentor" /* ATTRIBUTED_MENTOR */:
                mode = "running" /* RUNNING */;
                break;
            case "attributed_student" /* ATTRIBUTED_STUDENT */:
                mode = "available_campaign" /* AVAILABLE_CAMPAIGN */;
                break;
            case "available_campaign" /* AVAILABLE_CAMPAIGN */:
                mode = "attributed_mentor" /* ATTRIBUTED_MENTOR */;
                break;
            case "published" /* PUBLISHED */:
                mode = "attributed_student" /* ATTRIBUTED_STUDENT */;
                break;
            case "running" /* RUNNING */:
                mode = "validation" /* VALIDATION */;
                break;
            case "validation" /* VALIDATION */:
                mode = "archived" /* ARCHIVED */;
                break;
            case "waiting" /* WAITING */:
                mode = "published" /* PUBLISHED */;
                break;
            default:
                break;
        }
        return mode;
    }
    _buildForbiddenError(next) {
        return new error_1.APIError(`Couldn't change internship from '${this.state}' to '${internship_mode_1.isInternshipMode(next) ? next : 'unknown_mode'}', expected next mode is '${this.nextState}'`, 400, 12000);
    }
}
exports.InternshipHandler = InternshipHandler;
//# sourceMappingURL=internship.js.map