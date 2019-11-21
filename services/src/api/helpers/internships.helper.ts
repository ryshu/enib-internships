import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import InternshipModel from '../../models/internship.model';

import Internships from '../../models/sequelize/Internships';

import { INTERNSHIP_MODE } from '../../statistics/base';

import { BAD_REQUEST_VALIDATOR, checkContent, UNPROCESSABLE_ENTITY } from './global.helper';

const InternshipModePriority = [
    INTERNSHIP_MODE.VALIDATED,
    INTERNSHIP_MODE.ATTRIBUTED,
    INTERNSHIP_MODE.AVAILABLE,
    INTERNSHIP_MODE.WAITING,
    INTERNSHIP_MODE.SUGGESTED,
];

export function generateGetInternships(filterByID?: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        // @see validator + router
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return BAD_REQUEST_VALIDATOR(next, errors);
        }

        // Retrive query data
        const {
            page = 1,
            limit = 20,
            countries,
            types,
            subject,
            mode = INTERNSHIP_MODE.AVAILABLE,
            isAbroad,
        } = req.query;

        const opts: any = {
            countries,
            types,
            subject,
            mode,
            isAbroad,
        };
        if (filterByID) {
            opts[filterByID] = Number(req.params.id);
        }

        InternshipModel.getInternships(opts, { page, limit })
            .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
            .catch((e) => UNPROCESSABLE_ENTITY(next, e));
    };
}
