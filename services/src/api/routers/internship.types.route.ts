import express from 'express';
import { checkSchema } from 'express-validator';

import * as InternshipTypesCtrl from '../controllers/internship.types.ctrl';

import { ID, InternshipID, CampaignID } from '../validators/generic.val';
import { InternshipTypeUpdate, InternshipTypeCreate } from '../validators/internshipTypes.val';

const router = express.Router();

// Internships types
router.get('', InternshipTypesCtrl.getInternshipTypes);
router.post('', checkSchema(InternshipTypeCreate), InternshipTypesCtrl.postInternshipType);
router.get('/:id', checkSchema(ID), InternshipTypesCtrl.getInternshipType);
router.put(
    '/:id',
    checkSchema(Object.assign({}, ID, InternshipTypeUpdate)),
    InternshipTypesCtrl.putInternshipType,
);
router.delete('/:id', checkSchema(ID), InternshipTypesCtrl.deleteInternshipType);

// Internships types link to internships
router.get('/:id/internships', checkSchema(ID), InternshipTypesCtrl.getInternshipTypeInternships);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    InternshipTypesCtrl.linkInternshipTypeInternship,
);

// Internships types link to campaigns
router.get('/:id/campaigns', checkSchema(ID), InternshipTypesCtrl.getInternshipTypeCampaigns);
router.post(
    '/:id/campaigns/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    InternshipTypesCtrl.linkInternshipTypeCampaign,
);

export default router;
