"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyStudent(data) {
    if (check_1.checkPartialStudent(data)) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            semester: data.semester,
        };
    }
    else {
        return undefined;
    }
}
exports.fullCopyStudent = fullCopyStudent;
//# sourceMappingURL=student.proc.js.map