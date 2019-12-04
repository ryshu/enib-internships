"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_templates_1 = __importDefault(require("email-templates"));
const path_1 = __importDefault(require("path"));
const mailer_1 = __importDefault(require("../configs/instances/mailer"));
exports.email = new email_templates_1.default({
    message: {
        from: 'no-reply@stages.enib.fr',
    },
    // uncomment below to send emails in development/test env:
    // send: true
    transport: mailer_1.default,
    juiceResources: {
        preserveImportant: true,
        webResources: {
            relativeTo: path_1.default.resolve(__dirname, 'build'),
            images: true,
        },
    },
    i18n: {
        directory: path_1.default.resolve(__dirname, 'build', 'i18n'),
        locales: ['en', 'fr'],
        defaultLocale: 'fr',
    },
    // Change default template link "emails" for "templates"
    views: { root: path_1.default.join(__dirname, 'templates') },
});
//# sourceMappingURL=config.js.map