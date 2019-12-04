"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyInternshipType(data) {
    if (check_1.checkPartialInternshipType(data)) {
        return { label: data.label };
    }
    else {
        return undefined;
    }
}
exports.fullCopyInternshipType = fullCopyInternshipType;
//# sourceMappingURL=internship.type.proc.js.map