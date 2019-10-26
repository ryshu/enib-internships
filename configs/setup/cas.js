"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cas_authentication_1 = __importDefault(require("cas-authentication"));
const cas = new cas_authentication_1.default({
    cas_url: process.env.CAS_URL,
    service_url: process.env.SERVICE_URL,
    cas_version: '2.0',
    is_dev_mode: process.env.CAS_DEV_MODE === 'false' ? false : true,
    dev_mode_user: 'cas.dev',
    session_name: 'cas_user',
    destroy_session: true,
});
exports.default = cas;
//# sourceMappingURL=cas.js.map