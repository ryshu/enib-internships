import { cloneDeep } from 'lodash';

import cache from '../../../src/statistics/singleton';

const DEFAULT_STATISTICS = {
    internships: { total: 250, availables: 150, validated: 100 },
    students: 150,
    mentors: 200,
};

const DEFAULT_CAMPAIGN_STATISTICS = [
    {
        internships: { total: 250, availables: 150, validated: 100 },
        students: 150,
        mentors: 200,
    },
    {
        internships: { total: 250, availables: 150, validated: 100 },
        students: 150,
        mentors: 200,
        campaign: 10,
    },
];

describe('StatisticsCache', () => {
    beforeEach((done) => {
        // '#.reset()'
        cache.reset();

        // '#.init()'
        cache.init(DEFAULT_STATISTICS, ...DEFAULT_CAMPAIGN_STATISTICS);

        done();
    });

    it('#.reset()', () => {
        cache.reset();
        expect(cache.initialized).toBeFalsy();
        cache.reset();
    });

    it('#.init()', () => {
        cache.reset();
        expect(cache.initialized).toBeFalsy();

        cache.init(DEFAULT_STATISTICS, ...DEFAULT_CAMPAIGN_STATISTICS);
        expect(cache.statistics).toEqual(DEFAULT_STATISTICS);
        expect(cache.getCampaign(10)).toEqual(DEFAULT_CAMPAIGN_STATISTICS[1]);
        cache.init(DEFAULT_STATISTICS, ...DEFAULT_CAMPAIGN_STATISTICS);
    });

    it('#.incInternshipAvailables', () => {
        // Only default statistics
        cache.incInternshipAvailables();

        expect(cache.statistics.internships.availables).toEqual(
            DEFAULT_STATISTICS.internships.availables + 1,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total + 1,
        );

        // Default + campaign
        cache.incInternshipAvailables(10);

        expect(cache.statistics.internships.availables).toEqual(
            DEFAULT_STATISTICS.internships.availables + 2,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total + 2,
        );
        expect(cache.getCampaign(10)!.internships.availables).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.availables + 1,
        );
        expect(cache.getCampaign(10)!.internships.total).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.total + 1,
        );

        // Default + new campaign
        cache.incInternshipAvailables(25);
        expect(cache.getCampaign(25)).toEqual({
            internships: { total: 1, availables: 1, validated: 0 },
            students: 0,
            mentors: 0,
            campaign: 25,
        });
    });

    it('#.decInternshipAvailables', () => {
        // Only default statistics
        cache.decInternshipAvailables();

        expect(cache.statistics.internships.availables).toEqual(
            DEFAULT_STATISTICS.internships.availables - 1,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total - 1,
        );

        // Default + campaign
        cache.decInternshipAvailables(10);

        expect(cache.statistics.internships.availables).toEqual(
            DEFAULT_STATISTICS.internships.availables - 2,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total - 2,
        );
        expect(cache.getCampaign(10)!.internships.availables).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.availables - 1,
        );
        expect(cache.getCampaign(10)!.internships.total).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.total - 1,
        );

        // Default + new campaign
        cache.decInternshipAvailables(78);
        expect(cache.getCampaign(78)).toBeFalsy();
    });

    it('#.incInternshipValidated', () => {
        // Only default statistics
        cache.incInternshipValidated();

        expect(cache.statistics.internships.validated).toEqual(
            DEFAULT_STATISTICS.internships.validated + 1,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total + 1,
        );

        // Default + campaign
        cache.incInternshipValidated(10);

        expect(cache.statistics.internships.validated).toEqual(
            DEFAULT_STATISTICS.internships.validated + 2,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total + 2,
        );
        expect(cache.getCampaign(10)!.internships.validated).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.validated + 1,
        );
        expect(cache.getCampaign(10)!.internships.total).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.total + 1,
        );

        // Default + new campaign
        cache.incInternshipValidated(450);
        expect(cache.getCampaign(450)).toEqual({
            internships: { total: 1, availables: 0, validated: 1 },
            students: 0,
            mentors: 0,
            campaign: 450,
        });
    });

    it('#.decInternshipValidated', () => {
        // Only default statistics
        cache.decInternshipValidated();

        expect(cache.statistics.internships.validated).toEqual(
            DEFAULT_STATISTICS.internships.validated - 1,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total - 1,
        );

        // Default + campaign
        cache.decInternshipValidated(10);

        expect(cache.statistics.internships.validated).toEqual(
            DEFAULT_STATISTICS.internships.validated - 2,
        );
        expect(cache.statistics.internships.total).toEqual(
            DEFAULT_STATISTICS.internships.total - 2,
        );
        expect(cache.getCampaign(10)!.internships.validated).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.validated - 1,
        );
        expect(cache.getCampaign(10)!.internships.total).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.total - 1,
        );

        // Default + new campaign
        cache.decInternshipValidated(79);
        expect(cache.getCampaign(79)).toBeFalsy();
    });

    it('#.addMentor', () => {
        // Only default statistics
        cache.addMentor();

        expect(cache.statistics.mentors).toEqual(DEFAULT_STATISTICS.mentors + 1);

        // Default + campaign
        cache.addMentor(10);

        expect(cache.statistics.mentors).toEqual(DEFAULT_STATISTICS.mentors + 2);
        expect(cache.getCampaign(10)!.mentors).toEqual(DEFAULT_CAMPAIGN_STATISTICS[1].mentors + 1);

        // Default + new campaign
        cache.addMentor(451);
        expect(cache.getCampaign(451)).toEqual({
            internships: { total: 0, availables: 0, validated: 0 },
            students: 0,
            mentors: 1,
            campaign: 451,
        });
    });

    it('#.removeMentor', () => {
        // Only default statistics
        cache.removeMentor();

        expect(cache.statistics.mentors).toEqual(DEFAULT_STATISTICS.mentors - 1);

        // Default + campaign
        cache.removeMentor(10);

        expect(cache.statistics.mentors).toEqual(DEFAULT_STATISTICS.mentors - 2);
        expect(cache.getCampaign(10)!.mentors).toEqual(DEFAULT_CAMPAIGN_STATISTICS[1].mentors - 1);

        // Default + new campaign
        cache.removeMentor(452);
        expect(cache.getCampaign(452)).toBeFalsy();
    });

    it('#.linkMentor', () => {
        // Default + campaign
        cache.linkMentor(10);
        expect(cache.getCampaign(10)!.mentors).toEqual(DEFAULT_CAMPAIGN_STATISTICS[1].mentors + 1);

        // Default + new campaign
        cache.linkMentor(500);
        expect(cache.getCampaign(500)).toEqual({
            internships: { total: 0, availables: 0, validated: 0 },
            students: 0,
            mentors: 1,
            campaign: 500,
        });
    });

    it('#.addStudent', () => {
        // Only default statistics
        cache.addStudent();

        expect(cache.statistics.students).toEqual(DEFAULT_STATISTICS.students + 1);

        // Default + campaign
        cache.addStudent(10);

        expect(cache.statistics.students).toEqual(DEFAULT_STATISTICS.students + 2);
        expect(cache.getCampaign(10)!.students).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].students + 1,
        );

        // Default + new campaign
        cache.addStudent(453);
        expect(cache.getCampaign(453)).toEqual({
            internships: { total: 0, availables: 0, validated: 0 },
            students: 1,
            mentors: 0,
            campaign: 453,
        });
    });

    it('#.removeStudent', () => {
        // Only default statistics
        cache.removeStudent();

        expect(cache.statistics.students).toEqual(DEFAULT_STATISTICS.students - 1);

        // Default + campaign
        cache.removeStudent(10);

        expect(cache.statistics.students).toEqual(DEFAULT_STATISTICS.students - 2);
        expect(cache.getCampaign(10)!.students).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].students - 1,
        );

        // Default + new campaign
        cache.removeStudent(454);
        expect(cache.getCampaign(454)).toBeFalsy();
    });

    it('#.linkStudent', () => {
        // Default + campaign
        cache.linkStudent(10);
        expect(cache.getCampaign(10)!.students).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].students + 1,
        );

        // Default + new campaign
        cache.linkStudent(501);
        expect(cache.getCampaign(501)).toEqual({
            internships: { total: 0, availables: 0, validated: 0 },
            students: 1,
            mentors: 0,
            campaign: 501,
        });
    });

    it('#.validatedToAvailable', () => {
        // Default + campaign
        cache.validatedToAvailable(10);

        expect(cache.getCampaign(10)!.internships.validated).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.validated - 1,
        );
        expect(cache.getCampaign(10)!.internships.availables).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.availables + 1,
        );

        // Not enought availables
        cache.newCampain(550, {});
        const tmp = cloneDeep(cache.getCampaign(550));
        expect(tmp).toBeTruthy();

        cache.validatedToAvailable(550);
        expect(cache.getCampaign(550)).toEqual(tmp);

        // Default + new campaign
        cache.validatedToAvailable(551);
        expect(cache.getCampaign(551)).toBeFalsy();
    });

    it('#.availableToValidated', () => {
        // Default + campaign
        cache.availableToValidated(10);

        expect(cache.getCampaign(10)!.internships.validated).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.validated + 1,
        );
        expect(cache.getCampaign(10)!.internships.availables).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].internships.availables - 1,
        );

        // Not enought availables
        cache.newCampain(560, {});
        const tmp = cloneDeep(cache.getCampaign(560));
        expect(tmp).toBeTruthy();

        cache.availableToValidated(560);
        expect(cache.getCampaign(560)).toEqual(tmp);

        // Default + new campaign
        cache.availableToValidated(561);
        expect(cache.getCampaign(561)).toBeFalsy();
    });

    it('#.getCampaign', () => {
        expect(cache.getCampaign(10)).toBeTruthy();
        expect(cache.getCampaign(454)).toBeFalsy();
    });

    it('#.newCampain', () => {
        expect(cache.getCampaign(80)).toBeFalsy();
        cache.newCampain(80, {});
        expect(cache.getCampaign(80)).toBeTruthy();
    });

    it('#.isDefined', () => {
        expect(cache.isDefined(10)).toBeTruthy();
        expect(cache.isDefined(454)).toBeFalsy();
    });
});
