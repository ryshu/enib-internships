"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const global_helper_1 = require("../helpers/global.helper");
const singleton_1 = __importDefault(require("../../statistics/singleton"));
/**
 * GET /statistics
 * Used to GET internships statistics
 */
exports.getStatistics = (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(singleton_1.default.statistics);
});
/**
 * GET /campaigns/:id/statistics
 * Used to GET a campaign statistics
 */
exports.getCampaignStatistics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @see validator + router
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return global_helper_1.BAD_REQUEST_VALIDATOR(next, errors);
    }
    const stat = singleton_1.default.getCampaign(Number(req.params.id));
    if (global_helper_1.checkContent(stat, next)) {
        return res.send(stat);
    }
});
//# sourceMappingURL=statistics.ctrl.js.map