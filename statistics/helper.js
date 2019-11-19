"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function getCleanStatistics(stats) {
    const tmp = lodash_1.cloneDeep(stats);
    return {
        internships: tmp.internships
            ? {
                total: tmp.internships.total || 0,
                suggested: tmp.internships.suggested || 0,
                waiting: tmp.internships.waiting || 0,
                availables: tmp.internships.availables || 0,
                attributed: tmp.internships.attributed || 0,
                validated: tmp.internships.validated || 0,
                archived: tmp.internships.archived || 0,
            }
            : {
                total: 0,
                suggested: 0,
                waiting: 0,
                availables: 0,
                validated: 0,
                attributed: 0,
                archived: 0,
            },
        mentors: tmp.mentors || 0,
        students: tmp.students || 0,
        propositions: tmp.propositions || 0,
    };
}
exports.getCleanStatistics = getCleanStatistics;
function getCleanCampaignStatistics(stats) {
    const tmp = lodash_1.cloneDeep(stats);
    return {
        internships: tmp.internships
            ? {
                total: tmp.internships.total || 0,
                availables: tmp.internships.availables || 0,
                attributed: tmp.internships.attributed || 0,
            }
            : { total: 0, availables: 0, attributed: 0 },
        mentors: tmp.mentors || 0,
        students: tmp.students || 0,
        propositions: tmp.propositions || 0,
        campaign: tmp.campaign,
    };
}
exports.getCleanCampaignStatistics = getCleanCampaignStatistics;
//# sourceMappingURL=helper.js.map