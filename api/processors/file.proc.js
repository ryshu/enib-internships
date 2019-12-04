"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("../../utils/check");
function fullCopyFile(data) {
    if (check_1.checkPartialFile(data)) {
        return {
            name: data.name,
            type: data.type,
            path: data.path,
        };
    }
    else {
        return undefined;
    }
}
exports.fullCopyFile = fullCopyFile;
//# sourceMappingURL=file.proc.js.map