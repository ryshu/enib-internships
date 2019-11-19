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
    checkSchema(ID),
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
    checkSchema(ID),
    CampaignsCtrl.getValidatedCampaignInternships,
);
router.post(
    '/:id/validatedInternships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    CampaignsCtrl.linkValidatedCampaignInternships,
);

// Campaigns Availables Internships
router.get(
    '/:id/availableInternships',
    checkSchema(ID),
    CampaignsCtrl.getAvailableCampaignInternships,
);
router.post(
    '/:id/availableInternships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    CampaignsCtrl.linkAvailableCampaignInternships,
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
