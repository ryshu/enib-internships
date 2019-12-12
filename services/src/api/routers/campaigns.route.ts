import express from 'express';
import { checkSchema } from 'express-validator';

import * as CampaignsCtrl from '../controllers/campaigns.ctrl';
import { getCampaignStatistics } from '../controllers/statistics.ctrl';

import {
    ID,
    MentoringPropositionID,
    MentorID,
    InternshipTypeID,
    InternshipID,
} from '../validators/generic.val';
import { CampaignUpdate, CampaignCreate, CampaignList } from '../validators/campaigns.val';
import { InternshipsList } from '../validators/internships.val';
import { MentoringPropositionsList } from '../validators/mentoringPropositions.val';

const router = express.Router();

// Campaigns
router.get('', checkSchema(CampaignList), CampaignsCtrl.getCampaigns);
router.post('', checkSchema(CampaignCreate), CampaignsCtrl.postCampaign);
router.get('/:id', checkSchema(ID), CampaignsCtrl.getCampaign);
router.put('/:id', checkSchema(Object.assign({}, ID, CampaignUpdate)), CampaignsCtrl.putCampaign);
router.delete('/:id', checkSchema(ID), CampaignsCtrl.deleteCampaign);

// Campaigns MentoringPropositions
router.get(
    '/:id/mentoringPropositions',
    checkSchema(Object.assign({}, ID, MentoringPropositionsList)),
    CampaignsCtrl.getCampaignMentoringPropositions,
);
router.post(
    '/:id/mentoringPropositions/:mentoring_proposition_id/link',
    checkSchema(Object.assign({}, ID, MentoringPropositionID)),
    CampaignsCtrl.linkCampaignMentoringPropositions,
);

// Campaigns Validated internships
router.get(
    '/:id/validatedInternships',
    checkSchema(Object.assign({}, ID, InternshipsList)),
    CampaignsCtrl.getValidatedCampaignInternships,
);

// Campaigns Available Internships
router.get(
    '/:id/availableInternships',
    checkSchema(Object.assign({}, ID, InternshipsList)),
    CampaignsCtrl.getAvailableCampaignInternships,
);
router.post(
    '/:id/availableInternships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    CampaignsCtrl.linkAvailableCampaignInternships,
);

// Campaigns all internships
router.get(
    '/:id/internships',
    checkSchema(Object.assign({}, ID, InternshipsList)),
    CampaignsCtrl.getCampaignInternships,
);

// Campaigns Mentors
router.get('/:id/mentors', checkSchema(ID), CampaignsCtrl.getCampaignMentors);
router.post(
    '/:id/mentors/:mentor_id/link',
    checkSchema(Object.assign({}, ID, MentorID)),
    CampaignsCtrl.linkCampaignMentor,
);

// Campaigns internship types
router.get('/:id/internshipTypes', checkSchema(ID), CampaignsCtrl.getCampaignInternshipType);
router.post(
    '/:id/internshipTypes/:internship_type_id/link',
    checkSchema(Object.assign({}, ID, InternshipTypeID)),
    CampaignsCtrl.linkCampaignInternshipType,
);

router.get('/:id/statistics', checkSchema(ID), getCampaignStatistics);

export default router;
