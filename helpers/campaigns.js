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
const sequelize = require("sequelize");
const Campaigns_1 = __importDefault(require("../models/Campaigns"));
const Internships_1 = __importDefault(require("../models/Internships"));
const InternshipTypes_1 = __importDefault(require("../models/InternshipTypes"));
const Mentors_1 = __importDefault(require("../models/Mentors"));
const emails_1 = require("../emails");
const singleton_1 = __importDefault(require("../statistics/singleton"));
function internshipInject(internship, campaign, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        yield internship.setAvailableCampaign(campaign);
        if (channel) {
            channel.step(internship.subject);
        }
    });
}
function mentorInject(mentor, campaign, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mentor.addCampaign(campaign);
        if (channel) {
            channel.step({
                msg: `${mentor.firstName[0].toUpperCase()}${mentor.firstName
                    .slice(1)
                    .toLowerCase()} ${mentor.lastName.toUpperCase()}`,
            });
        }
    });
}
function mentorSendMail(mentor, campaign, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV) {
            yield emails_1.sendCampaignsCreate(mentor.email, campaign);
        }
        if (channel) {
            channel.step({
                msg: `${mentor.firstName[0].toUpperCase()}${mentor.firstName
                    .slice(1)
                    .toLowerCase()} ${mentor.lastName.toUpperCase()}`,
            });
        }
    });
}
function LaunchCampaign(campaign, channel) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield campaign.getCategory();
            const promises = [];
            // Setup all internships link
            // Query data to get all internships not linked to other campaign
            const internships = yield Internships_1.default.findAll({
                where: {
                    availableCampaignId: null,
                    validatedCampaignId: null,
                    categoryId: category.id,
                },
                include: [
                    {
                        model: Campaigns_1.default,
                        as: 'availableCampaign',
                        attributes: [],
                        duplicating: false,
                    },
                    {
                        model: Campaigns_1.default,
                        as: 'validatedCampaign',
                        attributes: [],
                        duplicating: false,
                    },
                    { model: InternshipTypes_1.default, as: 'category', attributes: [], duplicating: false },
                ],
                group: [sequelize.col(`Internships.id`)],
            });
            const mentors = yield Mentors_1.default.findAll();
            if (channel) {
                // Emit initialize message
                channel.start({
                    todo: mentors.length * 2 + internships.length,
                    type: 1 /* INITIALIZED */,
                });
            }
            // Add all available internship to new
            for (const internship of internships) {
                promises.push(internshipInject(internship, campaign, channel));
            }
            // Setup all mentors link
            for (const mentor of mentors) {
                promises.push(mentorInject(mentor, campaign, channel));
                promises.push(mentorSendMail(mentor, campaign, channel));
            }
            // Resolve all link setup
            yield Promise.all(promises);
            singleton_1.default.newCampain(campaign.id, {
                internships: {
                    total: internships.length,
                    availables: internships.length,
                    attributed: 0,
                },
                mentors: mentors.length,
                students: internships.length,
                campaign: campaign.id,
            });
            if (channel) {
                channel.end();
            }
            resolve();
        }
        catch (error) {
            if (channel) {
                channel.error(error);
            }
            singleton_1.default.newCampain(campaign.id, {});
            reject(error);
        }
    }));
}
exports.LaunchCampaign = LaunchCampaign;
//# sourceMappingURL=campaigns.js.map