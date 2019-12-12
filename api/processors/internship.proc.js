"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyInternship(data) {
    if (check_1.checkPartialInternship(data)) {
        return {
            // Data
            subject: data.subject,
            description: data.description,
            // Localization
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            address: data.address,
            additional: data.additional,
            // State
            isInternshipAbroad: !!data.isInternshipAbroad,
            state: data.state || "waiting" /* WAITING */,
            result: data.result || "unknown" /* UNKNOWN */,
            // Date
            publishAt: data.publishAt,
            startAt: data.startAt,
            endAt: data.endAt,
        };
    }
    else {
        return undefined;
    }
}
exports.fullCopyInternship = fullCopyInternship;
//# sourceMappingURL=internship.proc.js.map