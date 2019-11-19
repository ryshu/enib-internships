import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Campaigns from '../../../../src/models/Campaigns';
import MentoringPropositions from '../../../../src/models/MentoringPropositions';
import Mentors from '../../../../src/models/Mentors';
import InternshipTypes from '../../../../src/models/InternshipTypes';
import Internships from '../../../../src/models/Internships';

import {
    defaultCampaigns,
    defaultMentoringPropositions,
    defaultMentors,
    defaultInternships,
    defaultInternshipTypes,
} from '../../../../__mocks__/mockData';

const baseURL = `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`;

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /campaigns', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns`);
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN: ICampaignEntity = defaultCampaigns();

        await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(`${baseURL}/campaigns`);
        expect(RESPONSE.status).toBe(200);
        expect(Array.isArray(RESPONSE.body)).toBeTruthy();
        expect(RESPONSE.body[0]).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /campaigns', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/campaigns`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Wrong_category_400', async () => {
        const REQ = {
            ...defaultCampaigns(),
            category_id: 1,
        };

        const RESPONSE = await request(app)
            .post(`${baseURL}/campaigns`)
            .send(REQ);
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidCampaigns_202', async () => {
        const REQ: any = defaultCampaigns();

        // Create intership category
        const VALID_INTENRSHIP_TYPES = defaultInternshipTypes();
        const CATEGORY = await InternshipTypes.create(VALID_INTENRSHIP_TYPES);
        REQ.category_id = CATEGORY.id;

        const RESPONSE = await request(app)
            .post(`${baseURL}/campaigns`)
            .send(REQ);
        expect(RESPONSE.status).toBe(202);
    });

    it('ValidCampaigns_200', async () => {
        const REQ: any = defaultCampaigns();
        REQ.isPublish = false;

        // Create intership category
        const VALID_INTENRSHIP_TYPES = defaultInternshipTypes();
        const CATEGORY = await InternshipTypes.create(VALID_INTENRSHIP_TYPES);
        REQ.category_id = CATEGORY.id;

        const RESPONSE = await request(app)
            .post(`${baseURL}/campaigns`)
            .send(REQ);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('GET /campaigns/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('PUT /campaigns/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/campaigns/10`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(`${baseURL}/campaigns/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_UpdateAllData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        // Change some data on VALID_CAMPAIGN
        VALID_CAMPAIGN.name = 'additional data';

        const RESPONSE = await request(app)
            .put(`${baseURL}/campaigns/${CREATED.id}`)
            .send(VALID_CAMPAIGN);
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Campaigns_200_NotAnyDataUpdated', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app)
            .put(`${baseURL}/campaigns/${CREATED.id}`)
            .send({});
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Campaigns_200_UndefinedCategoryUpdate', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app)
            .put(`${baseURL}/campaigns/${CREATED.id}`)
            .send({ category_id: 1 });
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });

    it('Campaigns_200_CategoryUpdated', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        // Create intership category
        const VALID_INTENRSHIP_TYPES = defaultInternshipTypes();
        const CATEGORY = await InternshipTypes.create(VALID_INTENRSHIP_TYPES);

        const RESPONSE = await request(app)
            .put(`${baseURL}/campaigns/${CREATED.id}`)
            .send({ category_id: CATEGORY.id });
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(Number),
        });
    });
});

describe('DELETE /campaigns/:id', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_200', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/campaigns/10`);
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(`${baseURL}/campaigns/{falseEncoding}`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app).delete(`${baseURL}/campaigns/${CREATED.id}`);
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /campaigns/:id/mentoringPropositions', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10/mentoringPropositions`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/{falseEncoding}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED.id}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITION,
        );

        await CREATED_CAMPAIGN.addProposition(CREATED_MENTORING_PROPOSITION.id);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /campaigns/:id/mentoringPropositions/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/mentoringPropositions/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/{falseEncoding}/mentoringPropositions/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongMentoringPropositionID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/mentoringPropositions/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoMentoringProposition', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting mentoringPropositions work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED.id}/mentoringPropositions/20/link`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Campaigns_200_WithMentoringProposition', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITION,
        );

        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const mentoringPropositions = await CREATED_CAMPAIGN.getPropositions();
        expect(mentoringPropositions).toHaveLength(1);
        expect(mentoringPropositions[0].id).toBe(CREATED_MENTORING_PROPOSITION.id);
    });
});

