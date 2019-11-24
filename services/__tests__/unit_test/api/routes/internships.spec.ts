import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Internships from '../../../../src/models/sequelize/Internships';
import Businesses from '../../../../src/models/sequelize/Businesses';
import Students from '../../../../src/models/sequelize/Students';
import InternshipTypes from '../../../../src/models/sequelize/InternshipTypes';
import Files from '../../../../src/models/sequelize/Files';
import Campaigns from '../../../../src/models/sequelize/Campaigns';
import MentoringPropositions from '../../../../src/models/sequelize/MentoringPropositions';
import Mentors from '../../../../src/models/sequelize/Mentors';

import {
    defaultCampaigns,
    defaultInternships,
    defaultBusiness,
    defaultInternshipTypes,
    defaultStudents,
    defaultFiles,
    defaultMentoringPropositions,
    defaultMentors,
} from '../../../../__mocks__/mockData';

const baseURL = `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`;

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
        const RESPONSE = await request(app).get(`${baseURL}/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships?limit=Nan`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();

        VALID_INTERNSHIP.category = VALID_INTERNSHIP_TYPE;

        await Internships.create(VALID_INTERNSHIP, {
            include: [{ association: Internships.associations.category }],
        });
        const RESPONSE = await request(app).get(`${baseURL}/internships`);

        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body.data)).toBeTruthy();
        expect(RESPONSE.body).toMatchSnapshot({
            data: [
                {
                    category: {
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ],
        });
    });
});

