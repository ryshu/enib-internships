import sequelize = require('sequelize');

import Campaigns from '../models/Campaigns';
import Internships from '../models/Internships';
import InternshipTypes from '../models/InternshipTypes';
import Mentors from '../models/Mentors';

import { ProgressChannel } from '../websocket/channels/private';

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

export function LaunchCampaign(campaign: Campaigns, channel?: ProgressChannel) {
    return new Promise(async (resolve, reject) => {
        try {
            const category = await campaign.getCategory();
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
            }

            // Resolve all link setup
            await Promise.all(promises);

            if (channel) {
                channel.end();
            }

            resolve();
        } catch (error) {
            if (channel) {
                channel.error(error);
            }
            reject(error);
        }
    });
}
