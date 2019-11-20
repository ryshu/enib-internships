import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';

// Import files ORM class
import FileModel from '../../models/files.model';

// Factorization methods to handle errors
import {
    UNPROCESSABLE_ENTITY,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

import { IFileEntity } from '../../declarations/file';

/**
 * GET /files
 * Used to GET all files
 */
export const getFiles = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    FileModel.getFiles({}, { page, limit })
        .then((data) => {
            if (checkContent(data, next)) {
                return res.send(data);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
/**
 * POST /file
 * Used to create a new file entry
 */
export const postFile = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Get all data, we aren't afraid of having wrong data because we validate them before
    const file: IFileEntity = {
        name: req.body.name,
        type: req.body.type,
        path: req.file.destination,
    };

    // Insert file in database
    FileModel.createFile(file)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /file/:id
 * Used to select a file by ID
 */
export const getFile = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    FileModel.getFile(Number(req.params.id))
        .then((val) => {
            // Check if we have content, and if so return it
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /files/:id
 * Used to update file values
 */
export const putFile = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    FileModel.updateFile(Number(req.params.id), req.body)
        .then((updated) => {
            if (checkContent(updated, next)) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * DELETE /files/:id
 * Used to remove a file from database
 */
export const deleteFile = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    FileModel.removeFile(Number(req.params.id))
        .then(() => res.sendStatus(httpStatus.OK)) // Return OK status
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
/**
 * GET /files/:id/interships
 * Used to select a file by ID and return his internship
 */
export const getFileInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    FileModel.getFile(Number(req.params.id))
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.internship);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /files/:id/internships/:internship_id/link
 * Used to get all files of a internship
 */
export const linkFilesInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    FileModel.linkToInternship(Number(req.params.id), Number(req.params.internship_id))
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
