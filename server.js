"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const app_1 = __importDefault(require("./app"));
const init_1 = __importDefault(require("./configs/setup/init"));
// Require database connection initialization
require("./configs/instances/database");
const database_1 = __importDefault(require("./configs/setup/database")); // Only import to setup
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
})
    .catch(logger_1.default.error);
exports.default = server;
//# sourceMappingURL=server.js.map