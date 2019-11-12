"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
exports.FileList = Object.assign({}, generic_val_1.paginateValidator);
exports.FileCreate = {
    name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    },
    type: {
        in: ['body'],
        isString: { errorMessage: 'Type must be of type string' },
        exists: { errorMessage: 'Type must be defined' },
        trim: true,
        escape: true,
    },
};
exports.FileUpdate = generic_val_1.replaceAllExistByOptional(exports.FileCreate);
//# sourceMappingURL=files.val.js.map