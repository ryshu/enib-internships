import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional, archivedValidator } from './generic.val';
import { studentVal, internshipVal } from './generator.val';

export const StudentList: Schema = {
    ...paginateValidator,
    ...archivedValidator,
};

export const StudentCreate: Schema = {
    ...studentVal(),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
};

export const StudentUpdate = replaceAllExistByOptional(StudentCreate);
