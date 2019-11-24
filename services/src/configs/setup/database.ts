import database from '../instances/database';

import Businesses from '../../models/sequelize/Businesses';
import Campaigns from '../../models/sequelize/Campaigns';
import Files from '../../models/sequelize/Files';
import InternshipTypes from '../../models/sequelize/InternshipTypes';
import Internships from '../../models/sequelize/Internships';
import MentoringPropositions from '../../models/sequelize/MentoringPropositions';
import Mentors from '../../models/sequelize/Mentors';
import Students from '../../models/sequelize/Students';

// One Businesses to many Internships
Businesses.associations.internships = Businesses.hasMany(Internships, {
    as: 'internships',
    foreignKey: 'businessId',
    sourceKey: 'id',
});
Internships.associations.business = Internships.belongsTo(Businesses, {
    as: 'business',
    foreignKey: 'businessId',
    targetKey: 'id',
});

// One InternshipTypes to many Internships
InternshipTypes.associations.internships = InternshipTypes.hasMany(Internships, {
    as: 'internships',
    foreignKey: 'categoryId',
});
Internships.associations.category = Internships.belongsTo(InternshipTypes, {
    as: 'category',
    foreignKey: 'categoryId',
});

// One InternshipTypes to many Internships
InternshipTypes.associations.campaigns = InternshipTypes.hasMany(Campaigns, {
    as: 'campaigns',
    foreignKey: 'categoryId',
});
Campaigns.associations.category = Campaigns.belongsTo(InternshipTypes, {
    as: 'category',
    foreignKey: 'categoryId',
});

// One Campaigns to many MentoringPropositions
Campaigns.associations.propositions = Campaigns.hasMany(MentoringPropositions, {
    as: 'propositions',
    foreignKey: 'campaignId',
});
MentoringPropositions.associations.campaign = MentoringPropositions.belongsTo(Campaigns, {
    as: 'campaign',
    foreignKey: 'campaignId',
});

// Many Campaigns to many Mentors
Campaigns.associations.mentors = Campaigns.belongsToMany(Mentors, {
    as: 'mentors',
    through: 'campaigns_mentors',
    foreignKey: 'campaignId',
});
Mentors.associations.campaigns = Mentors.belongsToMany(Campaigns, {
    as: 'campaigns',
    through: 'campaigns_mentors',
    foreignKey: 'mentorId',
});

// One Students to many Internships
Students.associations.internships = Students.hasMany(Internships, {
    as: 'internships',
    foreignKey: 'studentId',
    sourceKey: 'id',
});
Internships.associations.student = Internships.belongsTo(Students, {
    as: 'student',
    foreignKey: 'studentId',
    targetKey: 'id',
});

// One Internship to many Files
Internships.associations.files = Internships.hasMany(Files, {
    as: 'files',
    foreignKey: 'internshipId',
});
Files.associations.internship = Files.belongsTo(Internships, {
    as: 'internship',
    foreignKey: 'internshipId',
});

// One Mentor to many Internships
Mentors.associations.internships = Mentors.hasMany(Internships, {
    as: 'internships',
    foreignKey: 'mentorId',
});
Internships.associations.mentor = Internships.belongsTo(Mentors, {
    as: 'mentor',
    foreignKey: 'mentorId',
});

// One Mentor to many MentoringPropositions
Mentors.associations.propositions = Mentors.hasMany(MentoringPropositions, {
    as: 'propositions',
    foreignKey: 'mentorId',
});
MentoringPropositions.associations.mentor = MentoringPropositions.belongsTo(Mentors, {
    as: 'mentor',
    foreignKey: 'mentorId',
});

// One Internships to many MentoringPropositions
Internships.associations.propositions = Internships.hasMany(MentoringPropositions, {
    as: 'propositions',
    foreignKey: 'internshipId',
});
MentoringPropositions.associations.internship = MentoringPropositions.belongsTo(Internships, {
    as: 'internship',
    foreignKey: 'internshipId',
});

// One Validated Campaign to many Internships
Campaigns.associations.validatedInternships = Campaigns.hasMany(Internships, {
    as: 'validatedInternships',
    foreignKey: 'validatedCampaignId',
});
Internships.associations.validatedCampaign = Internships.belongsTo(Campaigns, {
    as: 'validatedCampaign',
    foreignKey: 'validatedCampaignId',
});

// One Available Campaign to many Internships
Campaigns.associations.availableInternships = Campaigns.hasMany(Internships, {
    as: 'availableInternships',
    foreignKey: 'availableCampaignId',
});
Internships.associations.availableCampaign = Internships.belongsTo(Campaigns, {
    as: 'availableCampaign',
    foreignKey: 'availableCampaignId',
});

export default database.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
