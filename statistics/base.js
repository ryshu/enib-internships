"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipsMode = [
    "suggest" /* SUGGESTED */,
    "waiting" /* WAITING */,
    "available" /* AVAILABLE */,
    "attributed" /* ATTRIBUTED */,
    "validated" /* VALIDATED */,
    "archived" /* ARCHIVED */,
];
function isInternshipMode(str) {
    return exports.InternshipsMode.includes(str);
}
exports.isInternshipMode = isInternshipMode;
//# sourceMappingURL=base.js.map