"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipsMode = [
    "waiting" /* WAITING */,
    "published" /* PUBLISHED */,
    "attributed_student" /* ATTRIBUTED_STUDENT */,
    "available_campaign" /* AVAILABLE_CAMPAIGN */,
    "attributed_mentor" /* ATTRIBUTED_MENTOR */,
    "running" /* RUNNING */,
    "validation" /* VALIDATION */,
    "archived" /* ARCHIVED */,
];
function isInternshipMode(str) {
    return exports.InternshipsMode.includes(str);
}
exports.isInternshipMode = isInternshipMode;
//# sourceMappingURL=internship.mode.js.map