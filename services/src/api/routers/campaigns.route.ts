import express from 'express';
import { checkSchema } from 'express-validator';

import * as CampaignsCtrl from '../controllers/campaigns.ctrl';

import { ID, MentoringPropositionID, MentorID } from '../validators/generic.val';
import { CampaignUpdate, CampaignCreate, CampaignList } from '../validators/campaigns.val';

const router = express.Router();

router.get('', checkSchema(CampaignList), CampaignsCtrl.getCampaigns);
router.post('', checkSchema(CampaignCreate), CampaignsCtrl.postCampaign);
router.get('/:id', checkSchema(ID), CampaignsCtrl.getCampaign);
router.put('/:id', checkSchema(Object.assign({}, ID, CampaignUpdate)), CampaignsCtrl.putCampaign);
router.delete('/:id', checkSchema(ID), CampaignsCtrl.deleteCampaign);

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

router.get('/:id/mentors', checkSchema(ID), CampaignsCtrl.getCampaignMentors);
router.post(
    '/:id/mentors/:mentor_id/link',
    checkSchema(Object.assign({}, ID, MentorID)),
    CampaignsCtrl.linkCampaignMentor,
);

export default router;
