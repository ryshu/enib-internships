import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import InternshipTypes from '../../../../src/models/sequelize/InternshipTypes';

import {
    defaultInternshipTypes,
    defaultInternships,
    defaultCampaigns,
} from '../../../../__mocks__/mockData';

import Internships from '../../../../src/models/sequelize/Internships';
import Campaigns from '../../../../src/models/sequelize/Campaigns';

const baseURL = `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`;

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /internshipTypes', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoInternshipTypes_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes`);
        expect(RESPONSE.status).toBe(204);
    });

    it('InternshipTypes_200', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes`);
        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body)).toBeTruthy();

        expect(RESPONSE.body).toBeTruthy();
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /internshipTypes', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/internshipTypes`);
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidInternshipTypes_200', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const RESPONSE = await request(app)
            .post(`${baseURL}/internshipTypes`)
            .send(VALID_INTERNSHIP_TYPES);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /internshipTypes/:id', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoInternshipTypes_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_200', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /internshipTypes/:id', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoInternshipTypes_204', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/internshipTypes/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/internshipTypes/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_200_UpdateAllData', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);

        // Change some data on VALID_INTERNSHIP_TYPES
        VALID_INTERNSHIP_TYPES.label = 'additional data';

        const RESPONSE = await request(app)
            .put(`${baseURL}/internshipTypes/${CREATED.id}`)
            .send(VALID_INTERNSHIP_TYPES);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('InternshipTypes_200_NotAnyDataUpdated', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);

        const RESPONSE = await request(app)
            .put(`${baseURL}/internshipTypes/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /internshipTypes/:id', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoInternshipTypes_200', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/internshipTypes/10`);
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/internshipTypes/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_200', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);

        const RESPONSE = await request(app).delete(`${baseURL}/internshipTypes/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /internshipTypes/:id/internships', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes/10/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internshipTypes/{falseEncoding}/internships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_204_NoLinkedData', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const RESPONSE = await request(app).get(
            `${baseURL}/internshipTypes/${CREATED.id}/internships`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('InternshipTypes_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();
        const VALID_INTERNSHIP = defaultInternships();

        VALID_INTERNSHIP_TYPES.internships = [VALID_INTERNSHIP];

        const CREATED_INTERNSHIP_TYPES = await InternshipTypes.create(VALID_INTERNSHIP_TYPES, {
            include: [{ association: InternshipTypes.associations.internships }],
        });

        const RESPONSE = await request(app).get(
            `${baseURL}/internshipTypes/${CREATED_INTERNSHIP_TYPES.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /internshipTypes/:id/internships/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/10/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/{falseEncoding}/internships/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/10/internships/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_204_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting internships work
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/${CREATED.id}/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('InternshipTypes_200_WithInternship', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();
        const VALID_INTERNSHIP = defaultInternships();

        let CREATED_INTERNSHIP_TYPES = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/${CREATED_INTERNSHIP_TYPES.id}/internships/${CREATED_INTERNSHIP.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_INTERNSHIP_TYPES = await InternshipTypes.findByPk(CREATED_INTERNSHIP_TYPES.id);

        const internships = await CREATED_INTERNSHIP_TYPES.getInternships();
        expect(internships).toHaveLength(1);
        expect(internships[0].id).toBe(CREATED_INTERNSHIP.id);
    });
});

describe('GET /internshipTypes/:id/campaigns', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internshipTypes/10/campaigns`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internshipTypes/{falseEncoding}/campaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_204_NoLinkedData', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const RESPONSE = await request(app).get(
            `${baseURL}/internshipTypes/${CREATED.id}/campaigns`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('InternshipTypes_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();
        const VALID_CAMPAIGN = defaultCampaigns();

        let CREATED_INTERNSHIP_TYPES = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);

        await CREATED_INTERNSHIP_TYPES.addCampaign(CREATED_CAMPAIGN.id);
        CREATED_INTERNSHIP_TYPES = await InternshipTypes.findByPk(CREATED_INTERNSHIP_TYPES.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internshipTypes/${CREATED_INTERNSHIP_TYPES.id}/campaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /internshipTypes/:id/campaigns/:campaign_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await InternshipTypes.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/internshipTypes/10/campaigns/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/{falseEncoding}/campaigns/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongCampaignID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/10/campaigns/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('InternshipTypes_204_NoCampaign', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting campaigns work
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();

        const CREATED = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/${CREATED.id}/campaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('InternshipTypes_200_WithCampaign', async () => {
        const VALID_INTERNSHIP_TYPES = defaultInternshipTypes();
        const VALID_CAMPAIGN = defaultCampaigns();

        let CREATED_INTERNSHIP_TYPES = await InternshipTypes.create(VALID_INTERNSHIP_TYPES);
        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app).post(
            `${baseURL}/internshipTypes/${CREATED_INTERNSHIP_TYPES.id}/campaigns/${CREATED_CAMPAIGN.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_INTERNSHIP_TYPES = await InternshipTypes.findByPk(CREATED_INTERNSHIP_TYPES.id);

        const campaigns = await CREATED_INTERNSHIP_TYPES.getCampaigns();
        expect(campaigns).toHaveLength(1);
        expect(campaigns[0].id).toBe(CREATED_CAMPAIGN.id);
    });
});
