import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Campaigns from '../../../../src/models/Campaigns';

import { defaultCampaigns } from '../../../../__mocks__/mockData';

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

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns?page={fgds}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN: ICampaignEntity = defaultCampaigns();

        await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
        );
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
