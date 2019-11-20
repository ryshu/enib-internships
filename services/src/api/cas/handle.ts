import { Request } from 'express';

import { isStudent, getEmail, guessStudentFullName, guessMentorFullName } from './utils';

import logger from '../../utils/logger';

import Mentors from '../../models/sequelize/Mentors';
import Students from '../../models/sequelize/Students';

import { adminsCasUsername } from '../../configs/data/admin';

import { sendWelcome } from '../../emails';

import { IStudentEntity, IMentorEntity } from '../../declarations';

const handled: string[] = [];

const wait = (ms: number) => new Promise((r, j) => setTimeout(r, ms));
/**
 * @summary Method used to handle cas connection and setup user info
 * @param {Request} req Express request
 * @throws {Error} If no session found `No session found in given request`
 */
export async function handleConnection(req: Request) {
    // Check if any session is defined
    if (req.session && req.session.cas_user) {
        // Check if cas user is a student and get his email
        // Check also if username isn't included in admin list (case when user is admin)
        const student =
            isStudent(req.session.cas_user) && !adminsCasUsername.includes(req.session.cas_user);
        const email = getEmail(req.session.cas_user);

        // When user create is already handled, we wait few time
        // This is used to prevent a multi user insert
        while (handled.includes(req.session.cas_user)) {
            await wait(100);
        }
        handled.push(req.session.cas_user);

        // Try to get our user in database
        const user = student
            ? await Students.findOne({ where: { email } })
            : await Mentors.findOne({ where: { email } });

        if (user) {
            // This user is in database, copy his info into session
            req.session.info = user;
            if (student) {
                // Set student roles, avoid to store role in database
                req.session.info.role = 'student';
            }
            const found1 = handled.findIndex((h) => h === req.session.cas_user);
            if (found1 !== -1) {
                handled.splice(found1, 1);
            }
            return;
        }

        // Else, we need to register this user, it's his first connection
        if (student) {
            const newUser: IStudentEntity = {
                ...guessStudentFullName(req.session.cas_user),
                email,
                semester: 'S1',
            };

            // Register our new student and set his data in session info
            req.session.info = await Students.create(newUser);
        } else {
            const newUser: IMentorEntity = {
                ...guessMentorFullName(req.session.cas_user),
                email,
                role: 'default',
            };

            // Register our new mentor and set his data in session info
            req.session.info = await Mentors.create(newUser);
        }
        // Send welcom email to new user
        await sendWelcome(email);

        logger.info(`Inject "${req.session.cas_user}" into database after his first connection`);
        const found2 = handled.findIndex((h) => h === req.session.cas_user);
        if (found2 !== -1) {
            handled.splice(found2, 1);
        }
        return;
    }
    throw new Error('No session found in given request');
}
