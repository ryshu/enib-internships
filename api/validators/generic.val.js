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
//# sourceMappingURL=generic.val.js.map