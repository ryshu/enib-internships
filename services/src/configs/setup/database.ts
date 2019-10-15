import database from '../instances/database';

import Businesses from '../../models/Businesses';
import Files from '../../models/Files';
import Internships from '../../models/Internships';
import MentoringPropositions from '../../models/MentoringPropositions';
import Mentors from '../../models/Mentors';
import Students from '../../models/Students';

Businesses.hasMany(Internships, { as: 'internships', foreignKey: 'businessId', sourceKey: 'id' });
Internships.belongsTo(Businesses, { as: 'business', foreignKey: 'businessId', targetKey: 'id' });

export default database.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
