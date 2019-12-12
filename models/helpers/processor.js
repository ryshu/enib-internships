"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildName(firstName, lastName) {
    if (typeof firstName !== 'string' || firstName.length < 2 || typeof lastName !== 'string') {
        return '';
    }
    return `${firstName[0].toUpperCase()}${firstName
        .slice(1)
        .toLowerCase()} ${lastName.toUpperCase()}`;
}
exports.buildName = buildName;
//# sourceMappingURL=processor.js.map