describe('POST /internships', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/internships`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Missing category_400', async () => {
        const VALID_INTERNSHIP: any = defaultInternships();

        const RESPONSE = await request(app)
            .post(`${baseURL}/internships`)
            .send(VALID_INTERNSHIP);

        expect(RESPONSE.status).toBe(400);
    });

    it('ValidInternships_200', async () => {
        const VALID_INTERNSHIP: any = defaultInternships();
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();

        const category = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        VALID_INTERNSHIP.category = { id: category.id };

        const RESPONSE = await request(app)
            .post(`${baseURL}/internships`)
            .send(VALID_INTERNSHIP);

        if (RESPONSE.status !== 200) {
            // tslint:disable-next-line: no-console
            console.log(RESPONSE.body);
        }

        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            category: {
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
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
        const RESPONSE = await request(app).get(`${baseURL}/internships/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(`${baseURL}/internships/${CREATED.id}`);
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
        const RESPONSE = await request(app).put(`${baseURL}/internships/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/internships/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_UpdateAllData', async () => {
        const VALID_INTERNSHIP: any = defaultInternships();
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();

        const category = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        VALID_INTERNSHIP.category = category.id;

        const CREATED = await Internships.create(VALID_INTERNSHIP);

        // Change some data on VALID_INTERNSHIP
        VALID_INTERNSHIP.additional = 'additional data';

        const RESPONSE = await request(app)
            .put(`${baseURL}/internships/${CREATED.id}`)
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
            .put(`${baseURL}/internships/${CREATED.id}`)
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
        const RESPONSE = await request(app).delete(`${baseURL}/internships/10`);
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/internships/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).delete(`${baseURL}/internships/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /internships/:id/businesses', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/businesses`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/{falseEncoding}/businesses`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(`${baseURL}/internships/${CREATED.id}/businesses`);
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_BUSINESS = defaultBusiness();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_BUSINESS = await Businesses.create(VALID_BUSINESS);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setBusiness(CREATED_BUSINESS.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/businesses`,
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
        const RESPONSE = await request(app).post(`${baseURL}/internships/10/businesses/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/businesses/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongBusinessID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/businesses/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoBusiness', async () => {
        // In this case, we check if link a existing internships and an unexisting businesses work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/businesses/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithBusiness', async () => {
        const VALID_BUSINESS = defaultBusiness();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_BUSINESS = await Businesses.create(VALID_BUSINESS);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/businesses/${CREATED_BUSINESS.id}/link`,
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
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/students`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/{falseEncoding}/students`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(`${baseURL}/internships/${CREATED.id}/students`);
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_STUDENT = defaultStudents();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_STUDENT = await Students.create(VALID_STUDENT);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setStudent(CREATED_STUDENT.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/students`,
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
        const RESPONSE = await request(app).post(`${baseURL}/internships/10/students/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/students/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongStudentID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/students/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoStudent', async () => {
        // In this case, we check if link a existing internships and an unexisting students work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/students/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithStudent', async () => {
        const VALID_STUDENT = defaultStudents();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_STUDENT = await Students.create(VALID_STUDENT);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/students/${CREATED_STUDENT.id}/link`,
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
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/internshipTypes`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/{falseEncoding}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED.id}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_INTERNSHIP_TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setCategory(CREATED_INTERNSHIP_TYPE.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/internshipTypes`,
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
            `${baseURL}/internships/10/internshipTypes/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/internshipTypes/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipTypeID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/internshipTypes/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoInternshipType', async () => {
        // In this case, we check if link a existing internships and an unexisting internshipTypes work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/internshipTypes/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithInternshipType', async () => {
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_INTERNSHIP_TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/internshipTypes/${CREATED_INTERNSHIP_TYPE.id}/link`,
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
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/files`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/{falseEncoding}/files`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(`${baseURL}/internships/${CREATED.id}/files`);
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_FILE = defaultFiles();

        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        const CREATE_FILE = await Files.create(VALID_FILE);

        await CREATED_INTERNSHIP.addFile(CREATE_FILE.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/files`,
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
        const RESPONSE = await request(app).post(`${baseURL}/internships/10/files/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/files/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongFileID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/files/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoFile', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting internships work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/files/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithInternship', async () => {
        const VALID_INTERNSHIP = defaultInternships();
        const VALID_FILE = defaultFiles();

        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);
        let CREATED_FILE = await Files.create(VALID_FILE);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/files/${CREATED_FILE.id}/link`,
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

describe('GET /internships/:id/availableCampaigns', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/availableCampaigns`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/{falseEncoding}/availableCampaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED.id}/availableCampaigns`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setAvailableCampaign(CREATED_CAMPAIGN.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/availableCampaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/availableCampaigns/:campaign_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/availableCampaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/availableCampaigns/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongCampaignID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/availableCampaigns/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoCampaign', async () => {
        // In this case, we check if link a existing internships and an unexisting availableCampaigns work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/availableCampaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithCampaign', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/availableCampaigns/${CREATED_CAMPAIGN.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if availableCampaign and internship are linked
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id, {
            include: [{ model: Campaigns, as: 'availableCampaign' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_INTERNSHIP.availableCampaign)) as any;

        expect(CREATED_INTERNSHIP.availableCampaign).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /internships/:id/validatedCampaigns', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/validatedCampaigns`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/{falseEncoding}/validatedCampaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED.id}/validatedCampaigns`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setValidatedCampaign(CREATED_CAMPAIGN.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/validatedCampaigns`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/validatedCampaigns/:campaign_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/validatedCampaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/validatedCampaigns/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongCampaignID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/validatedCampaigns/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoCampaign', async () => {
        // In this case, we check if link a existing internships and an unexisting validatedCampaigns work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/validatedCampaigns/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithCampaign', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/validatedCampaigns/${CREATED_CAMPAIGN.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if validatedCampaign and internship are linked
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id, {
            include: [{ model: Campaigns, as: 'validatedCampaign' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_INTERNSHIP.validatedCampaign)) as any;

        expect(CREATED_INTERNSHIP.validatedCampaign).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /internships/:id/propositions', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/propositions`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/{falseEncoding}/propositions`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED.id}/propositions`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_PROPOSITIONS = defaultMentoringPropositions();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_PROPOSITIONS = await MentoringPropositions.create(VALID_PROPOSITIONS);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.addProposition(CREATED_PROPOSITIONS.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/propositions`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body.data[0]).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/propositions/:mentoring_proposition_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/propositions/21356/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/propositions/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongPropositionsID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/propositions/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoPropositions', async () => {
        // In this case, we check if link a existing internships and an unexisting propositions work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/propositions/2231565610/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithPropositions', async () => {
        const VALID_PROPOSITIONS = defaultMentoringPropositions();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_PROPOSITIONS = await MentoringPropositions.create(VALID_PROPOSITIONS);
        let CREATED = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/propositions/${CREATED_PROPOSITIONS.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if propositions and internship are linked
        CREATED = await Internships.findByPk(CREATED.id, {
            include: [{ model: MentoringPropositions, as: 'propositions' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED.propositions)) as any;

        expect(CREATED.propositions).toBeTruthy();
        expect(data[0]).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('GET /internships/:id/mentors', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/10/mentors`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/internships/{falseEncoding}/mentors`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_200_NoLinkedData', async () => {
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).get(`${baseURL}/internships/${CREATED.id}/mentors`);
        expect(RESPONSE.status).toBe(200);
    });

    it('Internships_200_WithLinkedData', async () => {
        const VALID_MENTOR = defaultMentors();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_INTERNSHIP.setMentor(CREATED_MENTOR.id);
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /internships/:id/mentors/:mentor_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Internships.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/internships/10/mentors/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/{falseEncoding}/mentors/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongMentorID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/10/mentors/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Internships_204_NoMentor', async () => {
        // In this case, we check if link a existing internships and an unexisting mentors work
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED = await Internships.create(VALID_INTERNSHIP);
        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED.id}/mentors/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Internships_200_WithMentor', async () => {
        const VALID_MENTOR = defaultMentors();
        const VALID_INTERNSHIP = defaultInternships();

        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);
        let CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/internships/${CREATED_INTERNSHIP.id}/mentors/${CREATED_MENTOR.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if mentor and internship are linked
        CREATED_INTERNSHIP = await Internships.findByPk(CREATED_INTERNSHIP.id, {
            include: [{ model: Mentors, as: 'mentor' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_INTERNSHIP.mentor)) as any;

        expect(CREATED_INTERNSHIP.mentor).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});
