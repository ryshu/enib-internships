"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.StudentList = Object.assign(Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.archivedValidator), { name: {
        in: ['query'],
        isString: { errorMessage: 'Name query param should be a string' },
        optional: true,
        trim: true,
        escape: true,
    } });
exports.StudentCreate = Object.assign(Object.assign({}, generator_val_1.studentVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('internships[*]')));
exports.StudentUpdate = generic_val_1.replaceAllExistByOptional(exports.StudentCreate);
//# sourceMappingURL=students.val.js.map