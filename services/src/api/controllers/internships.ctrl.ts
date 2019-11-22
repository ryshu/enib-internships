import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';
import moment from 'moment';

import InternshipModel from '../../models/internship.model';
import FileModel from '../../models/files.model';
import MentoringPropositionModel from '../../models/mentoring.proposition.model';

import {
    UNPROCESSABLE_ENTITY,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { generateGetInternships } from '../helpers/internships.helper';

import { IInternshipEntity } from '../../declarations/internship';

import { fullCopyBusiness } from '../processors/businesse.proc';
import { fullCopyCampaign } from '../processors/campaign.proc';
import { fullCopyFile } from '../processors/file.proc';
import { fullCopyInternshipType } from '../processors/internship.type.proc';
import { fullCopyMentor } from '../processors/mentor.proc';
import { fullCopyMentoringProposition } from '../processors/mentoring.proposition.proc';
import { fullCopyStudent } from '../processors/student.proc';
import { APIError } from '../../utils/error';
import { INTERNSHIP_MODE, INTERNSHIP_RESULT } from 'src/internship';
import { InternshipHandler } from '../../internship/internship';

/**
 * GET /internships
 * Used to GET all internships
 */
export const getInternships = generateGetInternships();

/**
 * POST /internship
 * Used to create a new internship entry
 */
export const postInternship = async (req: Request, res: Response, next: NextFunction) => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const internship: IInternshipEntity = {
        subject: req.body.subject,
        description: req.body.description,

        country: req.body.country,
        city: req.body.city,
        postalCode: req.body.postalCode || '',
        address: req.body.address || '',
        additional: req.body.additional || '',

        isInternshipAbroad: req.body.isInternshipAbroad ? true : false,

        state: INTERNSHIP_MODE.WAITING,
        result: INTERNSHIP_RESULT.UNKNOWN,

        publishAt:
            !req.body.publishAt || req.session.info.role !== 'admin'
                ? null
                : moment(req.body.publishAt).valueOf(),
        startAt: !req.body.startAt ? null : moment(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment(req.body.endAt).valueOf(),

        business: fullCopyBusiness(req.body.business),
        category: fullCopyInternshipType(req.body.category),
        mentor: fullCopyMentor(req.body.mentor),
        student: fullCopyStudent(req.body.student),
        availableCampaign: fullCopyCampaign(req.body.availableCampaign),
        validatedCampaign: fullCopyCampaign(req.body.validatedCampaign),
        files:
            req.body.files && Array.isArray(req.body.files)
                ? req.body.files.map((i: any) => fullCopyFile(i))
                : [],
        propositions:
            req.body.propositions && Array.isArray(req.body.propositions)
                ? req.body.propositions.map((i: any) => fullCopyMentoringProposition(i))
                : [],
    };

    let categoryId: number;
    if (!internship.category) {
        // No category to create, check if we have any category id provide
        if (
            req.body.category &&
            req.body.category.id &&
            !Number.isNaN(Number(req.body.category.id))
        ) {
            categoryId = Number(req.body.category.id);
        } else {
            return next(new APIError('No category provide, please provide a category', 400, 12000));
        }
    }

    InternshipModel.createInternship(internship)
        .then(async (created) => {
            let result = created;
            if (created && !Number.isNaN(Number(categoryId))) {
                // If category is given using an id, link internship to category before send reply
                result = (await InternshipModel.linkToCategory(created.id, categoryId)) || created;
            }

            if (req.body.mode === INTERNSHIP_MODE.PUBLISHED || req.session.info.role === 'admin') {
                // If user is admin and mode need to be set to 'published', we publish this internship offer
                result = (await new InternshipHandler(result).toPublished()).toJSON();
            }

            return res.send(result);
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id
 * Used to select a internship by ID
 */
export const getInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /internship/:id
 * Used to update internship values
 */
export const putInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.updateInternship(Number(req.params.id), req.body)
        .then((updated) => (checkContent(updated, next) ? res.send(updated) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * DELETE /internship/:id
 * Used to remove a internship from database
 */
export const deleteInternship = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.removeInternship(Number(req.params.id))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internship/:id/fsm
 * Used to update an internship status
 */
export const upadteFSMInternship = async (req: Request, res: Response, next: NextFunction) => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Validate query before any processing
    const query = {
        state: req.body.state as INTERNSHIP_MODE,
        studentId: req.body.studentId ? Number(req.body.studentId) : undefined,
        mentorId: req.body.mentorId ? Number(req.body.mentorId) : undefined,
        campaignId: req.body.campaignId ? Number(req.body.campaignId) : undefined,
        endAt: req.body.endAt ? moment(req.body.endAt).valueOf() : undefined,
        result: req.body.result as INTERNSHIP_RESULT,
    };

    if (query.state === INTERNSHIP_MODE.ATTRIBUTED_MENTOR && !query.mentorId) {
        next(
            new APIError(
                `Change to '${INTERNSHIP_MODE.ATTRIBUTED_MENTOR}' required you to provide the mentor identifier`,
                400,
                12000,
            ),
        );
    } else if (query.state === INTERNSHIP_MODE.ATTRIBUTED_STUDENT && !query.studentId) {
        next(
            new APIError(
                `Change to '${INTERNSHIP_MODE.ATTRIBUTED_STUDENT}' required you to provide the student identifier`,
                400,
                12000,
            ),
        );
    } else if (query.state === INTERNSHIP_MODE.AVAILABLE_CAMPAIGN && !query.campaignId) {
        next(
            new APIError(
                `Change to '${INTERNSHIP_MODE.AVAILABLE_CAMPAIGN}' required you to provide the campaign identifier`,
                400,
                12000,
            ),
        );
    } else if (query.state === INTERNSHIP_MODE.ARCHIVED && !query.result) {
        next(
            new APIError(
                `Change to '${INTERNSHIP_MODE.ARCHIVED}' required you to provide the result identifier`,
                400,
                12000,
            ),
        );
    }

    try {
        const internship = await InternshipModel.getInternship(Number(req.params.id));
        if (!checkContent(internship, next)) {
            return;
        }
        const handler = new InternshipHandler(internship);

        switch (query.state) {
            case INTERNSHIP_MODE.ARCHIVED:
                await handler.archive(query.result);
                break;
            case INTERNSHIP_MODE.ATTRIBUTED_MENTOR:
                await handler.toAttributedMentor(query.mentorId);
                break;
            case INTERNSHIP_MODE.ATTRIBUTED_STUDENT:
                await handler.toAttributedStudent(query.studentId);
                break;
            case INTERNSHIP_MODE.AVAILABLE_CAMPAIGN:
                await handler.toCampaignAvailable(query.campaignId);
                break;
            case INTERNSHIP_MODE.PUBLISHED:
                await handler.toPublished();
                break;
            case INTERNSHIP_MODE.RUNNING:
                await handler.toRunning(query.endAt);
                break;
            case INTERNSHIP_MODE.VALIDATION:
                await handler.toValidation();
                break;
            case INTERNSHIP_MODE.WAITING:
                await handler.toWaiting();
                break;
            default:
                break;
        }

        return res.send(handler.toJSON());
    } catch (error) {
        if (error instanceof APIError) {
            next(error);
        } else {
            UNPROCESSABLE_ENTITY(next, error);
        }
    }
};

/**
 * GET /internships/:id/businesses
 * Used to select a internship by ID and return his business
 */
export const getInternshipBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.business) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/businesses/:business_id/link
 * Used to create a link between internships and business
 */
export const linkInternshipBusinesses = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToBusiness(Number(req.params.id), Number(req.params.business_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internships/:id/internshipTypes
 * Used to select a internship by ID and return his category
 */
export const getInternshipInternshipType = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.category) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/internshipTypes/:internship_type_id/link
 * Used to create a link between internships and internshipsTypes
 */
export const linkInternshipInternshipTypes = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToCategory(Number(req.params.id), Number(req.params.internship_type_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id/student
 * Used to select a internship by ID and return his student
 */
export const getInternshipStudent = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.student) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/student/:student_id/link
 * Used to link internship to a student
 */
export const linkInternshipStudents = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToStudent(Number(req.params.id), Number(req.params.student_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id/files
 * Used to get all files of an internship
 */
export const getInternshipFiles = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    FileModel.getFiles({ internshipId: Number(req.params.id) }, { page, limit })
        .then((files) => (checkContent(files, next) ? res.send(files) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internships/:id/files/:files_id/link
 * Used to get all files of a internships
 */
export const linkInternshipFiles = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToFile(Number(req.params.id), Number(req.params.file_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id/availableCampaign
 * Used to select a internship by ID and return his availableCampaign
 */
export const getAvailabletInternshipCampaign = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.availableCampaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/campaign/:campaign_id/link
 * Used to link internship to a campaign
 */
export const linkAvailableCampaignInternships = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToAvailableCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id/campaign
 * Used to select a internship by ID and return his validatedCampaign
 */
export const getValidatedInternshipCampaign = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.validatedCampaign) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/validatedCampaign/:campaign_id/link
 * Used to link internship to a validatedCampaign
 */
export const linkValidatedCampaignInternships = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToValidatedCampaign(Number(req.params.id), Number(req.params.campaign_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id/propositions
 * Used to get all propositions of an internship
 */
export const getInternshipPropositions = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
    // Retrive query data
    const { page = 1, limit = 20 } = req.query;

    MentoringPropositionModel.getMentoringPropositions(
        { internshipId: Number(req.params.id) },
        { page, limit },
    )
        .then((propositions) =>
            checkContent(propositions, next) ? res.send(propositions) : undefined,
        )
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internships/:id/propositions/:mentoring_proposition_id/link
 * Used to get all propositions of a internships
 */
export const linkInternshipPropositions = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToProposition(
        Number(req.params.id),
        Number(req.params.mentoring_proposition_id),
    )
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /internship/:id/mentors
 * Used to select a internship by ID and return his mentor
 */
export const getInternshipMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.getInternship(Number(req.params.id))
        .then((val) => (checkContent(val, next) ? res.send(val.mentor) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /internships/:id/mentors/:mentor_id/link
 * Used to link internship to a mentor
 */
export const linkInternshipMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    InternshipModel.linkToMentor(Number(req.params.id), Number(req.params.mentor_id))
        .then((internship) => (checkContent(internship, next) ? res.send(internship) : undefined))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
