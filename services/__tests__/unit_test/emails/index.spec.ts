import { sendWelcome } from '../../../src/emails/base';

describe('Emails service', () => {
    it('sendWelcome_to_fr', async () => {
        const res = await sendWelcome('test@tester.fr');
        expect(res.envelope).toMatchSnapshot();
    });
});
