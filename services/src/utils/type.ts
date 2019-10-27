/** @property {MentorRole[]} mentorRoles array of each mentors roles availables */
export const mentorRoles: MentorRole[] = ['default', 'admin'];

/**
 * @summary Method used to check if given string is a mentor role
 * @param {string} str string to check
 * @returns {boolean} check
 */
export function isMentorRole(str: string): str is MentorRole {
    return mentorRoles.includes(str as MentorRole);
}
