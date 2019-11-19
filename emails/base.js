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
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const config_1 = require("./config");
/**
 * @summary Method used to send welcome message to new user
 * @param {string} to Dest user
 * @param {string} locale language to use in email (e.g.: 'fr')
 * @returns {Promise<any>} Resolve: send message
 */
function sendWelcome(to, locale) {
    return config_1.email.send({
        template: path_1.default.join(__dirname, 'templates', 'welcome'),
        message: { to },
        locals: {
            locale: locale || 'fr',
        },
    });
}
exports.sendWelcome = sendWelcome;
/**
 * @summary Method used to send campaigns creation message to new user
 * @param {string} to Dest user
 * @param {Campaigns} campaigns Instance of the created campaigns
 * @param {string} locale language to use in email (e.g.: 'fr')
 * @returns {Promise<any>} Resolve: send message
 */
function sendCampaignsCreate(to, campaigns, locale) {
    return __awaiter(this, void 0, void 0, function* () {
        return config_1.email.send({
            template: path_1.default.join(__dirname, 'templates', 'campaignsCreate'),
            message: { to },
            locals: {
                locale: locale || 'fr',
                name: yield campaigns.getCategory(),
                studentCnt: yield campaigns.countAvailableInternships(),
                start: campaigns.startAt
                    ? moment_1.default(campaigns.startAt)
                        .locale(locale || 'fr')
                        .calendar()
                    : moment_1.default()
                        .locale(locale || 'fr')
                        .calendar(),
                end: campaigns.endAt
                    ? moment_1.default(campaigns.endAt)
                        .locale(locale || 'fr')
                        .calendar()
                    : 'N/A',
            },
        });
    });
}
exports.sendCampaignsCreate = sendCampaignsCreate;
//# sourceMappingURL=base.js.map