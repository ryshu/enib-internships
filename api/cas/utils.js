"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @property {string} regex pattern to identify students */
const regex = /[a-z][0-9][a-z]{1,6}@enib\.fr/;
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
/** @summary Macro to set first letter upper case */
function ucFirst(str) {
    return str ? `${str[0].toUpperCase()}${str.slice(1)}` : '';
}
/**
 * @summary Method used to guess a mentor name
 * @param {string} casUser cas username
 * @returns {{ firstName: string; lastName: string }} First and last name guessed
 */
function guessMentorFullName(casUser) {
    const tmp = casUser.split('.');
    if (tmp.length !== 2) {
        throw new Error('Mentor name should use following pattern `firstName.lastName`');
    }
    return {
        firstName: ucFirst(tmp[0]),
        lastName: tmp[1].toUpperCase(),
    };
}
exports.guessMentorFullName = guessMentorFullName;
/**
 * @summary Method used to guess a student name
 * @param {string} casUser cas username
 * @returns {{ firstName: string; lastName: string }} First and last name guessed
 */
function guessStudentFullName(casUser) {
    if (!regex.test(casUser)) {
        throw new Error('Student name should use following pattern `/[a-z][0-9][a-z]{1, 6}/`');
    }
    return {
        firstName: casUser[0].toUpperCase(),
        lastName: casUser.slice(2).toUpperCase(),
    };
}
exports.guessStudentFullName = guessStudentFullName;
//# sourceMappingURL=utils.js.map