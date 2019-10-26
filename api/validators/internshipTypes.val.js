"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipTypeCreate = {
    label: {
        in: ['body'],
        isString: { errorMessage: 'Label must be of type string' },
        exists: { errorMessage: 'Label must be defined' },
        trim: true,
        escape: true,
    },
};
exports.InternshipTypeUpdate = {
    label: {
        in: ['body'],
        isString: { errorMessage: 'Label must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};
//# sourceMappingURL=internshipTypes.val.js.map