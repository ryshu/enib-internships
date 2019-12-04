"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../instances/database"));
const Businesses_1 = __importDefault(require("../../models/sequelize/Businesses"));
const Campaigns_1 = __importDefault(require("../../models/sequelize/Campaigns"));
const Files_1 = __importDefault(require("../../models/sequelize/Files"));
const InternshipTypes_1 = __importDefault(require("../../models/sequelize/InternshipTypes"));
const Internships_1 = __importDefault(require("../../models/sequelize/Internships"));
const MentoringPropositions_1 = __importDefault(require("../../models/sequelize/MentoringPropositions"));
const Mentors_1 = __importDefault(require("../../models/sequelize/Mentors"));
const Students_1 = __importDefault(require("../../models/sequelize/Students"));
// One Businesses to many Internships
Businesses_1.default.associations.internships = Businesses_1.default.hasMany(Internships_1.default, {
    as: 'internships',
    foreignKey: 'businessId',
    sourceKey: 'id',
});
Internships_1.default.associations.business = Internships_1.default.belongsTo(Businesses_1.default, {
    as: 'business',
    foreignKey: 'businessId',
    targetKey: 'id',
});
// One InternshipTypes to many Internships
InternshipTypes_1.default.associations.internships = InternshipTypes_1.default.hasMany(Internships_1.default, {
    as: 'internships',
    foreignKey: 'categoryId',
});
Internships_1.default.associations.category = Internships_1.default.belongsTo(InternshipTypes_1.default, {
    as: 'category',
    foreignKey: 'categoryId',
});
// One InternshipTypes to many Internships
InternshipTypes_1.default.associations.campaigns = InternshipTypes_1.default.hasMany(Campaigns_1.default, {
    as: 'campaigns',
    foreignKey: 'categoryId',
});
Campaigns_1.default.associations.category = Campaigns_1.default.belongsTo(InternshipTypes_1.default, {
    as: 'category',
    foreignKey: 'categoryId',
});
// One Campaigns to many MentoringPropositions
Campaigns_1.default.associations.propositions = Campaigns_1.default.hasMany(MentoringPropositions_1.default, {
    as: 'propositions',
    foreignKey: 'campaignId',
});
MentoringPropositions_1.default.associations.campaign = MentoringPropositions_1.default.belongsTo(Campaigns_1.default, {
    as: 'campaign',
    foreignKey: 'campaignId',
});
// Many Campaigns to many Mentors
Campaigns_1.default.associations.mentors = Campaigns_1.default.belongsToMany(Mentors_1.default, {
    as: 'mentors',
    through: 'campaigns_mentors',
    foreignKey: 'campaignId',
});
Mentors_1.default.associations.campaigns = Mentors_1.default.belongsToMany(Campaigns_1.default, {
    as: 'campaigns',
    through: 'campaigns_mentors',
    foreignKey: 'mentorId',
});
// One Students to many Internships
Students_1.default.associations.internships = Students_1.default.hasMany(Internships_1.default, {
    as: 'internships',
    foreignKey: 'studentId',
    sourceKey: 'id',
});
Internships_1.default.associations.student = Internships_1.default.belongsTo(Students_1.default, {
    as: 'student',
    foreignKey: 'studentId',
    targetKey: 'id',
});
// One Internship to many Files
Internships_1.default.associations.files = Internships_1.default.hasMany(Files_1.default, {
    as: 'files',
    foreignKey: 'internshipId',
});
Files_1.default.associations.internship = Files_1.default.belongsTo(Internships_1.default, {
    as: 'internship',
    foreignKey: 'internshipId',
});
// One Mentor to many Internships
Mentors_1.default.associations.internships = Mentors_1.default.hasMany(Internships_1.default, {
    as: 'internships',
    foreignKey: 'mentorId',
});
Internships_1.default.associations.mentor = Internships_1.default.belongsTo(Mentors_1.default, {
    as: 'mentor',
    foreignKey: 'mentorId',
});
// One Mentor to many MentoringPropositions
Mentors_1.default.associations.propositions = Mentors_1.default.hasMany(MentoringPropositions_1.default, {
    as: 'propositions',
    foreignKey: 'mentorId',
});
MentoringPropositions_1.default.associations.mentor = MentoringPropositions_1.default.belongsTo(Mentors_1.default, {
    as: 'mentor',
    foreignKey: 'mentorId',
});
// One Internships to many MentoringPropositions
Internships_1.default.associations.propositions = Internships_1.default.hasMany(MentoringPropositions_1.default, {
    as: 'propositions',
    foreignKey: 'internshipId',
});
MentoringPropositions_1.default.associations.internship = MentoringPropositions_1.default.belongsTo(Internships_1.default, {
    as: 'internship',
    foreignKey: 'internshipId',
});
// One Validated Campaign to many Internships
Campaigns_1.default.associations.validatedInternships = Campaigns_1.default.hasMany(Internships_1.default, {
    as: 'validatedInternships',
    foreignKey: 'validatedCampaignId',
});
Internships_1.default.associations.validatedCampaign = Internships_1.default.belongsTo(Campaigns_1.default, {
    as: 'validatedCampaign',
    foreignKey: 'validatedCampaignId',
});
// One Available Campaign to many Internships
Campaigns_1.default.associations.availableInternships = Campaigns_1.default.hasMany(Internships_1.default, {
    as: 'availableInternships',
    foreignKey: 'availableCampaignId',
});
Internships_1.default.associations.availableCampaign = Internships_1.default.belongsTo(Campaigns_1.default, {
    as: 'availableCampaign',
    foreignKey: 'availableCampaignId',
});
exports.default = database_1.default.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
//# sourceMappingURL=database.js.map