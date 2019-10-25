import { Request } from 'express';

import { isStudent, getEmail, guessStudentFullName, guessMentorFullName } from './utils';

import logger from '../../utils/logger';

import Mentors from '../../models/Mentors';
import Students from '../../models/Students';

/**
 * @summary Method used to handle cas connection and setup user info
 * @param {Request} req Express request
 * @throws {Error} If no session found `No session found in given request`
 */
export async function handleConnection(req: Request) {
    // Check if any session is defined
    if (req.session && req.session.cas_user) {
        // Check if cas user is a student and get his email
        const student = isStudent(req.session.cas_user);
        const email = getEmail(req.session.cas_user);

        // Try to get our user in database
        const user = student
            ? await Mentors.findOne({ where: { email } })
            : await Students.findOne({ where: { email } });

        if (user) {
            // This user is in database, copy his info into session
            req.session.info = user;
            if (student) {
                // Set student roles, avoid to store role in database
                req.session.info.role = 'student';
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
        logger.info(`Inject "${req.session.cas_user}" into database after his first connection`);
        return;
    }
    throw new Error('No session found in given request');
}
