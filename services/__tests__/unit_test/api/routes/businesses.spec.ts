import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Businesses from '../../../../src/models/sequelize/Businesses';
import Internships from '../../../../src/models/sequelize/Internships';

import {
    defaultBusiness,
    defaultInternships,
    defaultInternshipTypes,
} from '../../../../__mocks__/mockData';

const baseURL = `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`;

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /businesses', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/businesses`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/businesses?limit=Nan`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200', async () => {
        const VALID_BUSINESS = defaultBusiness();

        await Businesses.create(VALID_BUSINESS);
        const RESPONSE = await request(app).get(`${baseURL}/businesses`);
        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body.data)).toBeTruthy();
        expect(RESPONSE.body).toMatchSnapshot({
            data: [
                {
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ],
        });
    });
});

describe('POST /businesses', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/businesses`);
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidBusinesses_200', async () => {
        const VALID_BUSINESS = defaultBusiness();

        const RESPONSE = await request(app)
            .post(`${baseURL}/businesses`)
            .send(VALID_BUSINESS);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /businesses/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/businesses/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/businesses/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200', async () => {
        const VALID_BUSINESS = defaultBusiness();

        const CREATED = await Businesses.create(VALID_BUSINESS);
        const RESPONSE = await request(app).get(`${baseURL}/businesses/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /businesses/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/businesses/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/businesses/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200_UpdateAllData', async () => {
        const VALID_BUSINESS = defaultBusiness();

        const CREATED = await Businesses.create(VALID_BUSINESS);

        // Change some data on VALID_BUSINESS
        VALID_BUSINESS.additional = 'additional data';

        const RESPONSE = await request(app)
            .put(`${baseURL}/businesses/${CREATED.id}`)
            .send(VALID_BUSINESS);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Businesses_200_NotAnyDataUpdated', async () => {
        const VALID_BUSINESS = defaultBusiness();

        const CREATED = await Businesses.create(VALID_BUSINESS);

        const RESPONSE = await request(app)
            .put(`${baseURL}/businesses/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /businesses/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {} });
    });

    it('NoBusiness_200', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/businesses/10`);
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/businesses/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200', async () => {
        const VALID_BUSINESS = defaultBusiness();

        const CREATED = await Businesses.create(VALID_BUSINESS);

        const RESPONSE = await request(app).delete(`${baseURL}/businesses/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /businesses/:id/internships', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/businesses/10/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/businesses/{falseEncoding}/internships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_204_NoLinkedData', async () => {
        const VALID_BUSINESS = defaultBusiness();

        const CREATED = await Businesses.create(VALID_BUSINESS);
        const RESPONSE = await request(app).get(`${baseURL}/businesses/${CREATED.id}/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('Businesses_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_BUSINESS = defaultBusiness();
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();

        VALID_INTERNSHIP.category = VALID_INTERNSHIP_TYPE;
        VALID_BUSINESS.internships = [VALID_INTERNSHIP];

        const CREATED_BUSINESS = await Businesses.create(VALID_BUSINESS, {
            include: [
                {
                    association: Businesses.associations.internships,
                    include: [
                        {
                            association: Internships.associations.category,
                        },
                    ],
                },
            ],
        });

        const RESPONSE = await request(app).get(
            `${baseURL}/businesses/${CREATED_BUSINESS.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /businesses/:id/internships/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/businesses/10/internships/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/businesses/{falseEncoding}/internships/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/businesses/10/internships/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_204_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting internships work
        const VALID_BUSINESS = defaultBusiness();

        const CREATED = await Businesses.create(VALID_BUSINESS);
        const RESPONSE = await request(app).post(
            `${baseURL}/businesses/${CREATED.id}/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Businesses_200_WithInternship', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_BUSINESS = defaultBusiness();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_BUSINESS = await Businesses.create(VALID_BUSINESS);

        const RESPONSE = await request(app).post(
            `${baseURL}/businesses/${CREATED_BUSINESS.id}/internships/${CREATED_INTERNSHIP.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_BUSINESS = await Businesses.findByPk(CREATED_BUSINESS.id);

        const internships = await CREATED_BUSINESS.getInternships();
        expect(internships).toHaveLength(1);
        expect(internships[0].id).toBe(CREATED_INTERNSHIP.id);
    });
});
