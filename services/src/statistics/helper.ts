import { cloneDeep } from 'lodash';

import { Statistics, CampaignStatistics } from './base';

export function getCleanStatistics(stats: Partial<Statistics>): Statistics {
    const tmp = cloneDeep(stats);
    return {
        internships: tmp.internships
            ? {
                  abroad: tmp.internships.abroad || 0,
                  total: tmp.internships.total || 0,
                  waiting: tmp.internships.waiting || 0,
                  published: tmp.internships.published || 0,
                  attributed_student: tmp.internships.attributed_student || 0,
                  attributed_mentor: tmp.internships.attributed_mentor || 0,
                  available_campaign: tmp.internships.available_campaign || 0,
                  running: tmp.internships.running || 0,
                  validation: tmp.internships.validation || 0,
                  archived: tmp.internships.archived || 0,
              }
            : {
                  abroad: 0,
                  total: 0,
                  waiting: 0,
                  published: 0,
                  attributed_student: 0,
                  attributed_mentor: 0,
                  available_campaign: 0,
                  running: 0,
                  validation: 0,
                  archived: 0,
              },

        mentors: tmp.mentors || 0,
        students: tmp.students || 0,
        propositions: tmp.propositions || 0,
    };
}

export function getCleanCampaignStatistics(stats: Partial<CampaignStatistics>): CampaignStatistics {
    const tmp = cloneDeep(stats);
    return {
        internships: tmp.internships
            ? {
                  total: tmp.internships.total || 0,
                  availables: tmp.internships.availables || 0,
                  attributed: tmp.internships.attributed || 0,
              }
            : { total: 0, availables: 0, attributed: 0 },

        mentors: tmp.mentors || 0,
        students: tmp.students || 0,
        propositions: tmp.propositions || 0,
        campaign: tmp.campaign,
    };
}
