"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
const generator_val_1 = require("./generator.val");
exports.FileList = Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.archivedValidator);
exports.FileCreate = Object.assign(Object.assign({}, generator_val_1.fileVal()), generic_val_1.replaceAllExistByOptional(generator_val_1.internshipVal('internship')));
exports.FileUpdate = generic_val_1.replaceAllExistByOptional(exports.FileCreate);
//# sourceMappingURL=files.val.js.map