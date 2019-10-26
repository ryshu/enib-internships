"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../instances/database"));
const Businesses_1 = __importDefault(require("../../models/Businesses"));
const Campaigns_1 = __importDefault(require("../../models/Campaigns"));
const Files_1 = __importDefault(require("../../models/Files"));
const InternshipTypes_1 = __importDefault(require("../../models/InternshipTypes"));
const Internships_1 = __importDefault(require("../../models/Internships"));
const MentoringPropositions_1 = __importDefault(require("../../models/MentoringPropositions"));
const Mentors_1 = __importDefault(require("../../models/Mentors"));
const Students_1 = __importDefault(require("../../models/Students"));
// One Businesses to many Internships
Businesses_1.default.hasMany(Internships_1.default, { as: 'internships', foreignKey: 'businessId', sourceKey: 'id' });
Internships_1.default.belongsTo(Businesses_1.default, { as: 'business', foreignKey: 'businessId', targetKey: 'id' });
// One InternshipTypes to many Internships
InternshipTypes_1.default.hasMany(Internships_1.default, { as: 'internships', foreignKey: 'categoryId' });
Internships_1.default.belongsTo(InternshipTypes_1.default, { as: 'category', foreignKey: 'categoryId' });
// One Campaigns to many MentoringPropositions
Campaigns_1.default.hasMany(MentoringPropositions_1.default, { as: 'propositions', foreignKey: 'campaignId' });
MentoringPropositions_1.default.belongsTo(Campaigns_1.default, { as: 'campaign', foreignKey: 'campaignId' });
// Many Campaigns to many Mentors
Campaigns_1.default.belongsToMany(Mentors_1.default, {
    as: 'mentors',
    through: 'campaigns_mentors',
    foreignKey: 'campaignId',
});
Mentors_1.default.belongsToMany(Campaigns_1.default, {
    as: 'campaigns',
    through: 'campaigns_mentors',
    foreignKey: 'mentorId',
});
// One Students to many Internships
Students_1.default.hasMany(Internships_1.default, { as: 'internships', foreignKey: 'studentId', sourceKey: 'id' });
Internships_1.default.belongsTo(Students_1.default, { as: 'student', foreignKey: 'studentId', targetKey: 'id' });
// One Internship to many Files
Internships_1.default.hasMany(Files_1.default, { as: 'files', foreignKey: 'internshipId' });
Files_1.default.belongsTo(Internships_1.default, { as: 'internship', foreignKey: 'internshipId' });
exports.default = database_1.default.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
//# sourceMappingURL=database.js.map