"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const server_1 = __importDefault(require("../server"));
/**
 * @summary Method to broadcast dynamic event
 * @param {string} event Event to broadcast
 * @param {any} data Data to broadcast
 * @returns {void} void
 */
function wsDynamicBroadcast(event, data) {
    if (server_1.default && server_1.default.io) {
        server_1.default.io.emit(event, data);
    }
}
exports.wsDynamicBroadcast = wsDynamicBroadcast;
/**
 * @class DynamicChannel Class to handle dynamically defined channel
 */
class DynamicChannel {
    constructor() {
        this.channel = v4_1.default();
    }
    /**
     * @summary Method to send message on channel
     * @param {any} data Data to send on channel
     */
    emit(data) {
        if (server_1.default && server_1.default.io) {
            // Send 102 (Still processing) + data
            server_1.default.io.emit(this.channel, { status: http_status_codes_1.default.PROCESSING, data });
        }
    }
    /**
     * @summary Method used to send error on channel
     * @param {any} data Error
     */
    error(data) {
        if (server_1.default && server_1.default.io) {
            // Send 500 (Internal serveur error) + data
            server_1.default.io.emit(this.channel, {
                status: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                data,
                channel: this.channel,
            });
        }
    }
    /**
     * @summary Method used to send end on channel
     */
    end() {
        if (server_1.default && server_1.default.io) {
            // Send 200 (OK)
            server_1.default.io.emit(this.channel, { status: http_status_codes_1.default.OK, channel: this.channel });
        }
    }
}
exports.DynamicChannel = DynamicChannel;
//# sourceMappingURL=dynamic.js.map