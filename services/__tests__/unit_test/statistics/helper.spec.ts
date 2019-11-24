import { getCleanStatistics } from '../../../src/statistics/helper';
import { Statistics } from '../../../src/statistics/base';

describe('getCleanStatistics', () => {
    it('getCleanStatistics_partial_complete', () => {
        expect(getCleanStatistics({ students: 10 })).toEqual({
            internships: {
                total: 0,
                waiting: 0,
                published: 0,
                attributed_student: 0,
                available_campaign: 0,
                attributed_mentor: 0,
                running: 0,
                validation: 0,
                archived: 0,
            },
            students: 10,
            mentors: 0,
            propositions: 0,
        });
    });

    it('getCleanStatistics_empty_complete', () => {
        expect(getCleanStatistics({})).toEqual({
            internships: {
                total: 0,
                waiting: 0,
                published: 0,
                attributed_student: 0,
                available_campaign: 0,
                attributed_mentor: 0,
                running: 0,
                validation: 0,
                archived: 0,
            },
            students: 0,
            mentors: 0,
            propositions: 0,
        });
    });

    it('getCleanStatistics_full_same', () => {
        const VALID_COMPLET: Statistics = {
            internships: {
                total: 250,
                waiting: 30,
                published: 120,
                attributed_student: 50,
                available_campaign: 0,
                attributed_mentor: 0,
                running: 30,
                validation: 20,
                archived: 0,
            },
            students: 150,
            mentors: 200,
            propositions: 300,
        };
        expect(getCleanStatistics(VALID_COMPLET)).toEqual(VALID_COMPLET);
    });
});
