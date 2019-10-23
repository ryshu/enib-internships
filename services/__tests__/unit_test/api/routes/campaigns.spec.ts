import request from 'supertest';

// Include app for super agent, not server
import app from '../../../../src/app';

// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Campaigns from '../../../../src/models/Campaigns';
import MentoringPropositions from '../../../../src/models/MentoringPropositions';

import { defaultCampaigns, defaultMentoringPropositions, defaultInternships } from '../../../../__mocks__/mockData';
import Internships from '../../../../src/models/Internships';

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('GET /campaigns', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampagin_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns?page={fgds}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN: ICampaignEntity = defaultCampaigns();

        await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
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

describe('POST /campaigns', () => {
    it('NoBody_400', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('ValidCampaigns_200', async () => {
        const REQ = defaultCampaigns();

        const RESPONSE = await request(app)
            .post(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns`)
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
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`,
        );
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
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).put(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_UpdateAllData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        // Change some data on VALID_CAMPAIGN
        VALID_CAMPAIGN.name = 'additional data';

        const RESPONSE = await request(app)
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`)
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
            .put(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`)
            .send({});
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
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const RESPONSE = await request(app).delete(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}`,
        );
        expect(RESPONSE.status).toBe(200);
    });
});

describe('GET /campaigns/:id/mentoringPropositions', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('NoCampaign_204', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400', async () => {
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/mentoringPropositions`,
        );
        expect(RESPONSE.status).toBe(200);
        expect(RESPONSE.body).toEqual([]);
    });

    it('Campaigns_200_WithLinkedData', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITION,
        );

        await CREATED_CAMPAIGN.addProposition(CREATED_MENTORING_PROPOSITION);
        CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

        const RESPONSE = await request(app).get(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/mentoringPropositions`,
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
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentoringPropositions/20/link`,
        );
        expect(RESPONSE.status).toBe(204);
    });

    it('BadRequest_400_WrongID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/mentoringPropositions/10/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('BadRequest_400_WrongInternshipID', async () => {
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/mentoringPropositions/{falseEncoding}/link`,
        );
        expect(RESPONSE.status).toBe(400);
    });

    it('Campaigns_200_NoInternship', async () => {
        // In this case, we check if link a existing Bussiness and an unexisting mentoringPropositions work
        const VALID_CAMPAIGN = defaultCampaigns();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/mentoringPropositions/20/link`,
        );
        expect(RESPONSE.status).toBe(200);
    });

    it('Campaigns_200_WithInternship', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_MENTORING_PROPOSITION = defaultMentoringPropositions();

        let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
        const CREATED_MENTORING_PROPOSITION = await MentoringPropositions.create(
            VALID_MENTORING_PROPOSITION,
        );

        const RESPONSE = await request(app).post(
            `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/mentoringPropositions/${CREATED_MENTORING_PROPOSITION.id}/link`,
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
      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/availableInternships`,
      );
      expect(RESPONSE.status).toBe(204);
  });

  it('BadRequest_400', async () => {
      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/availableInternships`,
      );
      expect(RESPONSE.status).toBe(400);
  });

  it('Campaigns_200_NoLinkedData', async () => {
      const VALID_CAMPAIGN = defaultCampaigns();

      const CREATED = await Campaigns.create(VALID_CAMPAIGN);
      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/availableInternships`,
      );
      expect(RESPONSE.status).toBe(200);
      expect(RESPONSE.body).toEqual([]);
  });

  it('Campaigns_200_WithLinkedData', async () => {
      const VALID_CAMPAIGN = defaultCampaigns();
      const VALID_INTERNSHIP = defaultInternships();

      let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
      const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

      await CREATED_CAMPAIGN.addAvailableInternship(CREATED_INTERNSHIP);
      CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/availableInternships`,
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
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/availableInternships/20/link`,
      );
      expect(RESPONSE.status).toBe(204);
  });

  it('BadRequest_400_WrongID', async () => {
      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/availableInternships/10/link`,
      );
      expect(RESPONSE.status).toBe(400);
  });

  it('BadRequest_400_WrongInternshipID', async () => {
      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/availableInternships/{falseEncoding}/link`,
      );
      expect(RESPONSE.status).toBe(400);
  });

  it('Campaigns_200_NoInternship', async () => {
      // In this case, we check if link a existing Bussiness and an unexisting internships work
      const VALID_CAMPAIGN = defaultCampaigns();

      const CREATED = await Campaigns.create(VALID_CAMPAIGN);
      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/availableInternships/20/link`,
      );
      expect(RESPONSE.status).toBe(200);
  });

  it('Campaigns_200_WithInternship', async () => {
      const VALID_CAMPAIGN = defaultCampaigns();
      const VALID_INTERNSHIP = defaultInternships();

      let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
      const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/availableInternships/${CREATED_INTERNSHIP.id}/link`,
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
      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/validatedInternships`,
      );
      expect(RESPONSE.status).toBe(204);
  });

  it('BadRequest_400', async () => {
      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/validatedInternships`,
      );
      expect(RESPONSE.status).toBe(400);
  });

  it('Campaigns_200_NoLinkedData', async () => {
      const VALID_CAMPAIGN = defaultCampaigns();

      const CREATED = await Campaigns.create(VALID_CAMPAIGN);
      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/validatedInternships`,
      );
      expect(RESPONSE.status).toBe(200);
      expect(RESPONSE.body).toEqual([]);
  });

  it('Campaigns_200_WithLinkedData', async () => {
      const VALID_CAMPAIGN = defaultCampaigns();
      const VALID_INTERNSHIP = defaultInternships();

      let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
      const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

      await CREATED_CAMPAIGN.addValidatedInternship(CREATED_INTERNSHIP);
      CREATED_CAMPAIGN = await Campaigns.findByPk(CREATED_CAMPAIGN.id);

      const RESPONSE = await request(app).get(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/validatedInternships`,
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
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/validatedInternships/20/link`,
      );
      expect(RESPONSE.status).toBe(204);
  });

  it('BadRequest_400_WrongID', async () => {
      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/{falseEncoding}/validatedInternships/10/link`,
      );
      expect(RESPONSE.status).toBe(400);
  });

  it('BadRequest_400_WrongInternshipID', async () => {
      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/10/validatedInternships/{falseEncoding}/link`,
      );
      expect(RESPONSE.status).toBe(400);
  });

  it('Campaigns_200_NoInternship', async () => {
      // In this case, we check if link a existing Bussiness and an unexisting internships work
      const VALID_CAMPAIGN = defaultCampaigns();

      const CREATED = await Campaigns.create(VALID_CAMPAIGN);
      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED.id}/validatedInternships/20/link`,
      );
      expect(RESPONSE.status).toBe(200);
  });

  it('Campaigns_200_WithInternship', async () => {
      const VALID_CAMPAIGN = defaultCampaigns();
      const VALID_INTERNSHIP = defaultInternships();

      let CREATED_CAMPAIGN = await Campaigns.create(VALID_CAMPAIGN);
      const CREATED_INTERNSHIP = await Internships.create(VALID_INTERNSHIP);

      const RESPONSE = await request(app).post(
          `/api/${process.env.INTERNSHIP_ENIB_API_VERSION}/campaigns/${CREATED_CAMPAIGN.id}/validatedInternships/${CREATED_INTERNSHIP.id}/link`,
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
