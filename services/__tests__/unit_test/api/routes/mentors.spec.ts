import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Mentors from '../../../../src/models/Mentors';
import Campaigns from '../../../../src/models/Campaigns';

import { defaultMentors, defaultCampaigns } from '../../../../__mocks__/mockData';

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /mentors', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    // In this case, we have 1 users every time during test
    // (the testing user which is setup every time)
    it('NoMentor_200', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors?limit=Nan`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Mentors_200', async () => {
        const VALID_MENTOR = defaultMentors();

        await Mentors.create(VALID_MENTOR);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body.data)).toBeTruthy();
        expect(RESPONSE.body).toMatchSnapshot({
            data: [
                {
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
                {
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ],
        });
    });
});

describe('POST /mentors', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidMentors_200', async () => {
        const VALID_MENTOR = defaultMentors();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors`)
            .send(VALID_MENTOR);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /mentors/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    it('NoMentor_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Mentors_200', async () => {
        const VALID_MENTOR = defaultMentors();

        const CREATED = await Mentors.create(VALID_MENTOR);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /mentors/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    it('NoMentor_204', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Mentors_200_UpdateAllData', async () => {
        const VALID_MENTOR = defaultMentors();

        const CREATED = await Mentors.create(VALID_MENTOR);

        // Change some data on VALID_MENTOR
        VALID_MENTOR.firstName = '250';

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED.id}`)
            .send(VALID_MENTOR);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Mentors_200_NotAnyDataUpdated', async () => {
        const VALID_MENTOR = defaultMentors();

        const CREATED = await Mentors.create(VALID_MENTOR);

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /mentors/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    it('NoMentor_200', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Mentors_200', async () => {
        const VALID_MENTOR = defaultMentors();

        const CREATED = await Mentors.create(VALID_MENTOR);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /mentors/:id/campaigns', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/10/campaigns`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/{falseEncoding}/campaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Mentors_200_NoLinkedData', async () => {
        const VALID_MENTOR = defaultMentors();

        const CREATED = await Mentors.create(VALID_MENTOR);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED.id}/campaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual([]);
    });

    it('Mentors_200_WithLinkedData', async () => {
        const VALID_MENTOR = defaultMentors();
        const VALID_CAMPAIGN = defaultCampaigns();

        let CREATED_MENTOR = await Mentors.create(VALID_MENTOR);
        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);

        await CREATED_MENTOR.addCampaign(CREATED_CAMPAIGN);
        CREATED_MENTOR = await Mentors.findByPk(CREATED_MENTOR.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED_MENTOR.id}/campaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /mentors/:id/campaigns/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/10/campaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/{falseEncoding}/campaigns/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/10/campaigns/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Mentors_204_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting campaigns work
        const VALID_MENTOR = defaultMentors();

        const CREATED = await Mentors.create(VALID_MENTOR);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED.id}/campaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Mentors_200_WithInternship', async () => {
        const VALID_MENTOR = defaultMentors();
        const VALID_CAMPAIGN = defaultCampaigns();

        let CREATED_MENTOR = await Mentors.create(VALID_MENTOR);
        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors/${CREATED_MENTOR.id}/campaigns/${CREATED_CAMPAIGN.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_MENTOR = await Mentors.findByPk(CREATED_MENTOR.id);

        const campaigns = await CREATED_MENTOR.getCampaigns();
        expect(campaigns).toHaveLength(1);
        expect(campaigns[0].id).toBe(CREATED_CAMPAIGN.id);
    });
});
