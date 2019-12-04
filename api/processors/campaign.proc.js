"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyCampaign(data) {
    if (check_1.checkPartialCampaign(data)) {
        return {
            name: data.name,
            description: data.description,
            semester: data.semester,
            maxProposition: data.maxProposition,
            isPublish: !!data.isPublish,
            startAt: Number(data.startAt),
            endAt: Number(data.endAt),
        };
    }
    else {
        return undefined;
    }
}
exports.fullCopyCampaign = fullCopyCampaign;
//# sourceMappingURL=campaign.proc.js.map