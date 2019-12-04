"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.InternshipTypeList = Object.assign({}, generic_val_1.archivedValidator);
exports.InternshipTypeCreate = Object.assign(Object.assign(Object.assign({}, generator_val_1.categoryVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('internships[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.campaignVal('campaigns[*]')));
exports.InternshipTypeUpdate = generic_val_1.replaceAllExistByOptional(exports.InternshipTypeCreate);
//# sourceMappingURL=internshipTypes.val.js.map