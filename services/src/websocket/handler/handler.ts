import socketIO from 'socket.io';
import logger from '../../utils/logger';

import wss from '../server';

/**
 * @summary Connection Handler when websocket is initialized
 * @param {socketIO.Socket} socket New connection socket to handle
 */
export function connectionHandler(socket: socketIO.Socket): void {
    const address = socket.conn.remoteAddress;

    // Save Session
    socket.handshake.session.socketId = socket.id;
    socket.handshake.session.save((err) => {
        if (err) {
            logger.error(err);
        }
    });

    logger.info(`WEBSOCKET - Connected to ${address}`);
    logger.info(`WEBSOCKET - Clients connected: ${findClientsSocket(wss.io).length}`);

    socket.emit('connection', { status: true, message: 'successfully connected' });

    socket.on('disconnect', () => {
        logger.info(`WEBSOCKET - Disconnected from ${address}`);
        logger.info(`WEBSOCKET - Clients connected: ${findClientsSocket(wss.io).length}`);
    });
}

/**
 * @summary Method to retrieve websocket server clients
 * @param {socketIO.Server} io Websocket instance
 * @returns {socketIO.Client[]} Websocket clients list
 */
export function findClientsSocket(io: socketIO.Server): socketIO.Client[] {
    const res: socketIO.Client[] = [];
    // the default namespace is "/"
    const ns = io.of('/');

    if (ns) {
        for (const id in ns.connected) {
            if (ns.connected.hasOwnProperty(id)) {
                res.push(ns.connected[id].client);
            }
        }
    }
    return res;
}
