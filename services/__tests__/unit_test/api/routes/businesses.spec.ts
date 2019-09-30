import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Businesses from '../../../../src/models/Businesses';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /businesses', () => {
    beforeEach(async () => {
        // Remove all
        await Businesses.destroy({ where: {}, truncate: true });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses?limit=Nan`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200', async () => {
        const VALID_BUSINESS: IBusinessEntity = {
            name: 'test',
            country: 'France',
            city: 'Brest',
            postalCode: '29200',
            address: 'TEST',
        };

        await Businesses.create(VALID_BUSINESS);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses`,
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

describe('POST /businesses', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidBusinesses_200', async () => {
        const REQ: IBusinessEntity = {
            name: 'test',
            country: 'France',
            city: 'Brest',
            postalCode: '29200',
            address: 'TEST',
        };

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses`)
            .send(REQ);
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
        await Businesses.destroy({ where: {}, truncate: true });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200', async () => {
        const VALID_BUSINESS: IBusinessEntity = {
            name: 'test',
            country: 'France',
            city: 'Brest',
            postalCode: '29200',
            address: 'TEST',
        };

        const CREATED = await Businesses.create(VALID_BUSINESS);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/${CREATED.id}`,
        );
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
        await Businesses.destroy({ where: {}, truncate: true });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200_UpdateAllData', async () => {
        const VALID_BUSINESS: IBusinessEntity = {
            name: 'test',
            country: 'France',
            city: 'Brest',
            postalCode: '29200',
            address: 'TEST',
        };

        const CREATED = await Businesses.create(VALID_BUSINESS);

        // Change some data on VALID_BUSINESS
        VALID_BUSINESS.additional = 'additional data';

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/${CREATED.id}`)
            .send(VALID_BUSINESS);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Businesses_200_NotAnyDataUpdated', async () => {
        const VALID_BUSINESS: IBusinessEntity = {
            name: 'test',
            country: 'France',
            city: 'Brest',
            postalCode: '29200',
            address: 'TEST',
        };

        const CREATED = await Businesses.create(VALID_BUSINESS);

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/${CREATED.id}`)
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
        await Businesses.destroy({ where: {}, truncate: true });
    });

    it('NoBusiness_200', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Businesses_200', async () => {
        const VALID_BUSINESS: IBusinessEntity = {
            name: 'test',
            country: 'France',
            city: 'Brest',
            postalCode: '29200',
            address: 'TEST',
        };

        const CREATED = await Businesses.create(VALID_BUSINESS);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/businesses/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});