describe('GET /campaigns/:id/availableInternships', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10/availableInternships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/{falseEncoding}/availableInternships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED.id}/availableInternships`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_CAMPAIGN.addAvailableInternship(CREATED_INTERNSHIP.id);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/availableInternships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /campaigns/:id/availableInternships/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/availableInternships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/{falseEncoding}/availableInternships/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/availableInternships/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting internships work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED.id}/availableInternships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithInternship', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/availableInternships/${CREATED_INTERNSHIP.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const availableInternships = await CREATED_CAMPAIGN.getAvailableInternships();
        expect(availableInternships).toHaveLength(1);
        expect(availableInternships[0].id).toBe(CREATED_INTERNSHIP.id);
    });
});

describe('GET /campaigns/:id/validatedInternships', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10/validatedInternships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/{falseEncoding}/validatedInternships`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED.id}/validatedInternships`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        await CREATED_CAMPAIGN.addValidatedInternship(CREATED_INTERNSHIP.id);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/validatedInternships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /campaigns/:id/validatedInternships/:internship_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/validatedInternships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/{falseEncoding}/validatedInternships/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/validatedInternships/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting internships work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED.id}/validatedInternships/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithInternship', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/validatedInternships/${CREATED_INTERNSHIP.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const validatedInternships = await CREATED_CAMPAIGN.getValidatedInternships();
        expect(validatedInternships).toHaveLength(1);
        expect(validatedInternships[0].id).toBe(CREATED_INTERNSHIP.id);
    });
});

describe('GET /campaigns/:id/internships', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/{falseEncoding}/internships`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/${CREATED.id}/internships`);
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP = defaultInternships();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_INTERNSHIP_1 = await Internships.create(VALID_INTERNSHIP);
        const CREATED_INTERNSHIP_2 = await Internships.create(VALID_INTERNSHIP);

        await CREATED_CAMPAIGN.addValidatedInternship(CREATED_INTERNSHIP_1.id);
        await CREATED_CAMPAIGN.addAvailableInternship(CREATED_INTERNSHIP_2.id);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/internships`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(2);
    });
});

describe('GET /campaigns/:id/mentors', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10/mentors`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/{falseEncoding}/mentors`);
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/${CREATED.id}/mentors`);
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTOR = defaultMentors();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);

        await CREATED_CAMPAIGN.addMentor(CREATED_MENTOR.id);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/mentors`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toHaveLength(1);
    });
});

describe('POST /campaigns/:id/mentors/:mentor_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoBusiness_204', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/campaigns/10/mentors/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/{falseEncoding}/mentors/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongMentorID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/mentors/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoMentor', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting mentors work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED.id}/mentors/235012/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithMentor', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTOR = defaultMentors();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTOR = await Mentors.create(VALID_MENTOR);

        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/mentors/${CREATED_MENTOR.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if business and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const mentors = await CREATED_CAMPAIGN.getMentors();
        expect(mentors).toHaveLength(1);
        expect(mentors[0].id).toBe(CREATED_MENTOR.id);
    });
});

describe('GET /campaigns/:id/internshipTypes', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).get(`${baseURL}/campaigns/10/internshipTypes`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/{falseEncoding}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED.id}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual({});
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED_INTERNSHIP_TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);

        await CREATED_CAMPAIGN.setCategory(CREATED_INTERNSHIP_TYPE.id);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/internshipTypes`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('POST /campaigns/:id/internshipTypes/:internship_type_id/link', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoInternship_204', async () => {
        const RESPONSE = await request(app).post(`${baseURL}/campaigns/10/internshipTypes/20/link`);
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/{falseEncoding}/internshipTypes/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipTypeID', async () => {
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/10/internshipTypes/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_204_NoInternshipType', async () => {
        // In this case, we check if link a existing campaigns and an unexisting internshipTypes work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED.id}/internshipTypes/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('Campaigns_200_WithInternshipType', async () => {
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED_INTERNSHIP_TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);
        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app).post(
            `${baseURL}/campaigns/${CREATED_CAMPAIGN.id}/internshipTypes/${CREATED_INTERNSHIP_TYPE.id}/link`,
        );

        // Should answer 200
        expect(RESPONSE.status).toBe(200);

        // check if category and internship are linked
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id, {
            include: [{ model: InternshipTypes, as: 'category' }],
        });

        const data = JSON.parse(JSON.stringify(CREATED_CAMPAIGN.category)) as any;

        expect(CREATED_CAMPAIGN.category).toBeTruthy();
        expect(data).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});
