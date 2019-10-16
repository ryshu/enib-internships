import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Students from '../../../../src/models/Students';

import { defaultStudents } from '../../../../__mocks__/mockData';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /students', () => {
    beforeEach(async () => {
        // Remove all
        await Students.destroy({ where: {} });
    });

    it('NoStudent_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students?limit=Nan`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Students_200', async () => {
        const VALID_STUDENT = defaultStudents();

        await Students.create(VALID_STUDENT);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students`,
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

describe('POST /students', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidStudents_200', async () => {
        const VALID_STUDENT = defaultStudents();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students`)
            .send(VALID_STUDENT);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /students/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Students.destroy({ where: {} });
    });

    it('NoStudent_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Students_200', async () => {
        const VALID_STUDENT = defaultStudents();

        const CREATED = await Students.create(VALID_STUDENT);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /students/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Students.destroy({ where: {} });
    });

    it('NoStudent_204', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Students_200_UpdateAllData', async () => {
        const VALID_STUDENT = defaultStudents();

        const CREATED = await Students.create(VALID_STUDENT);

        // Change some data on VALID_STUDENT
        VALID_STUDENT.lastName = 'Done';

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/${CREATED.id}`)
            .send(VALID_STUDENT);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Students_200_NotAnyDataUpdated', async () => {
        const VALID_STUDENT = defaultStudents();

        const CREATED = await Students.create(VALID_STUDENT);

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /students/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Students.destroy({ where: {} });
    });

    it('NoStudent_200', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Students_200', async () => {
        const VALID_STUDENT = defaultStudents();

        const CREATED = await Students.create(VALID_STUDENT);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/students/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});
