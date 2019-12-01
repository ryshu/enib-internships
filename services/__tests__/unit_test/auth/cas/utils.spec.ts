import { isStudent, getEmail } from '../../../../src/auth/cas/utils';

describe('isStudent', () => {
    it('isStudent_studentPattern_true', () => {
        expect(isStudent('t5test')).toBeTruthy();
    });

    it('isStudent_other_false', () => {
        expect(isStudent('other_pattern')).toBeFalsy();
    });
});

describe('getEmail', () => {
    it('getEmail_casUser_email', () => {
        expect(getEmail('t5test')).toBe('t5test@enib.fr');
    });
});
