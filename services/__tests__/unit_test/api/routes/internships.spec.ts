import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Internships from '../../../../src/models/Internships';
import Businesses from '../../../../src/models/Businesses';
import Students from '../../../../src/models/Students';
import InternshipTypes from '../../../../src/models/InternshipTypes';
import Files from '../../../../src/models/Files';

import {
    defaultInternships,
    defaultBusiness,
    defaultInternshipTypes,
    defaultStudents,
    defaultFiles,
} from '../../../../__mocks__/mockData';

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /internships', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
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
        const VALID_INTERNSHIP = defaultInternships();

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
        const VALID_INTERNSHIP = defaultInternships();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships`)
            .send(VALID_INTERNSHIP);
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
        await Internships.destroy({ where: {} });
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
        const VALID_INTERNSHIP = defaultInternships();

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
        await Internships.destroy({ where: {} });
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
        const VALID_INTERNSHIP = defaultInternships();

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
        const VALID_INTERNSHIP = defaultInternships();

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
        await Internships.destroy({ where: {} });
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
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /internships/:id/businesses', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/businesses`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/businesses`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/businesses`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_BUSINESS = defaultBusiness();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_BUSINESS = await Businesses.create(VALID_BUSINESS);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setBusiness(CREATED_BUSINESS.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/businesses`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/businesses/:business_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/businesses/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/businesses/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongBusinessID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/businesses/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoBusiness', async () => {
        // In this case, we check if link a existing internships and an unexisting businesses work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/businesses/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithBusiness', async () => {
        const VALID_BUSINESS = defaultBusiness();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_BUSINESS = await Businesses.create(VALID_BUSINESS);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/businesses/${CREATED_BUSINESS.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id, {
            include: [{ model: Businesses, as: 'business' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_INTERNSHIP.business)) as any;

        expect(CREATED_INTERNSHIP.business).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /internships/:id/students', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/students`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/students`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/students`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_STUDENT = defaultStudents();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_STUDENT = await Students.create(VALID_STUDENT);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setStudent(CREATED_STUDENT.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/students`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/students/:student_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/students/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/students/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongStudentID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/students/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoStudent', async () => {
        // In this case, we check if link a existing internships and an unexisting students work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/students/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithStudent', async () => {
        const VALID_STUDENT = defaultStudents();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_STUDENT = await Students.create(VALID_STUDENT);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/students/${CREATED_STUDENT.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if student and internship are linked
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id, {
            include: [{ model: Students, as: 'student' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_INTERNSHIP.student)) as any;

        expect(CREATED_INTERNSHIP.student).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /internships/:id/internshipTypes', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_INTERNSHIP_TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setCategory(CREATED_INTERNSHIP_TYPE.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/internshipTypes/:internship_type_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/internshipTypes/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/internshipTypes/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongBusinessID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/internshipTypes/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoBusiness', async () => {
        // In this case, we check if link a existing internships and an unexisting internshipTypes work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/internshipTypes/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithBusiness', async () => {
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_INTERNSHIP_TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/internshipTypes/${CREATED_INTERNSHIP_TYPE.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if category and internship are linked
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id, {
            include: [{ model: InternshipTypes, as: 'category' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_INTERNSHIP.category)) as any;

        expect(CREATED_INTERNSHIP.category).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /internships/:id/files', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternships_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/files`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/files`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/files`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual([]);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_FILE = defaultFiles();

        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        const CREATE_FILE = await Files.create(VALID_FILE);

        await CREATED_INTERNSHIP.addFile(CREATE_FILE);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/files`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /internships/:id/files/:file_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternships_204', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/files/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/{falseEncoding}/files/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongFileID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/10/files/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoFile', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting internships work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED.id}/files/20/link`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithInternship', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_FILE = defaultFiles();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_FILE = await Files.create(VALID_FILE);

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/internships/${CREATED_INTERNSHIP.id}/files/${CREATED_FILE.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_FILE = await Files.findByPk(CREATED_FILE.id);

        const internships = await CREATED_INTERNSHIP.getFiles();
        expect(internships).toHaveLength(1);
        expect(internships[0].id).toBe(CREATED_FILE.id);
    });
});
