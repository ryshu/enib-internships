"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.BusinessesList = Object.assign(Object.assign(Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.contriesValidator), generic_val_1.archivedValidator), { name: {
        in: ['query'],
        isString: { errorMessage: 'Name filter must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    } });
exports.BusinessCreate = Object.assign(Object.assign(Object.assign({}, generator_val_1.businessVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('internships[*]'))), generic_val_1.replaceAllExistByOptional(generator_val_1.categoryVal('internships[*].category')));
exports.BusinessUpdate = generic_val_1.replaceAllExistByOptional(exports.BusinessCreate);
//# sourceMappingURL=businesses.val.js.map