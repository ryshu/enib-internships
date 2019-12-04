"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipsResult = [
    "validated" /* VALIDATED */,
    "non-validated" /* NON_VALIDATED */,
    "unknown" /* UNKNOWN */,
    "canceled" /* CANCELED */,
];
function isInternshipResult(str) {
    return exports.InternshipsResult.includes(str);
}
exports.isInternshipResult = isInternshipResult;
//# sourceMappingURL=internship.result.js.map