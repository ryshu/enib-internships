import { Server } from 'http';

import logger from './utils/logger';

import app, { session } from './app';
import init from './configs/setup/init';

// Require database connection initialization
import './configs/instances/database';

import setupDB from './configs/setup/database';

// Websocket server
import socketIO from 'socket.io';
import wss from './websocket/server';
import * as socketHandler from './websocket/handler/handler';
import sharedsession from 'express-socket.io-session';

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
        const io = socketIO(server);
        io.use(sharedsession(session, { autoSave: true }));
        io.on('connection', socketHandler.connectionHandler);
        wss.setIO(io);
    })
    .catch(logger.error);

export default server;
