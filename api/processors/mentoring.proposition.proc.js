"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyMentoringProposition(data) {
    if (check_1.checkPartialProposition(data)) {
        return { comment: data.comment };
    }
    else {
        return undefined;
    }
}
exports.fullCopyMentoringProposition = fullCopyMentoringProposition;
//# sourceMappingURL=mentoring.proposition.proc.js.map