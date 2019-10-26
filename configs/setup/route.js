"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * API routes.
 */
const route_1 = __importDefault(require("../../api/route"));
const cas_1 = __importDefault(require("./cas"));
router.use(`/api/${process.env.INTERNSHIP_ENIB_API_VERSION}`, cas_1.default.block, route_1.default);
exports.default = router;
//# sourceMappingURL=route.js.map