import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Files from '../../../../src/models/Files';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /files', () => {
    beforeEach(async () => {
        // Remove all
        await Files.destroy({ where: {}, truncate: true });
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
        const VALID_STUDENT: IFileEntity = {
            name: 'fichier',
            size: 150,
            type: 'john.doe@enib.fr',
            path: 'S10',
        };

        await Files.create(VALID_STUDENT);
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
        const REQ: IFileEntity = {
            name: 'John',
            size: 150,
            type: 'john.doe@enib.fr',
            path: 'S10',
        };

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files`)
            .send(REQ);
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
        await Files.destroy({ where: {}, truncate: true });
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
        const VALID_STUDENT: IFileEntity = {
            name: 'John',
            size: 150,
            type: 'john.doe@enib.fr',
            path: 'S10',
        };

        const CREATED = await Files.create(VALID_STUDENT);
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
        await Files.destroy({ where: {}, truncate: true });
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
        const VALID_STUDENT: IFileEntity = {
            name: 'John',
            size: 150,
            type: 'john.doe@enib.fr',
            path: 'S10',
        };

        const CREATED = await Files.create(VALID_STUDENT);

        // Change some data on VALID_STUDENT
        VALID_STUDENT.size = 250;

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}`)
            .send(VALID_STUDENT);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Files_200_NotAnyDataUpdated', async () => {
        const VALID_STUDENT: IFileEntity = {
            name: 'John',
            size: 150,
            type: 'john.doe@enib.fr',
            path: 'S10',
        };

        const CREATED = await Files.create(VALID_STUDENT);

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
        await Files.destroy({ where: {}, truncate: true });
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
        const VALID_STUDENT: IFileEntity = {
            name: 'John',
            size: 150,
            type: 'john.doe@enib.fr',
            path: 'S10',
        };

        const CREATED = await Files.create(VALID_STUDENT);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/files/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});
