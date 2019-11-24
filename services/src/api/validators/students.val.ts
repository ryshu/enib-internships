import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';
import { studentVal, internshipVal } from './generator.val';

export const StudentList: Schema = {
    ...paginateValidator,
};

export const StudentCreate: Schema = {
    ...studentVal(),
    ...replaceAllExistByOptional(internshipVal('internships[*]')),
};

export const StudentUpdate = replaceAllExistByOptional(StudentCreate);
