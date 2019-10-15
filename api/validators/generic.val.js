"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = {
    id: {
        in: ['params'],
        isInt: { errorMessage: 'Identifier must be a string' },
        exists: { errorMessage: 'Identifier must be defined' },
        toInt: true,
    },
};
exports.paginateValidator = {
    page: {
        in: ['query'],
        isInt: { errorMessage: 'Page number must be an integer' },
        optional: true,
        toInt: true,
    },
    limit: {
        in: ['query'],
        isInt: { errorMessage: 'Limit of entries to provide must be an integer' },
        optional: true,
        toInt: true,
    },
};
//# sourceMappingURL=generic.val.js.map