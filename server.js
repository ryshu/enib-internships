"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const app_1 = __importStar(require("./app"));
const init_1 = __importDefault(require("./configs/setup/init"));
// Require database connection initialization
require("./configs/instances/database");
const database_1 = __importDefault(require("./configs/setup/database"));
// Websocket server
const socket_io_1 = __importDefault(require("socket.io"));
const server_1 = __importDefault(require("./websocket/server"));
const socketHandler = __importStar(require("./websocket/handler/handler"));
const express_socket_io_session_1 = __importDefault(require("express-socket.io-session"));
/**
 * Start Express server.
 */
let server;
// Launch init script before setup server
database_1.default
    .then(() => init_1.default())
    .then(() => {
    server = app_1.default.listen(app_1.default.get('port'), () => {
        logger_1.default.info(`   App is running at http://localhost:${app_1.default.get('port')} in ${app_1.default.get('env')} mode`);
        console.info('  Press CTRL-C to stop\n');
    });
    const io = socket_io_1.default(server);
    io.use(express_socket_io_session_1.default(app_1.session, { autoSave: true }));
    io.on('connection', socketHandler.connectionHandler);
    server_1.default.setIO(io);
})
    .catch(logger_1.default.error);
exports.default = server;
//# sourceMappingURL=server.js.map