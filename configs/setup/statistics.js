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
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../../utils/logger"));
const singleton_1 = __importDefault(require("../../statistics/singleton"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const Students_1 = __importDefault(require("../../models/Students"));
const Mentors_1 = __importDefault(require("../../models/Mentors"));
const MentoringPropositions_1 = __importDefault(require("../../models/MentoringPropositions"));
const Campaigns_1 = __importDefault(require("../../models/Campaigns"));
function setupStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        function _searchCampaign(c) {
            return __awaiter(this, void 0, void 0, function* () {
                const campaignCond = {
                    [sequelize_1.Op.or]: [{ validatedCampaignId: c.id }, { availableCampaignId: c.id }],
                };
                return {
                    internships: {
                        total: yield Internships_1.default.count({ where: campaignCond }),
                        availables: yield Internships_1.default.count({ where: { availableCampaignId: c.id } }),
                        attributed: yield Internships_1.default.count({ where: { validatedCampaignId: c.id } }),
                    },
                    students: yield Internships_1.default.count({
                        where: Object.assign(Object.assign({}, campaignCond), { [sequelize_1.Op.not]: { studentId: null } }),
                    }),
                    mentors: yield c.countMentors(),
                    propositions: yield c.countPropositions(),
                    campaign: c.id,
                };
            });
        }
        const global = {
            internships: {
                total: yield Internships_1.default.count(),
                suggested: yield Internships_1.default.count({ where: { state: 'suggest' } }),
                waiting: yield Internships_1.default.count({ where: { state: 'waiting' } }),
                availables: yield Internships_1.default.count({ where: { state: 'available' } }),
                validated: yield Internships_1.default.count({ where: { state: 'validated' } }),
                attributed: yield Internships_1.default.count({ where: { state: 'attributed' } }),
                archived: yield Internships_1.default.count({ where: { state: 'archived' } }),
            },
            students: yield Students_1.default.count(),
            mentors: yield Mentors_1.default.count(),
            propositions: yield MentoringPropositions_1.default.count(),
        };
        const campaigns = yield Campaigns_1.default.findAll();
        const stats = yield Promise.all(campaigns.map((c) => _searchCampaign(c)));
        singleton_1.default.reset();
        singleton_1.default.init(global, ...stats);
        logger_1.default.info(`STATISTICS - ${JSON.stringify(global, null, 4)}`);
        stats.forEach((s) => logger_1.default.info(`STATISTICS - ${JSON.stringify(s, null, 4)}`));
    });
}
exports.setupStatistics = setupStatistics;
//# sourceMappingURL=statistics.js.map