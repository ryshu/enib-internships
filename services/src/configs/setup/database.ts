import database from '../instances/database';

import Businesses from '../../models/Businesses';
import Files from '../../models/Files';
import InternshipTypes from '../../models/InternshipTypes';
import MentoringPropositions from '../../models/MentoringPropositions';
import Mentors from '../../models/Mentors';
import Students from '../../models/Students';
import '../../models/Campaigns';
import Internships from '../../models/Internships';

Businesses.hasMany(Internships, { as: 'internships', foreignKey: 'businessId', sourceKey: 'id' });
Internships.belongsTo(Businesses, { as: 'business', foreignKey: 'businessId', targetKey: 'id' });

InternshipTypes.hasMany(Internships, { as: 'internships', foreignKey: 'categoryId' });
Internships.belongsTo(InternshipTypes, { as: 'category', foreignKey: 'categoryId' });

export default database.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
