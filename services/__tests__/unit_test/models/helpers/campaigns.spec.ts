// Include database connection
import dbSetup from '../../../../src/configs/setup/database';

// Import model for pre-operation before asserting API methods
import Campaigns from '../../../../src/models/sequelize/Campaigns';
import Internships from '../../../../src/models/sequelize/Internships';
import InternshipTypes from '../../../../src/models/sequelize/InternshipTypes';

import { LaunchCampaign } from '../../../../src/models/helpers/campaigns';

import {
    defaultCampaigns,
    defaultInternships,
    defaultInternshipTypes,
} from '../../../../__mocks__/mockData';

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('LaunchCampaign', () => {
    beforeEach(async () => {
        // Remove all
        await Campaigns.destroy({ where: {} });
    });

    it('LaunchCampaign_WithChannel', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const category = await InternshipTypes.create(defaultInternshipTypes());
        const createdInternship = await Internships.create(defaultInternships());

        await createdInternship.setCategory(category);
        await CREATED.setCategory(category);

        const channel: any = {
            step: jest.fn(),
            start: jest.fn(),
            end: jest.fn(),
            error: jest.fn(),
        };

        const TODO = await Campaigns.findByPk(CREATED.id, {
            include: [{ model: InternshipTypes, as: 'category' }],
        });

        await LaunchCampaign(TODO, channel);

        expect(channel.step).toHaveBeenCalled();
        expect(channel.start).toHaveBeenCalledTimes(1);
        expect(channel.end).toHaveBeenCalledTimes(1);
        expect(channel.error).toHaveBeenCalledTimes(0);
    });

    it('LaunchCampaign_WithoutChannel', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const CREATED = await Campaigns.create(VALID_CAMPAIGN);

        const category = await InternshipTypes.create(defaultInternshipTypes());
        await CREATED.setCategory(category);

        const TODO = await Campaigns.findByPk(CREATED.id, {
            include: [{ model: InternshipTypes, as: 'category' }],
        });

        await LaunchCampaign(TODO);
    });
});
