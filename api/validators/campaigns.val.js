"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.CampaignList = Object.assign({}, generic_val_1.archivedValidator);
exports.CampaignCreate = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, generator_val_1.campaignVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.categoryVal('category'))), generic_val_1.replaceAllExistByOptional(generator_val_1.propositionsVal('propositions[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.mentorVal('mentors[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('validatedInternships[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('availableInternships[*]')));
exports.CampaignUpdate = generic_val_1.replaceAllExistByOptional(exports.CampaignCreate);
//# sourceMappingURL=campaigns.val.js.map