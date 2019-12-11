import { Op } from 'sequelize';

import logger from '../../utils/logger';

import cache from '../../statistics/singleton';

import Internships from '../../models/sequelize/Internships';
import Students from '../../models/sequelize/Students';
import Mentors from '../../models/sequelize/Mentors';
import MentoringPropositions from '../../models/sequelize/MentoringPropositions';
import Campaigns from '../../models/sequelize/Campaigns';
import { CampaignStatistics, Statistics } from '../../statistics/base';

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

    const global: Statistics = {
        internships: {
            total: await Internships.count(),
            abroad: await Internships.count({ where: { isInternshipAbroad: true } }),
            waiting: await Internships.count({ where: { state: 'waiting' } }),
            published: await Internships.count({ where: { state: 'published' } }),
            attributed_mentor: await Internships.count({ where: { state: 'attributed_mentor' } }),
            attributed_student: await Internships.count({ where: { state: 'attributed_student' } }),
            available_campaign: await Internships.count({ where: { state: 'available_campaign' } }),
            running: await Internships.count({ where: { state: 'running' } }),
            validation: await Internships.count({ where: { state: 'validation' } }),
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
    logger.info(
        `STATISTICS - Global (internships: ${global.internships.total},students: ${global.students}, mentors: ${global.mentors}, propositions: ${global.propositions})`,
    );
    stats.forEach((s) =>
        logger.info(
            `STATISTICS - Campaign n°${s.campaign} (internships: ${s.internships.total}, students: ${s.students}, propositions: ${s.propositions}, mentors: ${s.mentors})`,
        ),
    );
}
