"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
exports.InternshipTypeCreate = {
    label: {
        in: ['body'],
        isString: { errorMessage: 'Label must be of type string' },
        exists: { errorMessage: 'Label must be defined' },
        trim: true,
        escape: true,
    },
};
exports.InternshipTypeUpdate = generic_val_1.replaceAllExistByOptional(exports.InternshipTypeCreate);
//# sourceMappingURL=internshipTypes.val.js.map