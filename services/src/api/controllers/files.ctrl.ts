import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Import files ORM class
import Files from '../../models/Files';
import httpStatus from 'http-status-codes';

// Factorization methods to handle errors
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { paginate } from '../helpers/pagination.helper';

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
    let max: number;

    Files.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Files.findAll(paginate({ page, limit }));
        })
        .then((files) => {
            if (checkArrayContent(files, next)) {
                return res.send({
                    page,
                    data: files,
                    length: files.length,
                    max,
                });
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
        size: req.body.size,
        type: req.body.type,
        path: req.body.path,
    };
    // Insert file in database
    Files.create(file)
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

    Files.findByPk(req.params.id)
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

    Files.findByPk(req.params.id)
        .then((file) => {
            if (!checkContent(file, next)) {
                return undefined;
            }

            if (req.body.name) {
                file.set('name', req.body.name);
            }
            if (req.body.size) {
                file.set('size', req.body.size);
            }
            if (req.body.type) {
                file.set('type', req.body.type);
            }
            if (req.body.path) {
                file.set('path', req.body.path);
            }

            return file.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
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

    Files.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined)) // Call destroy on selected file
        .then(() => res.sendStatus(httpStatus.OK)) // Return OK status
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
