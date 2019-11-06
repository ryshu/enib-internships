import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';
import Campaigns from '../../../../src/models/Campaigns';
import Mentors from '../../../../src/models/Mentors';

// Import model for pre-operation before asserting API methods
import MentoringPropositions from '../../../../src/models/MentoringPropositions';
import Internships from '../../../../src/models/Internships';

import {
    defaultMentoringPropositions,
    defaultCampaigns,
    defaultMentors,
    defaultInternships,
} from '../../../../__mocks__/mockData';

const baseURL = `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`;

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /mentoringPropositions', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoMentoringPropositions_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions?limit=Nan`);
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions`);
        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body.data)).toBeTruthy();
        expect(RESPONSE.body).toMatchSnapshot({
            data: [
                {
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ],
        });
    });
});

describe('POST /mentoringPropositions', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/mentoringPropositions`);
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidMentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const RESPONSE = await request(app)
            .post(`${baseURL}/mentoringPropositions`)
            .send(VALID_MENTORING_PROPOSITION);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /mentoringPropositions/:id', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoMentoringPropositions_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /mentoringPropositions/:id', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoMentoringPropositions_204', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/mentoringPropositions/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/mentoringPropositions/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200_UpdateAllData', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);

        // Change some data on VALID_MENTORING_PROPOSITION
        VALID_MENTORING_PROPOSITION.comment = 'additional data';

        const RESPONSE = await request(app)
            .put(`${baseURL}/mentoringPropositions/${CREATED.id}`)
            .send(VALID_MENTORING_PROPOSITION);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('MentoringPropositions_200_NotAnyDataUpdated', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);

        const RESPONSE = await request(app)
            .put(`${baseURL}/mentoringPropositions/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /mentoringPropositions/:id', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoMentoringPropositions_200', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/mentoringPropositions/10`);
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `${baseURL}/mentoringPropositions/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);

        const RESPONSE = await request(app).delete(
            `${baseURL}/mentoringPropositions/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /mentoringPropositions/:id/campaigns', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions/10/campaigns`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/{falseEncoding}/campaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200_NoLinkedData', async () => {
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITIONS);
        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/${CREATED.id}/campaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('MentoringPropositions_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        let CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITIONS,
        );

        await CREATED_MENTORING_PROPOSITION.setCampaign(CREATED_CAMPAIGN.id);
        CREATED_MENTORING_PROPOSITION = await MentoringPropositions.findByPk(
            CREATED_MENTORING_PROPOSITION.id,
        );

        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/campaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /mentoringPropositions/:id/campaigns/:internship_type_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/10/campaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/{falseEncoding}/campaigns/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongBusinessID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/10/campaigns/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_204_NoBusiness', async () => {
        // In this case, we check if link a existing mentoringPropositions and an unexisting campaigns work
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITIONS);
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/${CREATED.id}/campaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('MentoringPropositions_200_WithBusiness', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        let CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITIONS,
        );

        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/campaigns/${CREATED_CAMPAIGN.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if campaign and internship are linked
        CREATED_MENTORING_PROPOSITION = await MentoringPropositions.findByPk(
            CREATED_MENTORING_PROPOSITION.id,
            {
                include: [{ model: Campaigns, as: 'campaign' }],
            },
        );

        const data = JSON.parse(JSON.stringify(CREATED_MENTORING_PROPOSITION.campaign)) as any;

        expect(CREATED_MENTORING_PROPOSITION.campaign).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /mentoringPropositions/:id/mentors', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions/10/mentors`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/{falseEncoding}/mentors`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200_NoLinkedData', async () => {
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITIONS);
        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/${CREATED.id}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('MentoringPropositions_200_WithLinkedData', async () => {
        const VALID_MENTOR = defaultMentors();
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);
        let CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITIONS,
        );

        await CREATED_MENTORING_PROPOSITION.setMentor(CREATED_MENTOR.id);
        CREATED_MENTORING_PROPOSITION = await MentoringPropositions.findByPk(
            CREATED_MENTORING_PROPOSITION.id,
        );

        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /mentoringPropositions/:id/mentors/:mentor_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/10/mentors/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/{falseEncoding}/mentors/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongMentorID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/10/mentors/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_204_NoMentor', async () => {
        // In this case, we check if link a existing mentoringPropositions and an unexisting mentors work
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITIONS);
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/${CREATED.id}/mentors/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('MentoringPropositions_200_WithMentor', async () => {
        const VALID_MENTOR = defaultMentors();
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);
        let CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITIONS,
        );

        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/mentors/${CREATED_MENTOR.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if mentor and internship are linked
        CREATED_MENTORING_PROPOSITION = await MentoringPropositions.findByPk(
            CREATED_MENTORING_PROPOSITION.id,
            {
                include: [{ model: Mentors, as: 'mentor' }],
            },
        );

        const data = JSON.parse(JSON.stringify(CREATED_MENTORING_PROPOSITION.mentor)) as any;

        expect(CREATED_MENTORING_PROPOSITION.mentor).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /mentoringPropositions/:id/internships', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/mentoringPropositions/10/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/{falseEncoding}/internships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200_NoLinkedData', async () => {
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITIONS);
        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/${CREATED.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('MentoringPropositions_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITIONS,
        );

        await CREATED_MENTORING_PROPOSITION.setInternship(CREATED_INTERNSHIP.id);
        CREATED_MENTORING_PROPOSITION = await MentoringPropositions.findByPk(
            CREATED_MENTORING_PROPOSITION.id,
        );

        const RESPONSE = await request(app).get(
            `${baseURL}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /mentoringPropositions/:id/internships/:internship_type_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/10/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/{falseEncoding}/internships/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/10/internships/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_204_NoInternship', async () => {
        // In this case, we check if link a existing mentoringPropositions and an unexisting internships work
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITIONS);
        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/${CREATED.id}/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('MentoringPropositions_200_WithInternship', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_MENTORING_PROPOSITIONS = defaultMentoringPropositions();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITIONS,
        );

        const RESPONSE = await request(app).post(
            `${baseURL}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/internships/${CREATED_INTERNSHIP.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if internship and internship are linked
        CREATED_MENTORING_PROPOSITION = await MentoringPropositions.findByPk(
            CREATED_MENTORING_PROPOSITION.id,
            {
                include: [{ model: Internships, as: 'internship' }],
            },
        );

        const data = JSON.parse(JSON.stringify(CREATED_MENTORING_PROPOSITION.internship)) as any;

        expect(CREATED_MENTORING_PROPOSITION.internship).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});
