import database from '../instances/database';

import '../../models/Businesses';
import '../../models/Files';
import '../../models/Internships';
import '../../models/MentoringPropositions';
import '../../models/Mentors';
import '../../models/Students';

export default database.sync({ force: process.env.ORM_DROP_DB_ON_START === 'true' });
