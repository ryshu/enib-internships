import { cloneDeep } from 'lodash';

import { Statistics } from './base';

export function getCleanStatistics(stats: Partial<Statistics>): Statistics {
    const tmp = cloneDeep(stats);
    return {
        internships: tmp.internships
            ? {
                  total: tmp.internships.total || 0,
                  availables: tmp.internships.availables || 0,
                  validated: tmp.internships.validated || 0,
              }
            : { total: 0, availables: 0, validated: 0 },

        mentors: tmp.mentors || 0,
        students: tmp.students || 0,
        campaign: tmp.campaign,
    };
}
