import path from 'path';

import { email } from './config';

/**
 * @summary Method used to send welcom message to new user
 * @param {string} to Dest user
 * @returns {Promise<string>} Resolve: send message
 */
export function sendWelcom(to: string): Promise<string> {
    return email.send({
        template: path.join(__dirname, 'templates', 'welcome'),
        message: { to },
        locals: {},
    });
}
