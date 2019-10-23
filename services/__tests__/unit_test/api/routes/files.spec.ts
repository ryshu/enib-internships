import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Files from '../../../../src/models/Files';
import Internships from '../../../../src/models/Internships';

import { defaultFiles, defaultInternships } from '../../../../__mocks__/mockData';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /files', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {} });
    });

    it('NoFile_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files?limit=Nan`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Files_200', async () => {
        const VALID_FILE = defaultFiles();

        await Files.create(VALID_FILE);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files`,
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

describe('POST /files', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidFiles_200', async () => {
        const VALID_FILE = defaultFiles();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files`)
            .send(VALID_FILE);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /files/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {} });
    });

    it('NoFile_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Files_200', async () => {
        const VALID_FILE = defaultFiles();

        const CREATED = await Files.create(VALID_FILE);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /files/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {} });
    });

    it('NoFile_204', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Files_200_UpdateAllData', async () => {
        const VALID_FILE = defaultFiles();

        const CREATED = await Files.create(VALID_FILE);

        // Change some data on VALID_FILE
        VALID_FILE.size = 250;

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}`)
            .send(VALID_FILE);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Files_200_NotAnyDataUpdated', async () => {
        const VALID_FILE = defaultFiles();

        const CREATED = await Files.create(VALID_FILE);

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /files/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {} });
    });

    it('NoFile_200', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Files_200', async () => {
        const VALID_FILE = defaultFiles();

        const CREATED = await Files.create(VALID_FILE);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /files/:id/internships', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/10/internships`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/{falseEncoding}/internships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Files_200_NoLinkedData', async () => {
        const VALID_FILE = defaultFiles();

        const CREATED = await Files.create(VALID_FILE);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('Files_200_WithLinkedData', async () => {
        const VALID_FILE = defaultFiles();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_FILE = await Files.create(VALID_FILE);

        await CREATED_FILE.setInternship(CREATED_INTERNSHIP.id);
        CREATED_FILE = await Files.findByPk(CREATED_FILE.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED_FILE.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /files/:id/internships/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/10/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/{falseEncoding}/internships/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongBusinessID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/10/internships/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Files_204_NoBusiness', async () => {
        // In this case, we check if link a existing files and an unexisting internships work
        const VALID_FILE = defaultFiles();

        const CREATED = await Files.create(VALID_FILE);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}/internships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Files_200_WithBusiness', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_FILE = defaultFiles();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_FILE = await Files.create(VALID_FILE);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED_FILE.id}/internships/${CREATED_INTERNSHIP.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if category and internship are linked
        CREATED_FILE = await Files.findByPk(CREATED_FILE.id, {
            include: [{ model: Internships, as: 'internship' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_FILE.internship)) as any;

        expect(CREATED_FILE.internship).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});
