"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @property {string} regex pattern to identify students */
const regex = /^[a-z][0-9][a-z]{1,6}/;
/**
 * @summary Method used to check if given casUser match student pattern
 * @param {string} casUser cas username
 * @returns {boolean} check result
 */
function isStudent(casUser) {
    if (regex.test(casUser)) {
        return true;
    }
    return false;
}
exports.isStudent = isStudent;
/**
 * @summary Method used to get email of given cas user
 * @param {string} casUser cas username
 * @returns {string} email
 */
function getEmail(casUser) {
    return `${casUser}@enib.fr`;
}
exports.getEmail = getEmail;
//# sourceMappingURL=utils.js.map