import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Campaigns from '../../../../src/models/Campaigns';
import MentoringPropositions from '../../../../src/models/MentoringPropositions';
import Mentors from '../../../../src/models/Mentors';

import {
    defaultCampaigns,
    defaultMentoringPropositions,
    defaultMentors,
} from '../../../../__mocks__/mockData';

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /campaigns', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN: ICampaignEntity = defaultCampaigns();

        await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body)).toBeTruthy();
        expect(RESPONSE.body[0]).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /campaigns', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidCampaigns_200', async () => {
        const REQ = defaultCampaigns();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`)
            .send(REQ);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /campaigns/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /campaigns/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_UpdateAllData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        // Change some data on VALID_CAMPAIGN
        VALID_CAMPAIGN.name = 'additional data';

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`)
            .send(VALID_CAMPAIGN);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Campaigns_200_NotAnyDataUpdated', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /campaigns/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_200', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /campaigns/:id/mentoringPropositions', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual([]);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITION,
        );

        await CREATED_CAMPAIGN.addProposition(CREATED_MENTORING_PROPOSITION);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /campaigns/:id/mentoringPropositions/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentoringPropositions/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/mentoringPropositions/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentoringPropositions/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting mentoringPropositions work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/mentoringPropositions/20/link`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Campaigns_200_WithInternship', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITION,
        );

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const mentoringPropositions = await CREATED_CAMPAIGN.getPropositions();
        expect(mentoringPropositions).toHaveLength(1);
        expect(mentoringPropositions[0].id).toBe(CREATED_MENTORING_PROPOSITION.id);
    });
});

describe('GET /campaigns/:id/mentors', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentors`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/mentors`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual([]);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTOR = defaultMentors();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);

        await CREATED_CAMPAIGN.addMentor(CREATED_MENTOR);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /campaigns/:id/mentors/:mentor_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentors/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/mentors/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongMentorID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentors/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoMentor', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting mentors work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/mentors/235012/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithMentor', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTOR = defaultMentors();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/mentors/${CREATED_MENTOR.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const mentors = await CREATED_CAMPAIGN.getMentors();
        expect(mentors).toHaveLength(1);
        expect(mentors[0].id).toBe(CREATED_MENTOR.id);
    });
});
