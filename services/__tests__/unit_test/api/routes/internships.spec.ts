import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Internships from '../../../../src/models/Internships';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /internships', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {}, truncate: true });
    });

    it('NoInternships_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships?limit=Nan`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200', async () => {
        const VALID_INTERNSHIP: IInternshipEntity = {
            subject: 'test',
            description: 'Stage',
            country: 'France',
            city: 'Brest',
            postalCode: '29280',
            address: 'TEST',
            isLanguageCourse: true,
            isValidated: false,
        };

        await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships`,
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

describe('POST /internships', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidInternships_200', async () => {
        const REQ: IInternshipEntity = {
            subject: 'test',
            description: 'Stage',
            country: 'France',
            city: 'Brest',
            postalCode: '29280',
            address: 'TEST',
            isLanguageCourse: true,
            isValidated: false,
        };

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships`)
            .send(REQ);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /internships/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {}, truncate: true });
    });

    it('NoInternships_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200', async () => {
        const VALID_INTERNSHIP: IInternshipEntity = {
            subject: 'test',
            description: 'Stage',
            country: 'France',
            city: 'Brest',
            postalCode: '29280',
            address: 'TEST',
            isLanguageCourse: true,
            isValidated: false,
        };

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /internships/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {}, truncate: true });
    });

    it('NoInternships_204', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_UpdateAllData', async () => {
        const VALID_INTERNSHIP: IInternshipEntity = {
            subject: 'test',
            description: 'Stage',
            country: 'France',
            city: 'Brest',
            postalCode: '29280',
            address: 'TEST',
            isLanguageCourse: true,
            isValidated: false,
        };

        const CREATED = await Internships.create(VALID_INTERNSHIP);

        // Change some data on VALID_INTERNSHIP
        VALID_INTERNSHIP.additional = 'additional data';

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}`)
            .send(VALID_INTERNSHIP);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Internships_200_NotAnyDataUpdated', async () => {
        const VALID_INTERNSHIP: IInternshipEntity = {
            subject: 'test',
            description: 'Stage',
            country: 'France',
            city: 'Brest',
            postalCode: '29280',
            address: 'TEST',
            isLanguageCourse: true,
            isValidated: false,
        };

        const CREATED = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /internships/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {}, truncate: true });
    });

    it('NoInternships_200', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200', async () => {
        const VALID_INTERNSHIP: IInternshipEntity = {
            subject: 'test',
            description: 'Stage',
            country: 'France',
            city: 'Brest',
            postalCode: '29280',
            address: 'TEST',
            isLanguageCourse: true,
            isValidated: false,
        };

        const CREATED = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});
