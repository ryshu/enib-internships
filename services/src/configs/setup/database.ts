import database from '../instances/database';

import Businesses from '../../models/Businesses';
import Campaigns from '../../models/Campaigns';
import Files from '../../models/Files';
import InternshipTypes from '../../models/InternshipTypes';
import Internships from '../../models/Internships';
import MentoringPropositions from '../../models/MentoringPropositions';
import Mentors from '../../models/Mentors';
import Students from '../../models/Students';

// One Businesses to many Internships
Businesses.hasMany(Internships, { as: 'internships', foreignKey: 'businessId', sourceKey: 'id' });
Internships.belongsTo(Businesses, { as: 'business', foreignKey: 'businessId', targetKey: 'id' });

// One InternshipTypes to many Internships
InternshipTypes.hasMany(Internships, { as: 'internships', foreignKey: 'categoryId' });
Internships.belongsTo(InternshipTypes, { as: 'category', foreignKey: 'categoryId' });

// One InternshipTypes to many Internships
InternshipTypes.hasMany(Campaigns, { as: 'campaigns', foreignKey: 'categoryId' });
Campaigns.belongsTo(InternshipTypes, { as: 'category', foreignKey: 'categoryId' });

// One Campaigns to many MentoringPropositions
Campaigns.hasMany(MentoringPropositions, { as: 'propositions', foreignKey: 'campaignId' });
MentoringPropositions.belongsTo(Campaigns, { as: 'campaign', foreignKey: 'campaignId' });

// Many Campaigns to many Mentors
Campaigns.belongsToMany(Mentors, {
    as: 'mentors',
    through: 'campaigns_mentors',
    foreignKey: 'campaignId',
});
Mentors.belongsToMany(Campaigns, {
    as: 'campaigns',
    through: 'campaigns_mentors',
    foreignKey: 'mentorId',
});

// One Students to many Internships
Students.hasMany(Internships, { as: 'internships', foreignKey: 'studentId', sourceKey: 'id' });
Internships.belongsTo(Students, { as: 'student', foreignKey: 'studentId', targetKey: 'id' });

// One Internship to many Files
Internships.hasMany(Files, { as: 'files', foreignKey: 'internshipId' });
Files.belongsTo(Internships, { as: 'internship', foreignKey: 'internshipId' });

// One Validated Campaign to many Internships
Campaigns.hasMany(Internships, { as: 'validatedInternships', foreignKey: 'validatedCampaignId' });
Internships.belongsTo(Campaigns, { as: 'validatedCampaign', foreignKey: 'validatedCampaignId' });

// One Available Campaign to many Internships
Campaigns.hasMany(Internships, { as: 'availableInternships', foreignKey: 'availableCampaignId' });
Internships.belongsTo(Campaigns, { as: 'availableCampaign', foreignKey: 'availableCampaignId' });

export default database.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
