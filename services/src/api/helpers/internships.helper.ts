import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { INTERNSHIP_MODE } from '../../internship';

import { BAD_REQUEST_VALIDATOR, checkContent, UNPROCESSABLE_ENTITY } from './global.helper';

import InternshipModel, { InternshipOpts } from '../../models/internship.model';

export type FilterByID =
    | 'businessId'
    | 'studentId'
    | 'categoryId'
    | 'availableCampaignId'
    | 'validatedCampaignId'
    | 'campaignId'
    | 'mentorId';

export const filtersByIdList: FilterByID[] = [
    'businessId',
    'studentId',
    'categoryId',
    'availableCampaignId',
    'validatedCampaignId',
    'campaignId',
    'mentorId',
];

export function isFilterId(filterId: string): filterId is FilterByID {
    return filtersByIdList.includes(filterId as FilterByID);
}

export function generateGetInternships(filterByID?: FilterByID) {
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
            mode = [INTERNSHIP_MODE.PUBLISHED],
            isAbroad,
            includes,
        } = req.query;

        const opts: InternshipOpts = {
            countries,
            types,
            subject,
            mode,
            isAbroad,
            includes,
        };
        if (filterByID && isFilterId(filterByID)) {
            opts[filterByID] = Number(req.params.id);
        }

        InternshipModel.getInternships(opts, { page, limit })
            .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
            .catch((e) => UNPROCESSABLE_ENTITY(next, e));
    };
}
