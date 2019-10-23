import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import moment from 'moment';
import httpStatus from 'http-status-codes';

import Campaigns from '../../models/Campaigns';
import MentoringPropositions from '../../models/MentoringPropositions';
import Internships from '../../models/Internships';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
import { paginate } from '../helpers/pagination.helper';

/**
 * GET /campaigns
 * Used to GET all campaigns
 */
export const getCampaigns = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Retrive query data
    const { page = 1, limit = 20 } = req.query;
    let max: number;
    Campaigns.count()
        .then((rowNbr) => {
            max = rowNbr;
            return Campaigns.findAll(paginate({ page, limit }));
        })
        .then((campaigns) => {
            if (checkArrayContent(campaigns, next)) {
                return res.send({
                    page,
                    data: campaigns,
                    length: campaigns.length,
                    max,
                });
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /campaignss
 * Used to create a new campaign entry
 */
export const postCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const campaign: ICampaignEntity = {
        name: req.body.name,
        startAt: !req.body.startAt ? null : moment(req.body.startAt).valueOf(),
        endAt: !req.body.endAt ? null : moment(req.body.endAt).valueOf(),
        description: req.body.description,
        semester: req.body.semester,
        maxProposition: req.body.maxProposition ? req.body.maxProposition : 0,
    };

    Campaigns.create(campaign)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id
 * Used to select a campaign by ID
 */
export const getCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id, {
        include: [{ model: MentoringPropositions, as: 'propositions' }],
    })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /campaigns/:id
 * Used to update campaign values
 */
export const putCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then((campaign) => {
            if (!checkContent(campaign, next)) {
                return undefined;
            }
            if (req.body.name) {
                campaign.set('name', req.body.name);
            }
            if (req.body.description) {
                campaign.set('description', req.body.description);
            }
            if (req.body.startAt) {
                campaign.set(
                    'startAt',
                    req.body.startAt === 0 ? null : moment(req.body.startAt).valueOf(),
                );
            }
            if (req.body.endAt) {
                campaign.set(
                    'endAt',
                    req.body.endAt === 0 ? null : moment(req.body.endAt).valueOf(),
                );
            }
            if (req.body.semester) {
                campaign.set('semester', req.body.semester);
            }
            if (req.body.maxProposition !== undefined) {
                campaign.set(
                    'maxProposition',
                    req.body.maxProposition ? req.body.maxProposition : 0,
                );
            }
            return campaign.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /campaigns/:id
 * Used to remove a campaign from database
 */
export const deleteCampaign = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * GET /campaigns/:id/mentoringPropositions
 * Used to get all mentoringPropositions of a campaign
 */
export const getCampaignMentoringPropositions = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id, {
        include: [{ model: MentoringPropositions, as: 'propositions' }],
    })
        .then(async (val) => {
            if (checkContent(val, next)) {
                return res.send(val.propositions);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/mentoringPropositions/:mentoring_proposition_id/link
 * Used to link a mentoring propositions with a campaign
 */
export const linkCampaignMentoringPropositions = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Campaigns.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addProposition(Number(req.params.mentoring_proposition_id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/availableInternships
 * Used to get all availableInternships of a campaign
 */
export const getAvailableCampaignInternships = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // @see validator + router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return BAD_REQUEST_VALIDATOR(next, errors);
  }

  Campaigns.findByPk(req.params.id, {
      include: [{ model: Internships, as: 'availableInternships' }],
  })
      .then(async (val) => {
          if (checkContent(val, next)) {
              return res.send(val.availableInternships);
          }
      })
      .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/availableInternships/:availableInternships_id/link
 * Used to link an internship with an availableCampaign
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

  Campaigns.findByPk(req.params.id)
      .then(async (val) => {
          if (checkContent(val, next)) {
              await val.addAvailableInternship(Number(req.params.internship_id));
              return res.sendStatus(httpStatus.OK);
          }
      })
      .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /campaigns/:id/validatedInternships
 * Used to get all validatedInternships of a campaign
 */
export const getValidatedCampaignInternships = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // @see validator + router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return BAD_REQUEST_VALIDATOR(next, errors);
  }

  Campaigns.findByPk(req.params.id, {
      include: [{ model: Internships, as: 'validatedInternships' }],
  })
      .then(async (val) => {
          if (checkContent(val, next)) {
              return res.send(val.validatedInternships);
          }
      })
      .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /validatedCampaigns/:id/internships/:validatedCampaign_id/link
 * Used to link an internship with a ValidatedCampaign
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

  Campaigns.findByPk(req.params.id)
      .then(async (val) => {
          if (checkContent(val, next)) {
              await val.addValidatedInternship(Number(req.params.internship_id));
              return res.sendStatus(httpStatus.OK);
          }
      })
      .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
