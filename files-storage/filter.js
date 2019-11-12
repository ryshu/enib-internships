"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const error_1 = require("../utils/error");
exports.pdfFilter = (_req, file, cb) => {
    // accept jpeg only
    if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new error_1.APIError('Only pdf files are allowed!', http_status_codes_1.default.BAD_REQUEST, 1), false);
    }
    cb(null, true);
};
//# sourceMappingURL=filter.js.map