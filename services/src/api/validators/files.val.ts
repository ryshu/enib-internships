import { Schema } from 'express-validator';

import { paginateValidator, replaceAllExistByOptional } from './generic.val';
import { fileVal, internshipVal } from './generator.val';

export const FileList: Schema = {
    ...paginateValidator,
};

export const FileCreate: Schema = {
    ...fileVal(),
    ...replaceAllExistByOptional(internshipVal('internship')),
};
export const FileUpdate = replaceAllExistByOptional(FileCreate);
