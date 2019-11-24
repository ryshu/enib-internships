import request from '@/utils/request';

import { Statistics, CampaignStatistics } from '@/declarations';

export function getDefaultStats(): Statistics {
  return {
    internships: {
      total: 0,
      waiting: 0,
      published: 0,
      attributed_student: 0,
      available_campaign: 0,
      attributed_mentor: 0,
      running: 0,
      validation: 0,
      archived: 0,
    },
    mentors: 0,
    propositions: 0,
    students: 0,
  };
}

export function getDefaultCampaignStats(): CampaignStatistics {
  return {
    campaign: 1,
    internships: {
      attributed: 0,
      availables: 0,
      total: 0,
    },
    mentors: 0,
    propositions: 0,
    students: 0,
  };
}

export const getGlobalStatistics = () =>
  (request({ url: `/statistics`, method: 'get' }) as any) as Promise<
    Statistics
  >;

export const getCampaignStatistics = (id: number) =>
  (request({
    url: `/campaigns/${id}/statistics`,
    method: 'get',
  }) as any) as Promise<CampaignStatistics>;
