"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * @summary Macro to generate ID validator
 * @param {string} id id field name
 * @param {string} msg `${msg} must be an integer`
 * @returns {Schema} Express validator schema for 'id' validation
 */
function namedID(id, msg) {
    return lodash_1.cloneDeep({
        [id]: {
            in: ['params'],
            isInt: { errorMessage: `${msg} must be an integer` },
            exists: { errorMessage: `${msg} must be defined` },
            toInt: true,
        },
    });
}
exports.namedID = namedID;
exports.ID = namedID('id', 'Identifier');
exports.InternshipID = namedID('internship_id', 'Internship identifier');
exports.InternshipTypeID = namedID('internship_type_id', 'Internship type identifier');
exports.BusinessID = namedID('business_id', 'Business identifier');
exports.StudentID = namedID('student_id', 'Student identifier');
exports.CampaignID = namedID('campaign_id', 'Campaign identifier');
exports.MentorID = namedID('mentor_id', 'Mentor identifier');
exports.MentoringPropositionID = namedID('mentoring_proposition_id', 'Mentoring proposition identifier');
exports.FileID = namedID('file_id', 'File identifier');
exports.paginateValidator = {
    page: {
        in: ['query'],
        isInt: { errorMessage: 'Page number must be an integer' },
        optional: true,
        toInt: true,
    },
    limit: {
        in: ['query'],
        isInt: { errorMessage: 'Limit of entries to provide must be an integer' },
        optional: true,
        toInt: true,
    },
};
//# sourceMappingURL=generic.val.js.map