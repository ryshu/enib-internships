import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Mentors from '../../../../src/models/Mentors';

import { defaultMentors } from '../../../../__mocks__/mockData';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /mentors', () => {
    beforeEach(async () => {
        // Remove all
        await Mentors.destroy({ where: {} });
    });

    it('NoFile_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentors`,
        );
        expect(RESPONSE.status).toBe(204);
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

    it('NoFile_204', async () => {
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

    it('NoFile_204', async () => {
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

    it('NoFile_200', async () => {
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
