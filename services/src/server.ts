import { Server } from 'http';

import logger from './utils/logger';

import app from './app';

// Require database connection initialization
import './configs/instances/database';

/**
 * Start Express server.
 */
let server: Server;

server = app.listen(app.get('port'), () => {
    logger.info(
        `   App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`,
    );
    console.info('  Press CTRL-C to stop\n');
});

export default server;
