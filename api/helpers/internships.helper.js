"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const global_helper_1 = require("./global.helper");
const internship_model_1 = __importDefault(require("../../models/internship.model"));
exports.filtersByIdList = [
    'businessId',
    'studentId',
    'categoryId',
    'availableCampaignId',
    'validatedCampaignId',
    'campaignId',
    'mentorId',
];
function isFilterId(filterId) {
    return exports.filtersByIdList.includes(filterId);
}
exports.isFilterId = isFilterId;
function generateGetInternships(filterByID) {
    return (req, res, next) => {
        // @see validator + router
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
        }
        // Retrieve query data
        const { page = 1, limit = 20, countries, types, subject, mode = ["published" /* PUBLISHED */], isAbroad, mentorId, includes, archived, } = req.query;
        const opts = {
            countries,
            types,
            subject,
            mode,
            isAbroad,
            mentorId,
            includes,
            archived,
        };
        if (filterByID && isFilterId(filterByID)) {
            opts[filterByID] = Number(req.params.id);
        }
        internship_model_1.default.getInternships(opts, { page, limit })
            .then((val) => (global_helper_1.checkContent(val, next) ? res.send(val) : undefined))
            .catch((e) => global_helper_1.UNPROCESSABLE_ENTITY(next, e));
    };
}
exports.generateGetInternships = generateGetInternships;
//# sourceMappingURL=internships.helper.js.map