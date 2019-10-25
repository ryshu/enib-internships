/** @property {string} regex pattern to identify students */
const regex = /[a-z][0-9][a-z]{1,6}@enib\.fr/;

/**
 * @summary Method used to check if given casUser match student pattern
 * @param {string} casUser cas username
 * @returns {boolean} check result
 */
export function isStudent(casUser: string): boolean {
    if (regex.test(casUser)) {
        return true;
    }
    return false;
}

/**
 * @summary Method used to get email of given cas user
 * @param {string} casUser cas username
 * @returns {string} email
 */
export function getEmail(casUser: string): string {
    return `${casUser}@enib.fr`;
}

/** @summary Macro to set first letter upper case */
function ucFirst(str: string) {
    return str ? `${str[0].toUpperCase()}${str.slice(1)}` : '';
}

/**
 * @summary Method used to guess a mentor name
 * @param {string} casUser cas username
 * @returns {{ firstName: string; lastName: string }} First and last name guessed
 */
export function guessMentorFullName(casUser: string): { firstName: string; lastName: string } {
    const tmp = casUser.split('.');
    if (tmp.length !== 2) {
        throw new Error('Mentor name should use following pattern `firstName.lastName`');
    }
    return {
        firstName: ucFirst(tmp[0]),
        lastName: tmp[1].toUpperCase(),
    };
}

/**
 * @summary Method used to guess a student name
 * @param {string} casUser cas username
 * @returns {{ firstName: string; lastName: string }} First and last name guessed
 */
export function guessStudentFullName(casUser: string): { firstName: string; lastName: string } {
    if (!regex.test(casUser)) {
        throw new Error('Student name should use following pattern `/[a-z][0-9][a-z]{1, 6}/`');
    }
    return {
        firstName: casUser[0].toUpperCase(),
        lastName: casUser.slice(2).toUpperCase(),
    };
}
