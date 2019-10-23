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

// One Campaigns to many MentoringPropositions
Campaigns.hasMany(MentoringPropositions, { as: 'propositions', foreignKey: 'campaignId' });
MentoringPropositions.belongsTo(Campaigns, { as: 'campaign', foreignKey: 'campaignId' });

// One Students to many Internships
Students.hasMany(Internships, { as: 'internships', foreignKey: 'studentId', sourceKey: 'id' });
Internships.belongsTo(Students, { as: 'student', foreignKey: 'studentId', targetKey: 'id' });

// One Internship to many Files
Internships.hasMany(Files, { as: 'files', foreignKey: 'internshipId' });
Files.belongsTo(Internships, { as: 'internship', foreignKey: 'internshipId' });

export default database.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
