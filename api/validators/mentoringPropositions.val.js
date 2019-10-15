"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_val_1 = require("./generic.val");
exports.MentoringPropositionsList = Object.assign({}, generic_val_1.paginateValidator);
exports.MentoringPropositionCreate = {
    comment: {
        in: ['body'],
        isString: { errorMessage: 'Comment must be of type string' },
        exists: { errorMessage: 'Comment must be defined' },
        trim: true,
        escape: true,
    },
};
exports.MentoringPropositionUpdate = {
    comment: {
        in: ['body'],
        isString: { errorMessage: 'Comment must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
};
//# sourceMappingURL=mentoringPropositions.val.js.map