import cache from '../../../src/statistics/singleton';
import { Statistics, INTERNSHIP_MODE } from '../../../src/statistics/base';

const DEFAULT_STATISTICS: Statistics = {
    internships: {
        total: 250,
        suggested: 10,
        waiting: 30,
        availables: 150,
        attributed: 50,
        validated: 20,
        archived: 0,
    },
    students: 150,
    mentors: 200,
    propositions: 300,
};

const DEFAULT_CAMPAIGN_STATISTICS: any = [
    {
        internships: { total: 250, availables: 150, attributed: 100 },
        students: 150,
        mentors: 200,
        propositions: 300,
    },
    {
        internships: { total: 250, availables: 150, attributed: 100 },
        students: 150,
        mentors: 200,
        propositions: 300,
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

    it('#.stateChange ARCHIVED -> ATTRIBUTED', () => {
        cache.stateChange(INTERNSHIP_MODE.ARCHIVED, INTERNSHIP_MODE.ATTRIBUTED, 10);
        expect(cache.getCampaign(10)).toMatchSnapshot();
    });

    it('#.stateChange AVAILABLE -> VALIDATED', () => {
        cache.stateChange(INTERNSHIP_MODE.AVAILABLE, INTERNSHIP_MODE.VALIDATED, 10);
        expect(cache.getCampaign(10)).toMatchSnapshot();
    });

    it('#.stateChange AVAILABLE -> WAITING', () => {
        cache.stateChange(INTERNSHIP_MODE.AVAILABLE, INTERNSHIP_MODE.WAITING, 10);
        expect(cache.getCampaign(10)).toMatchSnapshot();
    });

    it('#.stateChange INVALID -> WAITING', () => {
        cache.stateChange('INVALID' as any, INTERNSHIP_MODE.WAITING, 10);
        expect(cache.getCampaign(10)).toMatchSnapshot();
    });

    it('#.stateAdd INVALID', () => {
        cache.stateAdd('INVALID' as any, 10);
        expect(cache.getCampaign(10)).toMatchSnapshot();
    });

    it('#.stateRemove INVALID', () => {
        cache.stateRemove('INVALID' as any, 10);
        expect(cache.getCampaign(10)).toMatchSnapshot();
    });

    it('#.addMentor', () => {
        // Default + campaign
        cache.addMentor();
        cache.addMentor();
        cache.addMentor();

        expect(cache.statistics.mentors).toEqual(DEFAULT_STATISTICS.mentors + 3);
    });

    it('#.removeMentor', () => {
        // Default + campaign
        cache.removeMentor();
        cache.removeMentor();
        cache.removeMentor();

        expect(cache.statistics.mentors).toEqual(DEFAULT_STATISTICS.mentors - 3);
    });

    it('#.linkMentor', () => {
        // Default + campaign
        cache.linkMentor(10);
        expect(cache.getCampaign(10)!.mentors).toEqual(DEFAULT_CAMPAIGN_STATISTICS[1].mentors + 1);

        // Default + new campaign
        cache.linkMentor(500);
        expect(cache.getCampaign(500)).toEqual({
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 0,
            mentors: 1,
            propositions: 0,
            campaign: 500,
        });

        cache.linkMentor(null as any);
    });

    it('#.unlinkMentor', () => {
        // Default + campaign
        cache.unlinkMentor(10);
        expect(cache.getCampaign(10)!.mentors).toEqual(DEFAULT_CAMPAIGN_STATISTICS[1].mentors - 1);

        // Default + new campaign
        cache.unlinkMentor(500);
        expect(cache.getCampaign(500)).toEqual({
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 0,
            mentors: -1,
            propositions: 0,
            campaign: 500,
        });

        cache.unlinkMentor(null as any);
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
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 1,
            mentors: 0,
            propositions: 0,
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
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 1,
            mentors: 0,
            propositions: 0,
            campaign: 501,
        });

        cache.linkStudent(null as any);
    });

    it('#.addProposition', () => {
        // Only default statistics
        cache.addProposition();

        expect(cache.statistics.propositions).toEqual(DEFAULT_STATISTICS.propositions + 1);

        // Default + campaign
        cache.addProposition(10);

        expect(cache.statistics.propositions).toEqual(DEFAULT_STATISTICS.propositions + 2);
        expect(cache.getCampaign(10)!.propositions).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].propositions + 1,
        );

        // Default + new campaign
        cache.addProposition(200);
        expect(cache.getCampaign(200)).toEqual({
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 0,
            mentors: 0,
            propositions: 1,
            campaign: 200,
        });
    });

    it('#.removeProposition', () => {
        // Only default statistics
        cache.removeProposition();

        expect(cache.statistics.propositions).toEqual(DEFAULT_STATISTICS.propositions - 1);

        // Default + campaign
        cache.removeProposition(10);

        expect(cache.statistics.propositions).toEqual(DEFAULT_STATISTICS.propositions - 2);
        expect(cache.getCampaign(10)!.propositions).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].propositions - 1,
        );

        // Default + new campaign
        cache.removeProposition(201);
        expect(cache.getCampaign(201)).toBeFalsy();
    });

    it('#.linkProposition', () => {
        // Default + campaign
        cache.linkProposition(10);
        expect(cache.getCampaign(10)!.propositions).toEqual(
            DEFAULT_CAMPAIGN_STATISTICS[1].propositions + 1,
        );

        // Default + new campaign
        cache.linkProposition(202);
        expect(cache.getCampaign(202)).toEqual({
            internships: { total: 0, availables: 0, attributed: 0 },
            students: 0,
            mentors: 0,
            propositions: 1,
            campaign: 202,
        });

        cache.linkProposition(null as any);
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
