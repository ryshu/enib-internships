"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyMentor(data) {
    if (check_1.checkPartialMentor(data)) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
        };
    }
    else {
        return undefined;
    }
}
exports.fullCopyMentor = fullCopyMentor;
//# sourceMappingURL=mentor.proc.js.map