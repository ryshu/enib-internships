import { Op } from 'sequelize';

import logger from '../../utils/logger';

import cache from '../../statistics/singleton';

import Internships from '../../models/Internships';
import Students from '../../models/Students';
import Mentors from '../../models/Mentors';
import MentoringPropositions from '../../models/MentoringPropositions';
import Campaigns from '../../models/Campaigns';
import { CampaignStatistics } from '../../statistics/base';

export async function setupStatistics() {
    async function _searchCampaign(c: Campaigns): Promise<CampaignStatistics> {
        const campaignCond = {
            [Op.or]: [{ validatedCampaignId: c.id }, { availableCampaignId: c.id }],
        };
        return {
            internships: {
                total: await Internships.count({ where: campaignCond }),
                availables: await Internships.count({ where: { availableCampaignId: c.id } }),
                attributed: await Internships.count({ where: { validatedCampaignId: c.id } }),
            },
            students: await Internships.count({
                where: { ...campaignCond, [Op.not]: { studentId: null } },
            }),
            mentors: await c.countMentors(),

            propositions: await c.countPropositions(),
            campaign: c.id,
        };
    }
    const global = {
        internships: {
            total: await Internships.count(),
            suggested: await Internships.count({ where: { state: 'suggest' } }),
            waiting: await Internships.count({ where: { state: 'waiting' } }),
            availables: await Internships.count({ where: { state: 'available' } }),
            validated: await Internships.count({ where: { state: 'validated' } }),
            attributed: await Internships.count({ where: { state: 'attributed' } }),
            archived: await Internships.count({ where: { state: 'archived' } }),
        },
        students: await Students.count(),
        mentors: await Mentors.count(),

        propositions: await MentoringPropositions.count(),
    };

    const campaigns = await Campaigns.findAll();
    const stats = await Promise.all(campaigns.map((c) => _searchCampaign(c)));

    cache.reset();
    cache.init(global, ...stats);
    logger.info(`STATISTICS - ${JSON.stringify(global, null, 4)}`);
    stats.forEach((s) => logger.info(`STATISTICS - ${JSON.stringify(s, null, 4)}`));
}
