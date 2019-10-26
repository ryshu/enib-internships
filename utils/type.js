"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @property {MentorRole[]} mentorRoles array of each mentors roles availables */
exports.mentorRoles = ['default', 'admin'];
/**
 * @summary Method used to check if given string is a mentor role
 * @param {string} str string to check
 * @returns {boolean} check
 */
function isMentorRole(str) {
    return exports.mentorRoles.includes(str);
}
exports.isMentorRole = isMentorRole;
//# sourceMappingURL=type.js.map