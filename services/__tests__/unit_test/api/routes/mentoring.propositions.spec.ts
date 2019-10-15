import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import MentoringPropositions from '../../../../src/models/MentoringPropositions';

import { defaultMentoringPropositions } from '../../../../__mocks__/mockData';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /mentoringPropositions', () => {
    beforeEach(async () => {
        // Remove all
        await MentoringPropositions.destroy({ where: {} });
    });

    it('NoMentoringPropositions_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions?limit=Nan`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions`,
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

describe('POST /mentoringPropositions', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidMentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions`)
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
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/${CREATED.id}`,
        );
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
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200_UpdateAllData', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);

        // Change some data on VALID_MENTORING_PROPOSITION
        VALID_MENTORING_PROPOSITION.comment = 'additional data';

        const RESPONSE = await request(app)
            .put(
                `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/${CREATED.id}`,
            )
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
            .put(
                `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/${CREATED.id}`,
            )
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
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('MentoringPropositions_200', async () => {
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        const CREATED = await MentoringPropositions.create(VALID_MENTORING_PROPOSITION);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/mentoringPropositions/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});
