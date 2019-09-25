import database from '../instances/database';

import '../../models/Businesses';
import '../../models/Files';
import '../../models/Internships';
import '../../models/MentoringPropositions';
import '../../models/Mentors';
import '../../models/Students';

database.sync();
