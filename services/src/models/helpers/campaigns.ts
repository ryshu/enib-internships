import sequelize = require('sequelize');

import Campaigns from '../../models/sequelize/Campaigns';
import Internships from '../../models/sequelize/Internships';
import InternshipTypes from '../../models/sequelize/InternshipTypes';
import Mentors from '../../models/sequelize/Mentors';

import { ProgressChannel } from '../../websocket/channels/private';
import { sendCampaignsCreate } from '../../emails';
import cache from '../../statistics/singleton';
import { APIError } from '../../utils/error';
import httpStatus from 'http-status-codes';

async function internshipInject(
    internship: Internships,
    campaign: Campaigns,
    channel: ProgressChannel,
) {
    await internship.setAvailableCampaign(campaign);
    if (channel) {
        channel.step(internship.subject);
    }
}

async function mentorInject(mentor: Mentors, campaign: Campaigns, channel?: ProgressChannel) {
    await mentor.addCampaign(campaign);
    if (channel) {
        channel.step({
            msg: `${mentor.firstName[0].toUpperCase()}${mentor.firstName
                .slice(1)
                .toLowerCase()} ${mentor.lastName.toUpperCase()}`,
        });
    }
}

async function mentorSendMail(mentor: Mentors, campaign: Campaigns, channel?: ProgressChannel) {
    if (process.env.NODE_ENV) {
        await sendCampaignsCreate(mentor.email, campaign);
    }

    if (channel) {
        channel.step({
            msg: `${mentor.firstName[0].toUpperCase()}${mentor.firstName
                .slice(1)
                .toLowerCase()} ${mentor.lastName.toUpperCase()}`,
        });
    }
}

/**
 * @summary Method use to process all launch campaign procedure using socket channel
 * @param {Campaigns} campaign Campaign to process (must include category)
 * @param {ProgressChanel} channel Progress channel to give user update about processing
 * @returns {Promise<void>} Resolve: void
 * @returns {Promise<any>} Reject: error encountered
 */
export function LaunchCampaign(campaign: Campaigns, channel?: ProgressChannel): Promise<void> {
    // TODO: Add logger for this function
    return new Promise(async (resolve, reject) => {
        try {
            if (!campaign.category) {
                throw new APIError(
                    `Coulnd't use LaunchCampaign without giving category`,
                    httpStatus.INTERNAL_SERVER_ERROR,
                    httpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            const category = campaign.category;
            const promises = [];

            // Setup all internships link

            // Query data to get all internships not linked to other campaign
            const internships = await Internships.findAll({
                where: {
                    availableCampaignId: null,
                    validatedCampaignId: null,
                    categoryId: category.id,
                },
                include: [
                    {
                        model: Campaigns,
                        as: 'availableCampaign',
                        attributes: [],
                        duplicating: false,
                    },
                    {
                        model: Campaigns,
                        as: 'validatedCampaign',
                        attributes: [],
                        duplicating: false,
                    },
                    { model: InternshipTypes, as: 'category', attributes: [], duplicating: false },
                ],
                group: [sequelize.col(`Internships.id`)],
            });
            const mentors = await Mentors.findAll();

            if (channel) {
                // Emit initialize message
                channel.start({
                    todo: mentors.length * 2 + internships.length,
                    type: MessageType.INITIALIZED,
                });
            }

            // Add all available internship to new
            for (const internship of internships) {
                promises.push(internshipInject(internship, campaign, channel));
            }

            // Setup all mentors link
            for (const mentor of mentors) {
                promises.push(mentorInject(mentor, campaign, channel));
                promises.push(mentorSendMail(mentor, campaign, channel));
            }

            // Resolve all link setup
            await Promise.all(promises);
            cache.newCampain(campaign.id, {
                internships: {
                    total: internships.length,
                    availables: internships.length,
                    attributed: 0,
                },
                mentors: mentors.length,
                students: internships.length,
                campaign: campaign.id,
            });

            if (channel) {
                channel.end();
            }

            resolve();
        } catch (error) {
            if (channel) {
                channel.error(error);
            }
            cache.newCampain(campaign.id, {});
            reject(error);
        }
    });
}
