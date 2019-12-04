"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
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
const cas_1 = __importDefault(require("./configs/setup/cas"));
require("./configs/instances/database"); // Only import to setup
require("./configs/setup/database"); // Only import to setup
const express_session_1 = __importDefault(require("express-session"));
const handle_1 = require("./auth/cas/handle");
// Create Express server
const app = express_1.default();
exports.session = express_session_1.default({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});
// Express configuration
app.set('port', process.env.INTERNSHIP_ENIB_API_PORT || 3000);
app.use(compression_1.default());
app.use(body_parser_1.default.json({ limit: '1mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(express_flash_1.default());
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection(true));
app.use(exports.session);
// CAS Setup
app.get('/logout', cas_1.default.logout); // Logout pass
app.use('/', cas_1.default.bounce, // CAS bounce to connect user if isn't
(req, _res, next) => {
    if (!req.session.info) {
        // If no session info, handle connection
        handle_1.handleConnection(req)
            .then(() => next())
            .catch((e) => next(e));
    }
    else {
        // else, pass
        next();
    }
}, express_1.default.static(path_1.default.join(__dirname, 'public'), { maxAge: 0 }));
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