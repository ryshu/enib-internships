"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.MentorList = Object.assign(Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.archivedValidator), { name: {
        in: ['query'],
        isString: { errorMessage: 'Name query param should be a string' },
        optional: true,
        trim: true,
        escape: true,
    } });
exports.MentorCreate = Object.assign(Object.assign(Object.assign(Object.assign({}, generator_val_1.mentorVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.campaignVal('campaigns[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('internships[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.propositionsVal('propositions[*]')));
exports.MentorUpdate = generic_val_1.replaceAllExistByOptional(exports.MentorCreate);
//# sourceMappingURL=mentors.val.js.map