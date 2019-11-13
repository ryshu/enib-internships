import path from 'path';
import moment from 'moment';

import Campaigns from '../models/Campaigns';

import { email } from './config';

/**
 * @summary Method used to send welcome message to new user
 * @param {string} to Dest user
 * @param {string} locale language to use in email (e.g.: 'fr')
 * @returns {Promise<any>} Resolve: send message
 */
export function sendWelcome(to: string, locale?: string): Promise<any> {
    return email.send({
        template: path.join(__dirname, 'templates', 'welcome'),
        message: { to },
        locals: {
            locale: locale || 'fr',
        },
    });
}

/**
 * @summary Method used to send campaigns creation message to new user
 * @param {string} to Dest user
 * @param {Campaigns} campaigns Instance of the created campaigns
 * @param {string} locale language to use in email (e.g.: 'fr')
 * @returns {Promise<any>} Resolve: send message
 */
export async function sendCampaignsCreate(
    to: string,
    campaigns: Campaigns,
    locale?: string,
): Promise<any> {
    return email.send({
        template: path.join(__dirname, 'templates', 'campaignsCreate'),
        message: { to },
        locals: {
            locale: locale || 'fr',
            name: await campaigns.getCategory(),
            studentCnt: await campaigns.countAvailableInternships(),
            start: campaigns.startAt
                ? moment(campaigns.startAt)
                      .locale(locale || 'fr')
                      .calendar()
                : moment()
                      .locale(locale || 'fr')
                      .calendar(),
            end: campaigns.endAt
                ? moment(campaigns.endAt)
                      .locale(locale || 'fr')
                      .calendar()
                : 'N/A',
        },
    });
}
