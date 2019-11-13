import { sendWelcome, sendCampaignsCreate } from '../../../src/emails/base';

// Include database connection
import dbSetup from '../../../src/configs/setup/database';

import Campaigns from '../../../src/models/Campaigns';
import InternshipTypes from '../../../src/models/InternshipTypes';

import { defaultCampaigns, defaultInternshipTypes } from '../../../__mocks__/mockData';

jest.setTimeout(30000);

beforeAll((done) => {
    dbSetup.then(() => done()).catch((e) => done(e));
});

describe('Emails service', () => {
    it('sendWelcome_to_fr', async () => {
        const res = await sendWelcome('test@tester.fr');
        expect(res.envelope).toMatchSnapshot();
    });

    it('sendCampaignsCreate_to_fr', async () => {
        const VALID_CAMPAIGN = defaultCampaigns();
        const VALID_INTERNSHIP_TYPE = defaultInternshipTypes();

        const CREATED = await Campaigns.create(VALID_CAMPAIGN);
        const TYPE = await InternshipTypes.create(VALID_INTERNSHIP_TYPE);

        await CREATED.setCategory(TYPE.id);

        const res = await sendCampaignsCreate('test@tester.fr', CREATED);
        expect(res.envelope).toMatchSnapshot();
    });
});
