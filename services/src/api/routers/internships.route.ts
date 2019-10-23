import express from 'express';
import { checkSchema } from 'express-validator';

import * as InternshipsCtrl from '../controllers/internships.ctrl';

import { ID, BusinessID, StudentID, InternshipTypeID, CampaignID } from '../validators/generic.val';
import { InternshipUpdate, InternshipCreate, InternshipsList } from '../validators/internships.val';
import Internships from '../../models/Internships';

const router = express.Router();

// Default internships routes
router.get('', checkSchema(InternshipsList), InternshipsCtrl.getInternships);
router.post('', checkSchema(InternshipCreate), InternshipsCtrl.postInternship);
router.get('/:id', checkSchema(ID), InternshipsCtrl.getInternship);
router.put(
    '/:id',
    checkSchema(Object.assign({}, ID, InternshipUpdate)),
    InternshipsCtrl.putInternship,
);
router.delete('/:id', checkSchema(ID), InternshipsCtrl.deleteInternship);

// Routes for internships-businesses association
router.get('/:id/businesses', checkSchema(ID), InternshipsCtrl.getInternshipBusiness);
router.post(
    '/:id/businesses/:business_id/link',
    checkSchema(Object.assign({}, ID, BusinessID)),
    InternshipsCtrl.linkInternshipBusinesses,
);

// Routes for internships-internshipTypes association
router.get('/:id/internshipTypes', checkSchema(ID), InternshipsCtrl.getInternshipInternshipType);
router.post(
    '/:id/internshipTypes/:internship_type_id/link',
    checkSchema(Object.assign({}, ID, InternshipTypeID)),
    InternshipsCtrl.linkInternshipInternshipTypes,
);

// Students
router.get('/:id/students', checkSchema(ID), InternshipsCtrl.getInternshipStudent);
router.post(
    '/:id/students/:student_id/link',
    checkSchema(Object.assign({}, ID, StudentID)),
    InternshipsCtrl.linkInternshipStudents,
);

// Available Campaigns
router.get('/:id/availableCampaign', checkSchema(ID), InternshipsCtrl.geAvailabletInternshipCampaign);
router.post(
    '/:id/availableCampaign/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    InternshipsCtrl.linkAvailableCampaignInternships,
);

// Validated Campaigns
router.get('/:id/validatedCampaign', checkSchema(ID), InternshipsCtrl.geValidatedInternshipCampaign);
router.post(
    '/:id/validatedCampaign/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    InternshipsCtrl.linkValidatedCampaignInternships,
);

export default router;
