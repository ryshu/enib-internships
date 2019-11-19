"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
exports.BusinessesList = Object.assign(Object.assign(Object.assign({}, generic_val_1.paginateValidator), generic_val_1.contriesValidator), { name: {
        in: ['query'],
        isString: { errorMessage: 'Name filter must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    } });
exports.BusinessCreate = Object.assign({ name: {
        in: ['body'],
        isString: { errorMessage: 'Name must be of type string' },
        exists: { errorMessage: 'Name must be defined' },
        trim: true,
        escape: true,
    } }, generic_val_1.addressValidator);
exports.BusinessUpdate = generic_val_1.replaceAllExistByOptional(exports.BusinessCreate);
//# sourceMappingURL=businesses.val.js.map