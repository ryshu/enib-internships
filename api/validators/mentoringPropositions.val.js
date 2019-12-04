"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.MentoringPropositionsList = Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.archivedValidator);
exports.MentoringPropositionCreate = Object.assign(Object.assign(Object.assign(Object.assign({}, generator_val_1.propositionsVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.campaignVal('campaign'))), generic_val_1.replaceAllExistByOptional(generator_val_1.mentorVal('mentor'))), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('internship')));
exports.MentoringPropositionUpdate = generic_val_1.replaceAllExistByOptional(exports.MentoringPropositionCreate);
//# sourceMappingURL=mentoringPropositions.val.js.map