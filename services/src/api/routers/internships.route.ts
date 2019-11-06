import express from 'express';
import { checkSchema } from 'express-validator';

import * as InternshipsCtrl from '../controllers/internships.ctrl';

import {
    ID,
    BusinessID,
    StudentID,
    InternshipTypeID,
    FileID,
    CampaignID,
    MentoringPropositionID,
    MentorID,
} from '../validators/generic.val';
import { InternshipUpdate, InternshipCreate, InternshipsList } from '../validators/internships.val';

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

// Internships Student
router.get('/:id/students', checkSchema(ID), InternshipsCtrl.getInternshipStudent);
router.post(
    '/:id/students/:student_id/link',
    checkSchema(Object.assign({}, ID, StudentID)),
    InternshipsCtrl.linkInternshipStudents,
);

// Internships Files
router.get('/:id/files', checkSchema(ID), InternshipsCtrl.getInternshipFiles);
router.post(
    '/:id/files/:file_id/link',
    checkSchema(Object.assign({}, ID, FileID)),
    InternshipsCtrl.linkInternshipFiles,
);

// Internships Available Campaign
router.get(
    '/:id/availableCampaigns',
    checkSchema(ID),
    InternshipsCtrl.getAvailabletInternshipCampaign,
);
router.post(
    '/:id/availableCampaigns/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    InternshipsCtrl.linkAvailableCampaignInternships,
);

// Internships Validated Campaign
router.get(
    '/:id/validatedCampaigns',
    checkSchema(ID),
    InternshipsCtrl.getValidatedInternshipCampaign,
);
router.post(
    '/:id/validatedCampaigns/:campaign_id/link',
    checkSchema(Object.assign({}, ID, CampaignID)),
    InternshipsCtrl.linkValidatedCampaignInternships,
);

// Internships Propositions
router.get('/:id/propositions', checkSchema(ID), InternshipsCtrl.getInternshipPropositions);
router.post(
    '/:id/propositions/:mentoring_proposition_id/link',
    checkSchema(Object.assign({}, ID, MentoringPropositionID)),
    InternshipsCtrl.linkInternshipPropositions,
);

// Internships Mentor
router.get('/:id/mentors', checkSchema(ID), InternshipsCtrl.getInternshipMentor);
router.post(
    '/:id/mentors/:mentor_id/link',
    checkSchema(Object.assign({}, ID, MentorID)),
    InternshipsCtrl.linkInternshipMentor,
);

export default router;
