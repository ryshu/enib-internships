"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyBusiness(data) {
    if (check_1.checkPartialBusiness(data)) {
        return {
            name: data.name,
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            address: data.address,
            additional: data.additional,
        };
    }
    else {
        return undefined;
    }
}
exports.fullCopyBusiness = fullCopyBusiness;
//# sourceMappingURL=businesse.proc.js.map