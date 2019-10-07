"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const lusca_1 = __importDefault(require("lusca"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
// Load environment variables from .env file, where API keys and passwords are configured
dotenv_1.default.config({ path: '.env' });
// Loggers
const logger_1 = __importDefault(require("./utils/logger"));
const error_1 = require("./utils/error");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// router and database
const route_1 = __importDefault(require("./configs/setup/route"));
require("./configs/instances/database"); // Only import to setup
require("./configs/setup/database"); // Only import to setup
// Create Express server
const app = express_1.default();
// Express configuration
app.set('port', process.env.INTERNSHIP_ENIB_API_PORT || 3000);
app.use(compression_1.default());
app.use(body_parser_1.default.json({ limit: '1mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(express_flash_1.default());
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection(true));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public'), { maxAge: 31557600000 }));
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
};
app.use(cors_1.default(corsOptions));
app.use(route_1.default);
/**
 * Error handler setup
 */
app.use(method_override_1.default());
app.use((err, _req, res, _next) => {
    if (err instanceof error_1.APIError) {
        return res.status(err.status).json(err);
    }
    else {
        logger_1.default.error(err);
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send(`Internal server error`);
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map