"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../server"));
/**
 * @class ProgressChannel Class to handle dynamically defined channel
 */
class ProgressChannel {
    constructor(base, clientId) {
        this.channelStart = `${base}_start`;
        this.channelStep = `${base}_step`;
        this.channelEnd = `${base}_end`;
        this.channelError = `${base}_error`;
        this.clientId = clientId;
    }
    start(data) {
        if (server_1.default && server_1.default.io) {
            // Send 102 (Still processing) + data
            server_1.default.io.to(this.clientId).emit(this.channelStart, data);
        }
    }
    /**
     * @summary Method to send message on channel
     * @param {any} data Data to send on channel
     */
    step(data) {
        if (server_1.default && server_1.default.io) {
            server_1.default.io.to(this.clientId).emit(this.channelStep, data);
        }
    }
    /**
     * @summary Method used to send error on channel
     * @param {any} data Error
     */
    error(data) {
        if (server_1.default && server_1.default.io) {
            server_1.default.io.to(this.clientId).emit(this.channelError, data);
        }
    }
    /**
     * @summary Method used to send end on channel
     */
    end() {
        if (server_1.default && server_1.default.io) {
            // Send 200 (OK)
            server_1.default.io.to(this.clientId).emit(this.channelEnd);
        }
    }
}
exports.ProgressChannel = ProgressChannel;
//# sourceMappingURL=private.js.map