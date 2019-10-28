import {
    isStudent,
    getEmail,
    guessMentorFullName,
    guessStudentFullName,
} from '../../../src/api/cas/utils';

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

describe('guessMentorFullName', () => {
    it('guessMentorFullName_wrongPattern_Throw', () => {
        try {
            guessMentorFullName('mentorname');
            throw new Error('Should had thrown');
        } catch (error) {
            expect(error).toEqual(
                new Error('Mentor name should use following pattern `firstName.lastName`'),
            );
        }
    });

    it('guessMentorFullName_pattern_guessStruct', () => {
        expect(guessMentorFullName('mentor.name')).toEqual({
            firstName: 'Mentor',
            lastName: 'NAME',
        });
    });
});

describe('guessStudentFullName', () => {
    it('guessStudentFullName_wrongPattern_throw', () => {
        try {
            guessStudentFullName('test');
            throw new Error('Should had thrown');
        } catch (error) {
            expect(error).toEqual(
                new Error('Student name should use following pattern `/[a-z][0-9][a-z]{1, 6}/`'),
            );
        }
    });

    it('guessStudentFullName_pattern_guessStruct', () => {
        expect(guessStudentFullName('t5test')).toEqual({
            firstName: 'T',
            lastName: 'TEST',
        });
    });
});
