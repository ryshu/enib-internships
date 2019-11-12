"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const filter_1 = require("./filter");
const error_1 = require("../utils/error");
const baseDir = path_1.default.join(__dirname, '..', process.env.BASE_STORAGE_DIR);
exports.multerPdfStorage = multer_1.default.diskStorage({
    destination(_req, _file, cb) {
        cb(null, baseDir);
    },
    filename(_req, file, cb) {
        if (file.originalname) {
            cb(null, file.originalname
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase()
                .replace(/__+/g, '-'));
        }
        else {
            cb(new error_1.APIError('ID is required to upload a banner', http_status_codes_1.default.BAD_REQUEST, 1), '');
        }
    },
});
exports.uploadHandler = multer_1.default({
    storage: exports.multerPdfStorage,
    fileFilter: filter_1.pdfFilter,
    limits: {
        fileSize: 4000000,
        fields: 20,
        files: 1,
        parts: 20,
    },
});
//# sourceMappingURL=base.js.map