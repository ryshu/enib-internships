import { isMentorRole, mentorRoles } from '../../../src/utils/type';

describe('Types utilitaries', () => {
    it('isMentorRole_validRoles_true', () => {
        for (const item of mentorRoles) {
            expect(isMentorRole(item)).toBeTruthy();
        }
    });

    it('isMentorRole_invalidRole_false', () => {
        expect(isMentorRole('not_a_role')).toBeFalsy();
    });
});
