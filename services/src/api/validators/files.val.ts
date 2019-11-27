import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional, archivedValidator } from './generic.val';
import { fileVal, internshipVal } from './generator.val';

export const FileList: Schema = {
    ...paginateValidator,
    ...archivedValidator,
};

export const FileCreate: Schema = {
    ...fileVal(),
    ...replaceAllExistByOptional(internshipVal('internship')),
};
export const FileUpdate = replaceAllExistByOptional(FileCreate);
