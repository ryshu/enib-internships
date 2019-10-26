"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const error_1 = require("../../utils/error");
/**
 * GET /cas/profile
 * Used to retrieve user profil after cas connection
 */
function getProfile(req, res, next) {
    // Check if any session is defined
    if (req.session && req.session.info) {
        return res.send(req.session.info);
    }
    next(new error_1.APIError('Missing cas user info in given session', http_status_codes_1.default.BAD_REQUEST, 11103));
}
exports.getProfile = getProfile;
//# sourceMappingURL=ctrl.js.map