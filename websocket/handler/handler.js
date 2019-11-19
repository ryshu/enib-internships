"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
const server_1 = __importDefault(require("../server"));
/**
 * @summary Connection Handler when websocket is initialized
 * @param {socketIO.Socket} socket New connection socket to handle
 */
function connectionHandler(socket) {
    const address = socket.conn.remoteAddress;
    // Save Session
    socket.handshake.session.socketId = socket.id;
    socket.handshake.session.save((err) => {
        if (err) {
            logger_1.default.error(err);
        }
    });
    logger_1.default.info(`WEBSOCKET - Connected to ${address}`);
    logger_1.default.info(`WEBSOCKET - Clients connected: ${findClientsSocket(server_1.default.io).length}`);
    socket.emit('connection', { status: true, message: 'successfully connected' });
    socket.on('disconnect', () => {
        logger_1.default.info(`WEBSOCKET - Disconnected from ${address}`);
        logger_1.default.info(`WEBSOCKET - Clients connected: ${findClientsSocket(server_1.default.io).length}`);
    });
}
exports.connectionHandler = connectionHandler;
/**
 * @summary Method to retrieve websocket server clients
 * @param {socketIO.Server} io Websocket instance
 * @returns {socketIO.Client[]} Websocket clients list
 */
function findClientsSocket(io) {
    const res = [];
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
exports.findClientsSocket = findClientsSocket;
//# sourceMappingURL=handler.js.map