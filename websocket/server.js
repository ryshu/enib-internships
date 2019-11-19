"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketServer {
    constructor() {
        this.io = null;
    }
    setIO(io) {
        this.io = io;
    }
}
const wss = new WebSocketServer();
exports.default = wss;
//# sourceMappingURL=server.js.map