import { Server } from 'http';

import logger from './utils/logger';

import app from './app';
import init from './configs/setup/init';

// Require database connection initialization
import './configs/instances/database';

import setupDB from './configs/setup/database'; // Only import to setup

/**
 * Start Express server.
 */
let server: Server;

// Launch init script before setup server
setupDB
    .then(() => init())
    .then(() => {
        server = app.listen(app.get('port'), () => {
            logger.info(
                `   App is running at http://localhost:${app.get('port')} in ${app.get(
                    'env',
                )} mode`,
            );
            console.info('  Press CTRL-C to stop\n');
        });
    })
    .catch(logger.error);

export default server;
