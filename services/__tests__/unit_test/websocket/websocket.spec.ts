import wss from '../../../src/websocket/server';
import { ProgressChannel } from '../../../src/websocket/channels/private';

import io from 'socket.io';

/**
 * Only on it to prevent error between channel
 */
describe('Websocket_channelsJobs', () => {
    /**
     * Setup WS & HTTP servers
     */
    beforeAll((done) => {
        wss.setIO(io());

        done();
    });

    it('Websocket test', () => {
        const channel = new ProgressChannel('test', 'clientId');
        channel.start({});
        channel.step({});
        channel.end();
        channel.error({});
    });
});
